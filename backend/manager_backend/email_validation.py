import re

# Known public email provider domains
PUBLIC_DOMAINS = {
    "gmail.com", "googlemail.com",
    "outlook.com", "outlook.in",
    "hotmail.com", "hotmail.in", "hotmail.co.uk",
    "live.com", "live.in", "msn.com",
    "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk", "ymail.com",
    "icloud.com", "me.com", "mac.com",
    "protonmail.com", "proton.me",
    "zoho.com",
    "rediffmail.com",
    "aol.com",
}

_LOCAL_RE  = re.compile(r"^[A-Za-z0-9._%+\-]+$")
_DOMAIN_RE = re.compile(r"^[A-Za-z0-9.\-]+$")


def is_valid_email(value: str) -> bool:
    """
    Return True for any well-formed email address.
    Accepts corporate/company domains — used for HR/interviewer emails.
    """
    email = (value or "").strip().lower()
    if not email or email.count("@") != 1:
        return False

    local, domain = email.split("@", 1)
    if not local or not domain:
        return False
    if local.startswith(".") or local.endswith("."):
        return False
    if not _LOCAL_RE.fullmatch(local):
        return False
    if not _DOMAIN_RE.fullmatch(domain):
        return False
    if domain.startswith(".") or domain.endswith("."):
        return False
    if "." not in domain:
        return False

    return True


def is_valid_public_email(value: str) -> bool:
    """
    Stricter check — must be from a known public provider.
    Use for candidate/personal email fields (Gmail, Outlook, Yahoo, etc.)
    """
    if not is_valid_email(value):
        return False
    domain = value.strip().lower().split("@")[1]
    return domain in PUBLIC_DOMAINS


def email_error(value: str, public_only: bool = False) -> str | None:
    """
    Returns a human-readable error string, or None if valid.
    Set public_only=True for candidate personal email fields.
    """
    if not value or not value.strip():
        return "Email is required."
    if not is_valid_email(value):
        return "Enter a valid email address (e.g. name@gmail.com)."
    if public_only and not is_valid_public_email(value):
        return "Use a valid email from Gmail, Outlook, Yahoo, iCloud or similar."
    return None
