/**
 * Shared email validation utilities used across the entire frontend.
 *
 * Two levels of validation:
 *  - isValidEmail(v)         → accepts any well-formed email (work emails, company domains)
 *  - isValidPublicEmail(v)   → only accepts known public providers (Gmail, Outlook, Yahoo…)
 *                              used for candidate/personal email fields
 */

/* Known public email providers */
const PUBLIC_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "outlook.in",
  "hotmail.com",
  "hotmail.in",
  "hotmail.co.uk",
  "live.com",
  "live.in",
  "msn.com",
  "yahoo.com",
  "yahoo.in",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "rediffmail.com",
  "aol.com",
]);

/* Basic format check — local part + @ + domain with at least one dot */
export function isValidEmail(value: string): boolean {
  const email = (value || "").trim().toLowerCase();
  if (!email || email.split("@").length !== 2) return false;
  const [local, domain] = email.split("@");
  if (!local || !domain) return false;
  // local: allow letters, digits, dots, underscores, hyphens, plus
  const localOk = /^[a-z0-9._%+\-]+$/.test(local) && !local.startsWith(".") && !local.endsWith(".");
  // domain: must have at least one dot, valid chars
  const domainOk = /^[a-z0-9.\-]+$/.test(domain) && domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".");
  return localOk && domainOk;
}

/**
 * Stricter check — must be a known public provider.
 * Use this for candidate personal email fields.
 */
export function isValidPublicEmail(value: string): boolean {
  if (!isValidEmail(value)) return false;
  const domain = value.trim().toLowerCase().split("@")[1];
  return PUBLIC_DOMAINS.has(domain);
}

/**
 * Returns a human-readable error message for an email field.
 * @param value        the email string
 * @param publicOnly   true = only public providers allowed (candidate fields)
 */
export function emailError(value: string, publicOnly = false): string | null {
  const email = (value || "").trim();
  if (!email) return "Email is required.";
  if (!isValidEmail(email)) return "Enter a valid email address (e.g. name@gmail.com).";
  if (publicOnly && !isValidPublicEmail(email)) {
    return "Use a valid email from Gmail, Outlook, Yahoo, iCloud, or similar providers.";
  }
  return null;
}
