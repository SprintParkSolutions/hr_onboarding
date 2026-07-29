"use client";
import "./LoginPage.css";
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> 12df67162920a7f683b8e7e0f6af756a03efb630
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, User, CheckCircle, Users, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { isValidEmail, isValidPublicEmail } from "@/lib/emailValidation";

<<<<<<< HEAD
// ── Backend base URL — same env var used by the candidate dashboard ──────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

=======
>>>>>>> 12df67162920a7f683b8e7e0f6af756a03efb630
type Role = "hr" | "manager" | "candidate";

const HR_CREDS = [
  { email: "yernig@sprintpark.com", password: "yerni1234", name: "Yerni G.", title: "HR Manager", initials: "YG", color: "#B875A0" },
];

const MANAGER_CREDS = [
  { email: "akhilag@sprintpark.com", password: "akhila123", name: "Akhila G.", title: "Engineering Lead", initials: "AG", color: "#6366F1" },
<<<<<<< HEAD
=======
];

const CANDIDATE_CREDS = [
  { email: "laxman.k@candidate.app",  password: "candidate123", name: "Laxman Kosana",   title: "Salesforce Developer",  initials: "LK", color: "#8b5cf6" },
  { email: "naresh.p@candidate.app",  password: "candidate123", name: "Naresh Punagani", title: "Full Stack Developer",   initials: "NP", color: "#f59e0b" },
  { email: "edurupaka.b@candidate.app", password: "candidate123", name: "Edurupaka Bhavana", title: "AI Engineer",        initials: "EB", color: "#10b981" },
>>>>>>> 12df67162920a7f683b8e7e0f6af756a03efb630
];

const CANDIDATE_DEMO_PASSWORD = "candidate123"; // must match CANDIDATE_PORTAL_PASSWORD on the backend

type PortalCandidate = {
  candidate_id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
};

function RecruitAILogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" fill="white" opacity="0.95"/>
      <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.95"/>
      <circle cx="19" cy="9" r="2" fill="white" opacity="0.85"/>
      <line x1="17.2" y1="8"  x2="15"   y2="7"  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
      <line x1="17.2" y1="10" x2="15"   y2="13" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
      <line x1="21"   y1="9"  x2="22.5" y2="7"  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export default function LoginPage() {
  const [role,        setRole]        = useState<Role>("hr");
  const [tab,         setTab]         = useState<"signin" | "signup">("signin");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [name,        setName]        = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [signedUp,    setSignedUp]    = useState(false);

<<<<<<< HEAD
  // ── Candidates who've actually received an offer letter, fetched live
  // from MongoDB — powers the candidate "demo account" list below.
  const [portalCandidates,        setPortalCandidates]        = useState<PortalCandidate[]>([]);
  const [loadingPortalCandidates, setLoadingPortalCandidates] = useState(false);

  useEffect(() => {
    if (role !== "candidate") return;
    let cancelled = false;
    setLoadingPortalCandidates(true);
    fetch(`${API_BASE}/candidates/portal-eligible`)
      .then(res => res.json())
      .then((data: { candidates: PortalCandidate[] }) => {
        if (!cancelled) setPortalCandidates(data.candidates || []);
      })
      .catch(() => { if (!cancelled) setPortalCandidates([]); })
      .finally(() => { if (!cancelled) setLoadingPortalCandidates(false); });
    return () => { cancelled = true; };
  }, [role]);

  const demoCreds = role === "hr" ? HR_CREDS : role === "manager" ? MANAGER_CREDS : [];
  const allCreds  = [...HR_CREDS, ...MANAGER_CREDS];
=======
  const demoCreds = role === "hr" ? HR_CREDS : role === "manager" ? MANAGER_CREDS : CANDIDATE_CREDS;
  const allCreds  = [...HR_CREDS, ...MANAGER_CREDS, ...CANDIDATE_CREDS];
>>>>>>> 12df67162920a7f683b8e7e0f6af756a03efb630
  const roleLabel = role === "hr" ? "HR / Recruiter" : role === "manager" ? "Hiring Manager" : "Candidate";

  function switchRole(r: Role) {
    setRole(r); setEmail(""); setPassword(""); setError("");
  }

  // ── Candidate sign-in: real backend check, gated on offer_letter_sent.
  // On success, stores the real MongoDB candidateId + candidateEmail —
  // every candidate-dashboard API call (uploads, submit, etc.) needs candidateId.
  async function candidateLogin(candidateEmail: string, candidatePassword: string) {
    const res = await fetch(`${API_BASE}/candidates/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: candidateEmail, password: candidatePassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Invalid email or password.");
    }
    localStorage.setItem("candidateEmail", data.email);
    localStorage.setItem("candidateId", data.candidate_id);
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true);
<<<<<<< HEAD
    setTimeout(async () => {
      const hrMatch  = HR_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      const mgrMatch = MANAGER_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);

      if (hrMatch) {
        window.location.href = "/hr_portal/dashboard";
      } else if (mgrMatch) {
        window.location.href = "/Manager_Portal/dashboard";
      } else if (role === "candidate") {
        try {
          await candidateLogin(email.trim().toLowerCase(), password);
          window.location.href = "/candidate_portal/dashboard";
        } catch (err: any) {
          setError(err.message || "Something went wrong signing you in. Please try again.");
          setLoading(false);
        }
      } else {
        setError("Invalid email or password. Try a demo account below.");
        setLoading(false);
      }
=======
    setTimeout(() => {
      const hrMatch        = HR_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      const mgrMatch       = MANAGER_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      const candidateMatch = CANDIDATE_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      if (hrMatch)             { window.location.href = "/hr_portal/dashboard"; }
      else if (mgrMatch)       { window.location.href = "/Manager_Portal/dashboard"; }
      else if (candidateMatch) { window.location.href = "/candidate_portal/dashboard"; }
      else { setError("Invalid email or password. Try a demo account below."); setLoading(false); }
>>>>>>> 12df67162920a7f683b8e7e0f6af756a03efb630
    }, 900);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim())           { setError("Please enter your name."); return; }
    if (!email.trim())          { setError("Please enter your email."); return; }
    /* Candidates must use a public provider; HR/Manager can use work email */
    if (role === "candidate") {
      if (!isValidPublicEmail(email.trim())) {
        setError("Please use a valid email from Gmail, Outlook, Yahoo, iCloud or similar."); return;
      }
    } else {
      if (!isValidEmail(email.trim())) {
        setError("Please enter a valid work email address."); return;
      }
    }
    if (password.length < 8)    { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPw) { setError("Passwords don't match."); return; }
    setLoading(true);
    setTimeout(() => { setSignedUp(true); setLoading(false); }, 1000);
  }

  function fillDemo(cred: typeof allCreds[0]) {
    setEmail(cred.email); setPassword(cred.password); setError(""); setTab("signin");
  }

  function fillDemoCandidate(cand: PortalCandidate) {
    setEmail(cand.email); setPassword(CANDIDATE_DEMO_PASSWORD); setError(""); setTab("signin");
  }

  return (
    <div className="lp-auth-root">
      <div className="lp-auth-blob lp-auth-blob-1" />
      <div className="lp-auth-blob lp-auth-blob-2" />
      <div className="lp-auth-blob lp-auth-blob-3" />

      <header className="lp-auth-nav">
        <Link href="/landing" className="lp-auth-logo">
          <div className="lp-auth-logo-icon" style={{ background: "linear-gradient(135deg, #B875A0, #7AB8D8)" }}><RecruitAILogo size={17} /></div>
          <span className="lp-auth-logo-text">Recruit<span style={{ color: "#0EA5E9" }}>AI</span></span>
        </Link>
        <Link href="/landing" className="lp-auth-nav-link">← Back to home</Link>
      </header>

      <main className="lp-auth-main">
        <div className="lp-auth-card">

          {/* Role switcher — 3 roles */}
          <div className="lp-role-switcher">
            <button type="button" className={`lp-role-btn${role === "hr" ? " active" : ""}`} onClick={() => switchRole("hr")}>
              <Users size={15} /> HR / Recruiter
            </button>
            <button type="button" className={`lp-role-btn${role === "manager" ? " active" : ""}`} onClick={() => switchRole("manager")}>
              <Briefcase size={15} /> Hiring Manager
            </button>
            <button type="button" className={`lp-role-btn${role === "candidate" ? " active" : ""}`} onClick={() => switchRole("candidate")}>
              <GraduationCap size={15} /> Candidate
            </button>
          </div>

          {/* Tabs */}
          <div className="lp-auth-tabs">
            <button className={`lp-auth-tab ${tab === "signin" ? "active" : ""}`} onClick={() => { setTab("signin"); setError(""); }}>Sign in</button>
            <button className={`lp-auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Create account</button>
          </div>

          {/* Sign In */}
          {tab === "signin" && (
            <>
              <div className="lp-auth-heading">
                <h1 className="lp-auth-title">Welcome back</h1>
                <p className="lp-auth-sub">Signing in as <strong>{roleLabel}</strong></p>
              </div>

              <form onSubmit={handleSignIn} noValidate className="lp-auth-form">
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="email">{role === "candidate" ? "Email" : "Work email"}</label>
                  <div className="lp-auth-input-wrap">
                    <Mail size={15} className="lp-auth-input-icon" />
                    <input id="email" type="email" className="lp-auth-input"
                      placeholder={role === "candidate" ? "you@candidate.app" : "you@recruitai.app"}
                      value={email} onChange={e => { setEmail(e.target.value); setError(""); }} autoComplete="email" autoFocus />
                  </div>
                </div>

                <div className="lp-auth-field">
                  <div className="lp-auth-label-row">
                    <label className="lp-auth-label" htmlFor="password">Password</label>
                    <button type="button" className="lp-auth-forgot">Forgot password?</button>
                  </div>
                  <div className="lp-auth-input-wrap">
                    <Lock size={15} className="lp-auth-input-icon" />
                    <input id="password" type={showPw ? "text" : "password"} className="lp-auth-input lp-auth-input-pw"
                      placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" />
                    <button type="button" className="lp-auth-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && <div className="lp-auth-error" role="alert"><AlertCircle size={14} /><span>{error}</span></div>}

                <button type="submit" className={`lp-auth-btn ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? <span className="lp-auth-spinner" /> : <>Sign in <ArrowRight size={15} /></>}
                </button>
              </form>

              {/* Demo accounts — HR/Manager static, Candidate fetched live from MongoDB */}
              {role !== "candidate" ? (
                <div className="lp-demo-section">
                  <div className="lp-demo-divider"><span>Try a demo account</span></div>
                  <div className="lp-demo-cards">
                    {demoCreds.map(c => (
                      <button key={c.email} type="button" className="lp-demo-card" onClick={() => fillDemo(c)}>
                        <div className="lp-demo-avatar" style={{ background: c.color }}>{c.initials}</div>
                        <div className="lp-demo-info">
                          <span className="lp-demo-name">{c.name}</span>
                          <span className="lp-demo-role">{c.title}</span>
                        </div>
                        <ArrowRight size={13} style={{ color: "#A8919A", flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="lp-demo-section">
                  <div className="lp-demo-divider"><span>Candidates with an active offer</span></div>
                  {loadingPortalCandidates ? (
                    <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "10px 0" }}>Loading…</p>
                  ) : portalCandidates.length === 0 ? (
                    <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "10px 0", lineHeight: 1.6 }}>
                      No candidates have an active offer letter yet.
                    </p>
                  ) : (
                    <div className="lp-demo-cards">
                      {portalCandidates.map(c => (
                        <button key={c.candidate_id} type="button" className="lp-demo-card" onClick={() => fillDemoCandidate(c)}>
                          <div className="lp-demo-avatar" style={{ background: c.color }}>{c.initials}</div>
                          <div className="lp-demo-info">
                            <span className="lp-demo-name">{c.name}</span>
                            <span className="lp-demo-role">{c.role || "Candidate"}</span>
                          </div>
                          <ArrowRight size={13} style={{ color: "#A8919A", flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Sign Up */}
          {tab === "signup" && !signedUp && (
            <>
              <div className="lp-auth-heading">
                <h1 className="lp-auth-title">Create your account</h1>
                <p className="lp-auth-sub">Joining as <strong>{roleLabel}</strong> · Free 14-day trial</p>
              </div>

              <form onSubmit={handleSignUp} noValidate className="lp-auth-form">
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="name">Full name</label>
                  <div className="lp-auth-input-wrap">
                    <User size={15} className="lp-auth-input-icon" />
                    <input id="name" type="text" className="lp-auth-input" placeholder="Priya Rajan"
                      value={name} onChange={e => { setName(e.target.value); setError(""); }} autoFocus />
                  </div>
                </div>
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="su-email">Work email</label>
                  <div className="lp-auth-input-wrap">
                    <Mail size={15} className="lp-auth-input-icon" />
                    <input id="su-email" type="email" className="lp-auth-input" placeholder="you@company.com"
                      value={email} onChange={e => { setEmail(e.target.value); setError(""); }} autoComplete="email" />
                  </div>
                </div>
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="su-pw">Password</label>
                  <div className="lp-auth-input-wrap">
                    <Lock size={15} className="lp-auth-input-icon" />
                    <input id="su-pw" type={showPw ? "text" : "password"} className="lp-auth-input lp-auth-input-pw"
                      placeholder="Min. 8 characters" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
                    <button type="button" className="lp-auth-pw-toggle" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="confirm-pw">Confirm password</label>
                  <div className="lp-auth-input-wrap">
                    <Lock size={15} className="lp-auth-input-icon" />
                    <input id="confirm-pw" type={showConfirm ? "text" : "password"} className="lp-auth-input lp-auth-input-pw"
                      placeholder="Repeat password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setError(""); }} />
                    <button type="button" className="lp-auth-pw-toggle" onClick={() => setShowConfirm(v => !v)}>
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                {error && <div className="lp-auth-error" role="alert"><AlertCircle size={14} /><span>{error}</span></div>}
                <button type="submit" className={`lp-auth-btn ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? <span className="lp-auth-spinner" /> : <>Create account <ArrowRight size={15} /></>}
                </button>
                <p className="lp-auth-terms">By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
              </form>
            </>
          )}

          {tab === "signup" && signedUp && (
            <div className="lp-auth-success">
              <CheckCircle size={40} color="#8DB89A" />
              <h2 className="lp-auth-success-title">Account created!</h2>
              <p className="lp-auth-success-text">Welcome to RecruitAI. Check your email at <strong>{email}</strong> to verify your account.</p>
              <button className="lp-auth-btn" onClick={() => { setSignedUp(false); setTab("signin"); }}>Sign in now <ArrowRight size={15} /></button>
            </div>
          )}
        </div>

        <div className="lp-auth-trust">
          {["Free 14-day trial", "No credit card needed", "Setup in 5 minutes"].map(t => (
            <span key={t} className="lp-auth-trust-item"><CheckCircle size={13} color="#8DB89A" /> {t}</span>
          ))}
        </div>
      </main>
    </div>
  );
}