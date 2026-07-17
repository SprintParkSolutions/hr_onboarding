"""
offer_letter_generator.py
═══════════════════════════════════════════════════════════════════════════════
Fills the SprintPark offer-letter PDF template with live candidate data and
returns the finished PDF as raw bytes (ready to base64-encode as an email
attachment).

Strategy
--------
Page 1 of the template has 5 bracketed / labelled blanks we need to fill:
    "SprintPark Ref:"      -> reference number
    "Date:"                -> issue date
    "[Candidate Name]"     -> candidate's full name
    "[Date of Joining]"    -> DOJ
    "[Designation]"        -> role / job title

Rather than hard-coding pixel coordinates (fragile — breaks if the template
is ever re-exported), we locate each placeholder at *load time* with
pdfplumber's text search, then draw the real value directly on top of it
using a transparent reportlab overlay merged in with pypdf. If a future
version of the template changes the wording, this raises a clear error
instead of silently producing a blank letter.

We also append one extra "Compensation Summary" page (Position / Band /
Bonus / Company) right after the filled page 1, generated fresh with
reportlab. The template's own salary table is left untouched (it has many
generic underscore blanks with no way to disambiguate B/asic vs HRA vs PF
programmatically), so we surface the deal terms clearly on the summary page
instead of trying to fill that table cell-by-cell.
"""

import io
import os
from typing import Optional

import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "templates", "SprintPark_Offer_Letter_Template.pdf")

# Placeholder search patterns -> the piece we replace them with.
# "label" placeholders (Ref/Date) keep their prefix and we just append the value.
_PLACEHOLDERS = {
    "candidate_name": r"\[Candidate Name\]",
    "doj":            r"\[Date of Joining\]",
    "designation":    r"\[Designation\]",
    "ref":            r"SprintPark Ref:",
    "date":           r"Date:",
}


def _locate_placeholders(pdf_path: str, page_index: int = 0) -> dict:
    """Search page `page_index` of the template for each known placeholder
    and return {key: bbox_dict}. Raises ValueError if any are missing so a
    template change doesn't silently produce a broken letter."""
    found = {}
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_index]
        for key, pattern in _PLACEHOLDERS.items():
            hits = page.search(pattern, regex=True)
            if not hits:
                raise ValueError(
                    f"Could not find placeholder '{pattern}' on page {page_index + 1} "
                    f"of the offer letter template. The template may have been edited — "
                    f"update _PLACEHOLDERS in offer_letter_generator.py."
                )
            found[key] = hits[0]  # first match
        page_size = (page.width, page.height)
    return found, page_size


def _build_overlay(placeholders: dict, page_size: tuple, values: dict) -> "canvas.Canvas":
    """Build a single-page transparent-background overlay PDF with the real
    values painted at each placeholder's location (white rectangle to blank
    out the bracket text, then the real value drawn in its place)."""
    width, height = page_size
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))

    def paint(key, text, font="Helvetica-Bold", size=11):
        box = placeholders[key]
        x0, x1 = box["x0"], box["x1"]
        top, bottom = box["top"], box["bottom"]
        y_bottom_reportlab = height - bottom
        text_width = c.stringWidth(text, font, size)
        box_width = max(x1 - x0, text_width) + 1
        c.setFillColor(white)
        c.rect(x0 - 1, y_bottom_reportlab - 1, box_width, (bottom - top) + 3, fill=1, stroke=0)
        c.setFillColor(black)
        c.setFont(font, size)
        c.drawString(x0, y_bottom_reportlab + 1.5, text)

    def paint_after_label(key, text, font="Helvetica-Bold", size=11, gap=8):
        """For 'SprintPark Ref:' / 'Date:' — the match IS the label itself,
        so we must keep the label and draw the value just to its right,
        not overwrite the label with a whiteout box."""
        box = placeholders[key]
        x1, top, bottom = box["x1"], box["top"], box["bottom"]
        y_bottom_reportlab = height - bottom
        c.setFillColor(black)
        c.setFont(font, size)
        c.drawString(x1 + gap, y_bottom_reportlab + 1.5, text)

    paint_after_label("ref",  values["ref"])
    paint_after_label("date", values["date"])
    paint("candidate_name", values["candidate_name"])
    paint("doj",             values["doj"], size=10)
    paint("designation",     values["designation"], size=10)

    c.save()
    buf.seek(0)
    return buf


