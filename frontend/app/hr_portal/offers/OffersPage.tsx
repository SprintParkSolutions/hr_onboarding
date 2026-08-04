"use client";
import "./OffersPage.css";
import { FileText, Send, Pencil, Check, X, RefreshCw, AlertCircle, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useInterviewStore, API_BASE_URL, apiHeaders } from "@/lib/interviewStore";

type Offer = {
  candidate_id?: string;
  email?:       string;
  initials:     string;
  color:        string;
  name:         string;
  role:         string;
  band:         string;
  joiningDate:  string;   // ISO "YYYY-MM-DD" when set, "" / "TBD" when not
  status:       string;
  sentDate:     string;
};

const MANAGER_API = process.env.NEXT_PUBLIC_MANAGER_API_BASE_URL || "http://localhost:8001";

const statusStyle: Record<string, { bg: string; text: string }> = {
  Sent:     { bg: "rgba(128,178,255,0.2)",  text: "#1a6080" },
  Draft:    { bg: "rgba(253,255,200,0.6)",  text: "#806020" },
  Accepted: { bg: "rgba(200,247,220,0.6)",  text: "#2a7a50" },
  Declined: { bg: "rgba(255,200,216,0.5)",  text: "#c0506a" },
};

/* Formats an ISO "YYYY-MM-DD" date as "22-Jul-2026" for display; falls back
   to whatever raw value was stored if it isn't a clean ISO date (e.g. "TBD"
   or a free-typed value that didn't parse). */
