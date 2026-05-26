"use client";
import "./LoginPage.css";
import { useState } from "react";
import { Bot, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

const DEMO_CREDENTIALS = [
  { email: "priya.r@sprintpark.ai",  password: "sprintpark123", name: "Priya R.",  role: "Talent Acquisition" },
  { email: "arjun.k@sprintpark.ai",  password: "sprintpark123", name: "Arjun K.",  role: "Engineering Lead"   },
  { email: "admin@sprintpark.ai",    password: "admin123",       name: "Admin",     role: "Super Admin"        },
];

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const match = DEMO_CREDENTIALS.find(
        (c) => c.email === email.trim().toLowerCase() && c.password === password
      );
      if (match) {
        window.location.href = "/";
      } else {
        setError("Invalid email or password. Try a demo account below.");
        setLoading(false);
      }
    }, 900);
  }

  function fillDemo(cred: typeof DEMO_CREDENTIALS[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  }

  return (
    <div className="login-root">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-left-inner">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <Bot size={28} color="white" />
            </div>
            <div>
              <div className="login-logo-name">SprintPark AI HR</div>
              <div className="login-logo-sub">Acme Inc · Recruiting workspace</div>
            </div>
          </div>

          {/* Headline */}
          <div className="login-headline">
            <h1 className="login-h1">Hire smarter,<br />move faster.</h1>
            <p className="login-tagline">
              Your AI-powered recruitment platform — from job posting to offer letter, all in one place.
            </p>
          </div>

          {/* Feature pills */}
          <div className="login-features">
            {[
              "AI Interview Copilot",
              "Automated BGV Tracking",
              "Smart Offer Generation",
              "Real-time Analytics",
              "Candidate Pipeline",
            ].map((f) => (
              <span key={f} className="login-feature-pill">{f}</span>
            ))}
          </div>

          {/* Decorative stat cards */}
          <div className="login-stat-row">
            <div className="login-stat-card">
              <div className="login-stat-val">142</div>
              <div className="login-stat-label">Offers this quarter</div>
            </div>
            <div className="login-stat-card">
              <div className="login-stat-val">89%</div>
              <div className="login-stat-label">Acceptance rate</div>
            </div>
            <div className="login-stat-card">
              <div className="login-stat-val">4.8</div>
              <div className="login-stat-label">Avg interview score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-form-wrap">
          {/* Mobile logo */}
          <div className="login-mobile-logo">
            <div className="login-logo-icon login-logo-icon-sm">
              <Bot size={20} color="white" />
            </div>
            <span className="login-logo-name">SprintPark AI HR</span>
          </div>

          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to your recruiting workspace</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="email">Work email</label>
              <div className="login-input-wrap">
                <Mail size={15} className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="you@sprintpark.ai"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label" htmlFor="password">Password</label>
                <button type="button" className="login-forgot">Forgot password?</button>
              </div>
              <div className="login-input-wrap">
                <Lock size={15} className="login-input-icon" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="login-input login-input-pw"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`login-btn ${loading ? "login-btn-loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" aria-hidden="true" />
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="login-demo-section">
            <div className="login-demo-label">
              <span className="login-demo-line" />
              <span>Demo accounts</span>
              <span className="login-demo-line" />
            </div>
            <div className="login-demo-cards">
              {DEMO_CREDENTIALS.map((c) => (
                <button
                  key={c.email}
                  type="button"
                  className="login-demo-card"
                  onClick={() => fillDemo(c)}
                >
                  <div className="login-demo-avatar">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="login-demo-info">
                    <span className="login-demo-name">{c.name}</span>
                    <span className="login-demo-role">{c.role}</span>
                  </div>
                  <ArrowRight size={13} className="login-demo-arrow" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
