"use client";
import "./LoginPage.css";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, User, CheckCircle, Users, Briefcase } from "lucide-react";
import Link from "next/link";

type Role = "hr" | "manager";

const HR_CREDS = [
  { email: "priya.r@recruitai.app",  password: "recruitai123", name: "Priya R.",  title: "HR Manager",       initials: "PR", color: "#B875A0" },
  { email: "sneha.m@recruitai.app",  password: "recruitai123", name: "Sneha M.", title: "Talent Acquisition", initials: "SM", color: "#0EA5E9" },
];

const MANAGER_CREDS = [
  { email: "arjun.k@recruitai.app",  password: "recruitai123", name: "Arjun K.", title: "Engineering Lead",   initials: "AK", color: "#6366F1" },
  { email: "rahul.d@recruitai.app",  password: "recruitai123", name: "Rahul D.", title: "Analytics Manager",  initials: "RD", color: "#10b981" },
];

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

  const demoCreds = role === "hr" ? HR_CREDS : MANAGER_CREDS;
  const allCreds  = [...HR_CREDS, ...MANAGER_CREDS];
  const roleLabel = role === "hr" ? "HR / Recruiter" : "Hiring Manager";

  function switchRole(r: Role) {
    setRole(r); setEmail(""); setPassword(""); setError("");
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const hrMatch  = HR_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      const mgrMatch = MANAGER_CREDS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
      if (hrMatch)       { window.location.href = "/hr_portal/dashboard"; }
      else if (mgrMatch) { window.location.href = "/Manager_Portal/dashboard"; }
      else { setError("Invalid email or password. Try a demo account below."); setLoading(false); }
    }, 900);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim())           { setError("Please enter your name."); return; }
    if (!email.trim())          { setError("Please enter your email."); return; }
    if (password.length < 8)    { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPw) { setError("Passwords don't match."); return; }
    setLoading(true);
    setTimeout(() => { setSignedUp(true); setLoading(false); }, 1000);
  }

  function fillDemo(cred: typeof allCreds[0]) {
    setEmail(cred.email); setPassword(cred.password); setError(""); setTab("signin");
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

          {/* Role switcher */}
          <div className="lp-role-switcher">
            <button type="button" className={`lp-role-btn${role === "hr" ? " active" : ""}`} onClick={() => switchRole("hr")}>
              <Users size={15} /> HR / Recruiter
            </button>
            <button type="button" className={`lp-role-btn${role === "manager" ? " active" : ""}`} onClick={() => switchRole("manager")}>
              <Briefcase size={15} /> Hiring Manager
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
                  <label className="lp-auth-label" htmlFor="email">Work email</label>
                  <div className="lp-auth-input-wrap">
                    <Mail size={15} className="lp-auth-input-icon" />
                    <input id="email" type="email" className="lp-auth-input" placeholder="you@recruitai.app"
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