function formatJoiningDate(value: string): string {
  if (!value) return "TBD";
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (!isoMatch) return value;
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function OffersPage() {
  const { refreshKey, refreshAll } = useInterviewStore();

  const [offers,       setOffers]       = useState<Offer[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [fetchError,   setFetchError]   = useState(false);

  const [editingBand,        setEditingBand]        = useState<number | null>(null);
  const [bandDraft,          setBandDraft]          = useState("");
  const [editingJoiningDate, setEditingJoiningDate] = useState<number | null>(null);
  const [joiningDateDraft,   setJoiningDateDraft]   = useState("");

  async function fetchOffers() {
    setLoading(true);
    setFetchError(false);
    /* Clear stale offers immediately for visual feedback */
    setOffers([]);
    try {
      const res = await fetch(`${MANAGER_API}/manager/offers`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const live: Offer[] = (data.offers || []).map((o: any) => ({
        candidate_id: o.candidate_id,
        email:       o.candidate_email || o.email || "",
        initials:    o.initials || (o.candidate_name?.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase() || "?"),
        color:       o.color           || "#6366f1",
        name:        o.candidate_name  || "",
        role:        o.role            || "",
        band:        o.band            || "TBD",
        joiningDate: o.joining_date    || o.date_of_joining || o.doj || "",
        status:      o.status          || "Draft",
        sentDate:    o.sent_date       || "—",
      }));
      setOffers(live);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }

  /* Auto-fetch on mount */
  useEffect(() => { fetchOffers(); }, []);

  /* Re-fetch offers whenever global refresh fires (refreshAll re-pulls interview data) */
  useEffect(() => {
    if (refreshKey === 0) return;   /* skip initial mount, fetchOffers() already runs there */
    fetchOffers();
    setEditingBand(null);
    setEditingJoiningDate(null);
    setSendError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const [sending,  setSending]  = useState<string | null>(null);  /* candidate_id being sent */
  const [sendError, setSendError] = useState<string | null>(null);

  /* Build the offer letter email body sent to the candidate */
  function buildOfferEmail(o: Offer) {
    return {
      subject: `Offer Letter — ${o.role}`,
      body: `
        <h2>Dear ${o.name},</h2>
        <p>Congratulations! We are pleased to offer you the position of <b>${o.role}</b>.</p>
        <table border="1" cellpadding="8">
          <tr><td><b>Role</b></td><td>${o.role}</td></tr>
          <tr><td><b>Compensation Band</b></td><td>${o.band}</td></tr>
          <tr><td><b>Date of Joining</b></td><td>${formatJoiningDate(o.joiningDate)}</td></tr>
        </table>
        <p>Please reach out to HR with any questions. We look forward to having you on the team!</p>
        <br><p>Best regards,<br><b>HR Team</b></p>
      `,
    };
  }

  async function handleSend(o: Offer) {
    if (!o.candidate_id) { setSendError("No candidate ID — cannot send."); return; }
    setSending(o.candidate_id);
    setSendError(null);

    try {
      /* 1 ── Tell the manager backend this offer was sent (manager-side tracking) */
      const res = await fetch(
        `${MANAGER_API}/manager/send-offer?candidate_id=${encodeURIComponent(o.candidate_id)}`,
        { method: "POST" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || `Error ${res.status}`);

      /* 2 ── Actually send the offer-letter email + persist on the HR backend
              so HR's dashboard (offer_letter_sent / offer_letter_sent_at) reflects it */
      if (o.email) {
        const { subject, body } = buildOfferEmail(o);
        try {
          const hrRes = await fetch(
            `${API_BASE_URL}/interviews/${encodeURIComponent(o.candidate_id)}/offer-letter/send`,
            {
              method: "POST",
              headers: apiHeaders(),
              body: JSON.stringify({
                candidateEmail: o.email,
                subject,
                body,
              }),
            }
          );
          if (!hrRes.ok) {
            const hrData = await hrRes.json().catch(() => ({}));
            console.warn("HR offer-letter email failed:", hrData?.detail || hrRes.status);
            setSendError(
              "Offer marked as sent, but the HR-side email/record update failed. " +
              "It may not show as sent on the HR dashboard yet."
            );
          }
        } catch (hrErr) {
          console.warn("HR backend unreachable for offer-letter send:", hrErr);
          setSendError(
            "Offer marked as sent, but couldn't reach the HR backend to record it there."
          );
        }
      } else {
        console.warn("No candidate email available — skipped HR offer-letter send.");
      }

      /* Update status locally so UI reflects Sent immediately */
      const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      setOffers(prev => prev.map(x =>
        x.candidate_id === o.candidate_id ? { ...x, status: "Sent", sentDate: today } : x
      ));
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send offer.");
    } finally {
      setSending(null);
    }
  }

  function commitBandEdit(i: number) {
    const v = bandDraft.trim();
    if (v) {
      const updated = offers.map((o, idx) => idx === i ? { ...o, band: v } : o);
      setOffers(updated);
      const id = updated[i].candidate_id;
      if (id) fetch(`${MANAGER_API}/manager/offers/${encodeURIComponent(id)}?band=${encodeURIComponent(v)}`, { method: "PATCH" }).catch(() => {});
    }
    setEditingBand(null);
  }

  /* ── Joining date edit ── */
  function commitJoiningDateEdit(i: number) {
    const v = joiningDateDraft.trim();
    if (!v) { setEditingJoiningDate(null); return; }

    const id = offers[i].candidate_id;
    if (!id) { setEditingJoiningDate(null); return; }

    fetch(`${MANAGER_API}/manager/offers/${encodeURIComponent(id)}?joining_date=${encodeURIComponent(v)}`, { method: "PATCH" })
      .then(res => {
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
        setOffers(prev => prev.map((o, idx) => idx === i ? { ...o, joiningDate: v } : o));
      })
      .catch(() => setSendError("Couldn't save the joining date. Please try again."));

    setEditingJoiningDate(null);
  }

  /* ── Shared inline text edit input (used for Compensation Band) ── */
  const editInput = (
    value: string,
    onChange: (v: string) => void,
    onCommit: () => void,
    onCancel: () => void,
  ) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        value={value} autoFocus
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onCommit(); if (e.key === "Escape") onCancel(); }}
        style={{ width: 130, padding: "4px 8px", border: "1.5px solid #9E74D0", borderRadius: 6, fontSize: 13, fontWeight: 600, outline: "none", boxShadow: "0 0 0 3px rgba(158,116,208,0.2)", fontFamily: "inherit" }}
      />
      <button onClick={onCommit} style={{ width: 26, height: 26, border: "none", borderRadius: 6, background: "rgba(16,185,129,0.15)", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={13} /></button>
      <button onClick={onCancel} style={{ width: 26, height: 26, border: "none", borderRadius: 6, background: "rgba(239,68,68,0.12)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
    </div>
  );

  /* ── Date-specific inline edit input: native <input type="date"> gives a
     calendar picker on click AND lets the user type the day/month/year
     segments directly, so both entry methods work out of the box. ── */
  const dateEditInput = (
    value: string,
    onChange: (v: string) => void,
    onCommit: () => void,
    onCancel: () => void,
  ) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        type="date"
        value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""}
        autoFocus
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onCommit(); if (e.key === "Escape") onCancel(); }}
        style={{ width: 150, padding: "4px 8px", border: "1.5px solid #9E74D0", borderRadius: 6, fontSize: 13, fontWeight: 600, outline: "none", boxShadow: "0 0 0 3px rgba(158,116,208,0.2)", fontFamily: "inherit" }}
      />
      <button onClick={onCommit} style={{ width: 26, height: 26, border: "none", borderRadius: 6, background: "rgba(16,185,129,0.15)", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={13} /></button>
      <button onClick={onCancel} style={{ width: 26, height: 26, border: "none", borderRadius: 6, background: "rgba(239,68,68,0.12)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
    </div>
  );

  const editableCell = (value: string, onEdit: () => void) => (
    <div onClick={onEdit} title="Click to edit" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "4px 10px", borderRadius: 6, border: "1.5px dashed #9E74D0", background: "rgba(158,116,208,0.07)" }}>
      <span style={{ fontWeight: 600, color: "var(--text)" }}>{value}</span>
      <Pencil size={12} style={{ color: "#9E74D0", flexShrink: 0 }} />
    </div>
  );

  const editableDateCell = (value: string, onEdit: () => void) => (
    <div onClick={onEdit} title="Click to edit" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "4px 10px", borderRadius: 6, border: "1.5px dashed #9E74D0", background: "rgba(158,116,208,0.07)" }}>
      <CalendarDays size={12} style={{ color: "#9E74D0", flexShrink: 0 }} />
      <span style={{ fontWeight: 600, color: "var(--text)" }}>{formatJoiningDate(value)}</span>
      <Pencil size={12} style={{ color: "#9E74D0", flexShrink: 0 }} />
    </div>
  );

  return (
    <div className="offers">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Offers</h1>
          <p className="page-sub">
            {loading ? "Loading…" : `${offers.length} offer${offers.length !== 1 ? "s" : ""} · populated when manager approves`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { refreshAll(); }}
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.22)", borderRadius: 9, fontSize: 12, fontWeight: 600, color: "#4f46e5", cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}
          >
            <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* ── Send error banner ── */}
      {sendError && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(220,53,69,0.07)", border:"1px solid rgba(220,53,69,0.2)", borderRadius:10, fontSize:13, color:"#b02030", marginBottom:8 }}>
          <AlertCircle size={15} style={{ flexShrink:0 }} />
          {sendError}
          <button onClick={() => setSendError(null)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#b02030" }}><X size={14}/></button>
        </div>
      )}
      {fetchError && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, fontSize: 13, color: "#92400e", marginBottom: 8 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          Could not reach Manager Backend (localhost:8001). Start it to see offers.
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !fetchError && offers.length === 0 && (
        <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", fontSize: 13, background: "#fff", border: "1px solid rgba(221,208,232,0.4)", borderRadius: 14 }}>
          No offers yet. When the manager approves a candidate in the Interviews page, their offer will appear here.
        </div>
      )}

      {/* ── Offers table ── */}
      {offers.length > 0 && (
        <div className="card">
          <div className="table-scroll">
            <table className="offers-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Compensation Band</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o, i) => (
                  <tr key={`${o.name}-${i}`}>
                    <td>
                      <div className="cand-cell">
                        <div className="avatar" style={{ background: o.color }}>{o.initials}</div>
                        <div>
                          <span className="cand-name">{o.name}</span>
                          {o.candidate_id && (
                            <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, marginTop: 2 }}>✓ Manager Approved</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="role-cell">{o.role}</td>

                    {/* Editable band */}
                    <td>
                      {editingBand === i
                        ? editInput(bandDraft, setBandDraft, () => commitBandEdit(i), () => setEditingBand(null))
                        : editableCell(o.band, () => { setEditingBand(i); setBandDraft(o.band); })}
                    </td>

                    {/* Editable joining date — calendar picker + manual typing via <input type="date"> */}
                    <td>
                      {editingJoiningDate === i
                        ? dateEditInput(joiningDateDraft, setJoiningDateDraft, () => commitJoiningDateEdit(i), () => setEditingJoiningDate(null))
                        : editableDateCell(o.joiningDate, () => { setEditingJoiningDate(i); setJoiningDateDraft(o.joiningDate); })}
                    </td>

                    <td>
                      <span className="status-badge" style={{ background: statusStyle[o.status]?.bg || "rgba(221,208,232,0.3)", color: statusStyle[o.status]?.text || "#9090b0" }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="date-cell">{o.sentDate}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-outline-sm"><FileText size={12} /> View</button>
                        {o.status === "Draft" && (
                          <button
                            className="btn-primary-sm"
                            disabled={sending === o.candidate_id}
                            onClick={() => handleSend(o)}
                            style={{ opacity: sending === o.candidate_id ? 0.7 : 1 }}
                          >
                            {sending === o.candidate_id
                              ? <><RefreshCw size={11} style={{ animation:"spin 1s linear infinite" }}/> Sending…</>
                              : <><Send size={12} /> Send</>
                            }
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}