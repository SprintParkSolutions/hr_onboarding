"use client";
import "./LandingPage.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bot, Sparkles, Users, BarChart2, FileText, ShieldCheck,
  Calendar, ArrowRight, CheckCircle, Star, ChevronRight,
  Zap, TrendingUp, Clock, Award, Menu, X,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────── */
const features = [
  {
    icon: Bot,
    color: "#c080d0",
    bg: "rgba(192,128,208,0.12)",
    title: "AI Interview Copilot",
    desc: "Real-time transcription, smart follow-up suggestions, and instant feedback scoring — so interviewers stay focused on the conversation, not note-taking.",
  },
  {
    icon: Users,
    color: "#e8a0c8",
    bg: "rgba(232,160,200,0.12)",
    title: "Candidate Pipeline",
    desc: "Unified view of every candidate across all stages. AI match scores, skill breakdowns, and one-click interview scheduling built right in.",
  },
  {
    icon: Sparkles,
    color: "#9a50b0",
    bg: "rgba(154,80,176,0.1)",
    title: "Resume Screener Agent",
    desc: "Automatically parses and scores resumes against job requirements. Shortlists top candidates in minutes, not days.",
  },
  {
    icon: Calendar,
    color: "#d8b0f0",
    bg: "rgba(216,176,240,0.12)",
    title: "Smart Scheduling",
    desc: "Detects interviewer conflicts, proposes alternative slots, and sends calendar invites — zero back-and-forth emails.",
  },
  {
    icon: FileText,
    color: "#c080d0",
    bg: "rgba(192,128,208,0.12)",
    title: "Offer Generation",
    desc: "AI-suggested compensation bands based on market data. Generate, review, and send offer letters in one click.",
  },
  {
    icon: ShieldCheck,
    color: "#e8a0c8",
    bg: "rgba(232,160,200,0.12)",
    title: "BGV Tracking",
    desc: "Automated background verification across identity, education, employment, and criminal checks — with real-time status updates.",
  },
  {
    icon: BarChart2,
    color: "#9a50b0",
    bg: "rgba(154,80,176,0.1)",
    title: "Real-time Analytics",
    desc: "Hiring funnel conversions, time-to-hire, offer acceptance rates, and AI accuracy — all in one dashboard.",
  },
  {
    icon: Zap,
    color: "#d8b0f0",
    bg: "rgba(216,176,240,0.12)",
    title: "HR Copilot Chat",
    desc: "Ask anything — policy queries, candidate comparisons, interview summaries — grounded on your own data corpus.",
  },
];

const stats = [
  { value: "18 days",  label: "Avg time to hire",       sub: "↓ 4 days vs industry avg" },
  { value: "91%",      label: "AI shortlist accuracy",   sub: "Matches validated by hiring managers" },
  { value: "89%",      label: "Offer acceptance rate",   sub: "↑ 8% since AI offer generation" },
  { value: "5× faster",label: "Resume screening speed",  sub: "vs manual review" },
];

const testimonials = [
  {
    name: "Priya Rajan",
    role: "Head of Talent Acquisition · Acme Inc",
    initials: "PR",
    color: "#c080d0",
    rating: 5,
    text: "SprintPark cut our time-to-hire from 32 days to 18. The AI copilot during interviews is a game-changer — our interviewers actually enjoy the process now.",
  },
  {
    name: "Arjun Krishnan",
    role: "Engineering Lead · Acme Inc",
    initials: "AK",
    color: "#9a50b0",
    rating: 5,
    text: "Resume screening used to eat half my week. Now I get a ranked shortlist with skill breakdowns in my inbox before my morning standup. I just review and approve.",
  },
  {
    name: "Sneha Mehta",
    role: "HR Business Partner · Acme Inc",
    initials: "SM",
    color: "#e8a0c8",
    rating: 5,
    text: "The BGV tracking alone saved us from two bad hires. Real-time status on every check, instant alerts on failures — we've never had this level of visibility before.",
  },
];

const steps = [
  { n: "01", title: "Post a job",          desc: "Describe the role in plain English. AI generates the full JD, sets requirements, and opens the pipeline." },
  { n: "02", title: "AI screens resumes",  desc: "The Resume Screener Agent parses, scores, and ranks every applicant. You review a clean shortlist." },
  { n: "03", title: "Interview & score",   desc: "Schedule interviews with one click. The Copilot assists in real time and generates structured feedback." },
  { n: "04", title: "Offer & onboard",     desc: "Generate AI-drafted offer letters, track BGV, and hand off to onboarding — all from one platform." },
];

