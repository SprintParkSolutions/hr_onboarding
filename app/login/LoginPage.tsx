"use client";
import "./LoginPage.css";
import { useState } from "react";
import { Bot, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, User, CheckCircle } from "lucide-react";
import Link from "next/link";

const DEMO_CREDENTIALS = [
  { email: "priya.r@sprintpark.ai", password: "sprintpark123", name: "Priya R.",  role: "Talent Acquisition", initials: "PR", color: "#9B7485" },
  { email: "arjun.k@sprintpark.ai", password: "sprintpark123", name: "Arjun K.", role: "Engineering Lead",    initials: "AK", color: "#E8806A" },
  { email: "admin@sprintpark.ai",   password: "admin123",      name: "Admin",    role: "Super Admin",         initials: "AD", color: "#8DB89A" },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const [tab, setTab]           = useState<"signin" | "signup">("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [signedUp, setSignedUp] = useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const match = DEMO_CREDENTIALS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      if (match) { window.location.href = "/"; }
      else { setError("Invalid email or password. Try a demo account."); setLoading(false); }
    }, 900);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPw) { setError("Passwords don't match."); return; }
    setLoading(true);
    setTimeout(() => { setSignedUp(true); setLoading(false); }, 1000);
  }

  function fillDemo(cred: typeof DEMO_CREDENTIALS[0]) {
    setEmail(cred.email); setPassword(cred.password); setError(""); setTab("signin");
  }

  return (
    <div className="lp-auth-root">
      {/* Background blobs */}
      <div className="lp-auth-blob lp-auth-blob-1" />
      <div className="lp-auth-blob lp-auth-blob-2" />
      <div className="lp-auth-blob lp-auth-blob-3" />

      {/* Top nav */}
      <header className="lp-auth-nav">
        <Link href="/landing" className="lp-auth-logo">
          <div className="lp-auth-logo-icon"><Bot size={17} color="white" /></div>
          <span className="lp-auth-logo-text">SprintPark AI HR</span>
        </Link>
        <Link href="/landing" className="lp-auth-nav-link">← Back to home</Link>
      </header>

      {/* Card */}
      <main className="lp-auth-main">
        <div className="lp-auth-card">

          {/* Tabs */}
          <div className="lp-auth-tabs">
            <button className={`lp-auth-tab ${tab === "signin" ? "active" : ""}`} onClick={() => { setTab("signin"); setError(""); }}>
              Sign in
            </button>
            <button className={`lp-auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>
              Create account
            </button>
          </div>

          {/* Sign in with Google */}
          <button className="lp-google-btn" onClick={() => alert("Google OAuth would be configured here")}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="lp-auth-divider"><span>or</span></div>

          {/* ── Sign In ── */}
          {tab === "signin" && (
            <>
              <div className="lp-auth-heading">
                <h1 className="lp-auth-title">Welcome back</h1>
                <p className="lp-auth-sub">Sign in to your recruiting workspace</p>
              </div>

              <form onSubmit={handleSignIn} noValidate className="lp-auth-form">
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="email">Work email</label>
                  <div className="lp-auth-input-wrap">
                    <Mail size={15} className="lp-auth-input-icon" />
                    <input id="email" type="email" className="lp-auth-input" placeholder="you@company.com"
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

              {/* Demo accounts */}
              <div className="lp-demo-section">
                <div className="lp-demo-divider"><span>Try a demo account</span></div>
                <div className="lp-demo-cards">
                  {DEMO_CREDENTIALS.map(c => (
                    <button key={c.email} type="button" className="lp-demo-card" onClick={() => fillDemo(c)}>
                      <div className="lp-demo-avatar" style={{ background: c.color }}>{c.initials}</div>
                      <div className="lp-demo-info">
                        <span className="lp-demo-name">{c.name}</span>
                        <span className="lp-demo-role">{c.role}</span>
                      </div>
                      <ArrowRight size={13} style={{ color: "#A8919A", flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Sign Up ── */}
          {tab === "signup" && !signedUp && (
            <>
              <div className="lp-auth-heading">
                <h1 className="lp-auth-title">Create your account</h1>
                <p className="lp-auth-sub">Start your free 14-day trial — no credit card needed</p>
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

                <p className="lp-auth-terms">
                  By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </p>
              </form>
            </>
          )}

          {/* Sign up success */}
          {tab === "signup" && signedUp && (
            <div className="lp-auth-success">
              <CheckCircle size={40} color="#8DB89A" />
              <h2 className="lp-auth-success-title">Account created!</h2>
              <p className="lp-auth-success-text">Welcome to SprintPark AI HR. Check your email at <strong>{email}</strong> to verify your account.</p>
              <button className="lp-auth-btn" onClick={() => { setSignedUp(false); setTab("signin"); }}>
                Sign in now <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div className="lp-auth-trust">
          {["Free 14-day trial", "No credit card needed", "Setup in 5 minutes"].map(t => (
            <span key={t} className="lp-auth-trust-item">
              <CheckCircle size={13} color="#8DB89A" /> {t}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
