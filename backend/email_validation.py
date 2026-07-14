import re

print("hi")
_LOCAL_RE = re.compile(r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+)*$")
_QUOTED_LOCAL_RE = re.compile(r'^(?:"(?:\\.|[^"\\])+")$')
_DOMAIN_RE = re.compile(r"^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$")


def is_valid_email(value: str) -> bool:
    """Return True when the string looks like a valid email address.

    This accepts standard addresses as well as internal/company domains
    that do not contain a public TLD, which are commonly used in HR systems.
    """
    email = (value or "").strip()

    if not email or email.count("@") != 1:
        return False

    local_part, domain = email.split("@", 1)
    if not local_part or not domain:
        return False

    if local_part.startswith('"') and local_part.endswith('"'):
        if not _QUOTED_LOCAL_RE.fullmatch(local_part):
            return False
    else:
        if not _LOCAL_RE.fullmatch(local_part):
            return False
        if local_part.startswith(".") or local_part.endswith("."):
            return False

    if not _DOMAIN_RE.fullmatch(domain):
        return False

    if domain.startswith(".") or domain.endswith("."):
        return False

    return True