def _build_summary_page(values: dict, page_size: tuple) -> io.BytesIO:
    """A clean, branded 'Compensation Summary' page inserted right after the
    filled page 1, since the template's own salary table can't be reliably
    filled cell-by-cell."""
    width, height = page_size
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))

    margin = 55
    y = height - 90

    # Header bar
    c.setFillColor(HexColor("#6366f1"))
    c.rect(0, height - 70, width, 70, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(margin, height - 45, "Compensation Summary")
    c.setFont("Helvetica", 10)
    c.drawString(margin, height - 60, "SprintPark Solutions Pvt Ltd")

    c.setFillColor(black)
    y = height - 110
    c.setFont("Helvetica", 11)
    c.drawString(margin, y, f"Dear {values['candidate_name']},")
    y -= 22
    c.drawString(margin, y,
                 "Please find below a summary of the key terms of your offer for your reference.")
    y -= 35

    rows = [
        ("Reference No.",        values["ref"]),
        ("Date",                 values["date"]),
        ("Candidate Name",       values["candidate_name"]),
        ("Position / Designation", values["designation"]),
        ("Date of Joining",      values["doj"]),
        ("Compensation Band",    values.get("band", "TBD")),
        ("Joining Bonus",        values.get("bonus", "TBD")),
        ("Company",              "SprintPark Solutions Pvt Ltd"),
    ]

    box_top = y
    row_h = 26
    box_h = row_h * len(rows) + 20
    c.setFillColor(HexColor("#f8f7ff"))
    c.roundRect(margin, box_top - box_h, width - 2 * margin, box_h, 8, fill=1, stroke=0)

    ty = box_top - 20
    c.setFont("Helvetica", 10)
    for label, val in rows:
        c.setFillColor(HexColor("#6b7280"))
        c.drawString(margin + 20, ty, label)
        c.setFillColor(black)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(margin + 220, ty, str(val))
        c.setFont("Helvetica", 10)
        ty -= row_h

    y = box_top - box_h - 30
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(HexColor("#9ca3af"))
    c.drawString(margin, y,
                 "This summary is provided for convenience. The formal terms and conditions on the")
    c.drawString(margin, y - 12,
                 "following pages of this letter, together with Exhibit 1, govern your employment.")

    c.save()
    buf.seek(0)
    return buf


def generate_offer_letter_pdf(
    candidate_name: str,
    designation: str,
    doj_str: str,
    ref_no: str,
    date_str: str,
    band: str = "TBD",
    bonus: str = "TBD",
    template_path: Optional[str] = None,
) -> bytes:
    """
    Fill the SprintPark offer letter template with candidate data and return
    the resulting PDF as bytes.
    """
    template_path = template_path or TEMPLATE_PATH
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Offer letter template not found at {template_path}")

    placeholders, page_size = _locate_placeholders(template_path, page_index=0)

    values = {
        "candidate_name": candidate_name or "Candidate",
        "designation":    designation or "TBD",
        "doj":            doj_str or "To be communicated",
        "ref":            ref_no,
        "date":           date_str,
        "band":           band,
        "bonus":          bonus,
    }

    overlay_buf = _build_overlay(placeholders, page_size, values)
    overlay_reader = PdfReader(overlay_buf)
    overlay_page = overlay_reader.pages[0]

    summary_buf = _build_summary_page(values, page_size)
    summary_reader = PdfReader(summary_buf)
    summary_page = summary_reader.pages[0]

    template_reader = PdfReader(template_path)
    writer = PdfWriter()

    for i, page in enumerate(template_reader.pages):
        if i == 0:
            page.merge_page(overlay_page)
            writer.add_page(page)
            writer.add_page(summary_page)   # inserted right after page 1
        else:
            writer.add_page(page)

    out_buf = io.BytesIO()
    writer.write(out_buf)
    return out_buf.getvalue()


if __name__ == "__main__":
    # Quick manual test
    pdf_bytes = generate_offer_letter_pdf(
        candidate_name="Laxman Kosana",
        designation="Salesforce Developer",
        doj_str="04 August 2026",
        ref_no="SPK/OFR/2026/AAYALAAQ",
        date_str="16 July 2026",
        band="25L",
        bonus="50k",
    )
    with open("/home/claude/test_offer_letter.pdf", "wb") as f:
        f.write(pdf_bytes)
    print(f"Wrote {len(pdf_bytes)} bytes")