const navLinks = ["Features", "How it works", "Results", "Testimonials"];

/* ── Component ────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="lp-root">
      {/* ── Navbar ── */}
      <header className={`lp-nav ${scrolled ? "lp-nav-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-logo">
            <div className="lp-logo-icon"><Bot size={20} color="white" /></div>
            <span className="lp-logo-text">SprintPark AI HR</span>
          </Link>

          <nav className="lp-nav-links">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="lp-nav-link">{l}</a>
            ))}
          </nav>

          <div className="lp-nav-actions">
            <Link href="/login" className="lp-btn-ghost">Sign in</Link>
            <Link href="/login" className="lp-btn-primary">Get started <ArrowRight size={14} /></Link>
          </div>

          <button className="lp-hamburger" onClick={() => setMobileMenu(true)}>
            <Menu size={22} color="#3a1a58" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="lp-mobile-overlay" onClick={() => setMobileMenu(false)}>
          <div className="lp-mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="lp-mobile-menu-header">
              <div className="lp-logo">
                <div className="lp-logo-icon"><Bot size={18} color="white" /></div>
                <span className="lp-logo-text">SprintPark AI HR</span>
              </div>
              <button onClick={() => setMobileMenu(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a80b0" }}>
                <X size={22} />
              </button>
            </div>
            <nav className="lp-mobile-nav">
              {navLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="lp-mobile-link" onClick={() => setMobileMenu(false)}>{l}</a>
              ))}
            </nav>
            <div className="lp-mobile-actions">
              <Link href="/login" className="lp-btn-ghost" style={{ textAlign: "center" }}>Sign in</Link>
              <Link href="/login" className="lp-btn-primary" style={{ justifyContent: "center" }}>Get started <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="lp-hero" id="hero">
        <div className="lp-hero-bg">
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-blob lp-blob-3" />
        </div>
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">
            <Sparkles size={13} color="#9a50b0" />
            <span>AI-powered recruitment · End-to-end automation</span>
          </div>
          <h1 className="lp-hero-h1">
            Hire smarter.<br />
            <span className="lp-hero-gradient">Move 5× faster.</span>
          </h1>
          <p className="lp-hero-sub">
            SprintPark AI HR automates your entire recruitment lifecycle —
            from resume screening to offer letters — so your team can focus
            on what matters: finding the right people.
          </p>
          <div className="lp-hero-cta">
            <Link href="/login" className="lp-btn-primary lp-btn-lg">
              Start hiring smarter <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="lp-btn-outline lp-btn-lg">
              See how it works
            </a>
          </div>
          <div className="lp-hero-trust">
            {["No credit card required", "Free 14-day trial", "Setup in 5 minutes"].map(t => (
              <span key={t} className="lp-trust-item">
                <CheckCircle size={13} color="#70b890" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hero dashboard preview */}
        <div className="lp-hero-preview">
          <div className="lp-preview-card lp-preview-main">
            <div className="lp-preview-header">
              <div className="lp-preview-dot" style={{ background: "#e07090" }} />
              <div className="lp-preview-dot" style={{ background: "#f0c060" }} />
              <div className="lp-preview-dot" style={{ background: "#70b890" }} />
              <span className="lp-preview-title">AI Recruitment Dashboard</span>
            </div>
            <div className="lp-preview-stats">
              {[["42", "Open roles"], ["1,284", "Candidates"], ["94", "AI shortlisted"], ["18d", "Avg hire time"]].map(([v, l]) => (
                <div key={l} className="lp-preview-stat">
                  <div className="lp-preview-stat-val">{v}</div>
                  <div className="lp-preview-stat-label">{l}</div>
                </div>
              ))}
            </div>
            <div className="lp-preview-funnel">
              {[["Sourced", 100, "#c080d0"], ["Screened", 62, "#d8b0f0"], ["Interviewed", 28, "#e8a0c8"], ["Offered", 11, "#f0c8e0"], ["Hired", 7, "#c080d0"]].map(([stage, w, color]) => (
                <div key={stage as string} className="lp-preview-funnel-row">
                  <span className="lp-preview-funnel-label">{stage}</span>
                  <div className="lp-preview-funnel-track">
                    <div className="lp-preview-funnel-bar" style={{ width: `${w}%`, background: color as string }} />
                  </div>
                  <span className="lp-preview-funnel-val">{w}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="lp-float-card lp-float-1">
            <div className="lp-float-icon" style={{ background: "rgba(192,128,208,0.15)" }}>
              <Sparkles size={14} color="#9a50b0" />
            </div>
            <div>
              <div className="lp-float-title">AI matched</div>
              <div className="lp-float-sub">Sarah M. · 94% score</div>
            </div>
          </div>
          <div className="lp-float-card lp-float-2">
            <div className="lp-float-icon" style={{ background: "rgba(112,184,144,0.15)" }}>
              <CheckCircle size={14} color="#3a8060" />
            </div>
            <div>
              <div className="lp-float-title">BGV cleared</div>
              <div className="lp-float-sub">Marco G. · All checks passed</div>
            </div>
          </div>
          <div className="lp-float-card lp-float-3">
            <div className="lp-float-icon" style={{ background: "rgba(232,160,200,0.15)" }}>
              <TrendingUp size={14} color="#a05080" />
            </div>
            <div>
              <div className="lp-float-title">Offer accepted</div>
              <div className="lp-float-sub">₹38L · Joining Jun 2</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="lp-stats" id="results">
        <div className="lp-stats-inner">
          {stats.map(s => (
            <div key={s.label} className="lp-stat-item">
              <div className="lp-stat-value">{s.value}</div>
              <div className="lp-stat-label">{s.label}</div>
              <div className="lp-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-badge">Features</div>
          <h2 className="lp-section-h2">Everything your recruiting team needs</h2>
          <p className="lp-section-sub">Eight AI agents working in parallel — so your team handles decisions, not busywork.</p>
          <div className="lp-features-grid">
            {features.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon" style={{ background: f.bg }}>
                  <f.icon size={20} color={f.color} />
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section lp-section-alt" id="how-it-works">
        <div className="lp-section-inner">
          <div className="lp-section-badge">How it works</div>
          <h2 className="lp-section-h2">From job post to first day — in one platform</h2>
          <p className="lp-section-sub">A streamlined workflow that replaces five tools with one.</p>
          <div className="lp-steps">
            {steps.map((s, i) => (
              <div key={s.n} className="lp-step">
                <div className="lp-step-number">{s.n}</div>
                {i < steps.length - 1 && <div className="lp-step-connector" />}
                <div className="lp-step-body">
                  <h3 className="lp-step-title">{s.title}</h3>
                  <p className="lp-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="lp-section" id="testimonials">
        <div className="lp-section-inner">
          <div className="lp-section-badge">Testimonials</div>
          <h2 className="lp-section-h2">Trusted by recruiting teams</h2>
          <p className="lp-section-sub">Hear from the people who use SprintPark AI HR every day.</p>
          <div className="lp-testimonials">
            {testimonials.map(t => (
              <div key={t.name} className="lp-testimonial-card">
                <div className="lp-testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} color="#d8a0e0" fill="#d8a0e0" />
                  ))}
                </div>
                <p className="lp-testimonial-text">"{t.text}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, #e8a0c8)` }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="lp-cta">
        <div className="lp-cta-bg">
          <div className="lp-blob lp-blob-cta-1" />
          <div className="lp-blob lp-blob-cta-2" />
        </div>
        <div className="lp-cta-inner">
          <Award size={32} color="white" style={{ opacity: 0.9 }} />
          <h2 className="lp-cta-h2">Ready to transform your hiring?</h2>
          <p className="lp-cta-sub">
            Join companies that hire faster, smarter, and with more confidence using SprintPark AI HR.
          </p>
          <div className="lp-cta-actions">
            <Link href="/login" className="lp-btn-white">
              Start free trial <ChevronRight size={16} />
            </Link>
            <Link href="/login" className="lp-btn-outline-white">
              Sign in to your workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-logo">
              <div className="lp-logo-icon"><Bot size={16} color="white" /></div>
              <span className="lp-logo-text">SprintPark AI HR</span>
            </div>
            <p className="lp-footer-tagline">AI-powered recruitment lifecycle platform. From job posting to day one.</p>
          </div>
          <div className="lp-footer-links">
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Product</div>
              {["Features", "How it works", "Pricing", "Changelog"].map(l => <a key={l} className="lp-footer-link">{l}</a>)}
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Company</div>
              {["About", "Blog", "Careers", "Contact"].map(l => <a key={l} className="lp-footer-link">{l}</a>)}
            </div>
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Legal</div>
              {["Privacy", "Terms", "Security", "GDPR"].map(l => <a key={l} className="lp-footer-link">{l}</a>)}
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 SprintPark Technologies. All rights reserved.</span>
          <span className="lp-footer-made">Made with ♥ for recruiting teams</span>
        </div>
      </footer>
    </div>
  );
}
