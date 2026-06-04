"use client";
import "./LandingPage.css";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Bot, Sparkles, ArrowRight, CheckCircle, Star, ChevronRight,
  TrendingUp, Award, Menu, X, Clock, Target, Zap, BarChart2,
} from "lucide-react";

/* ── Feature SVG illustrations ────────────────────────── */
function IconCopilot() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="16" rx="4" fill="#F2E8EC" />
      <rect x="6" y="10" width="10" height="2" rx="1" fill="#8B6474" />
      <rect x="6" y="14" width="7" height="2" rx="1" fill="#E8806A" />
      <circle cx="21" cy="10" r="4" fill="#8B6474" />
      <path d="M19.5 10l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="23" r="1.5" fill="#8B6474" />
      <rect x="13" y="22" width="2" height="2" rx="0" fill="#F2E8EC" />
    </svg>
  );
}
function IconPipeline() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="6" cy="14" r="3.5" fill="#F4A999" />
      <circle cx="14" cy="8" r="3.5" fill="#8B6474" />
      <circle cx="14" cy="20" r="3.5" fill="#D8D9B0" />
      <circle cx="22" cy="14" r="3.5" fill="#6B4A58" />
      <line x1="9" y1="12" x2="11.5" y2="9.5" stroke="#8B6474" strokeWidth="1.5" />
      <line x1="9" y1="16" x2="11.5" y2="18.5" stroke="#D8D9B0" strokeWidth="1.5" />
      <line x1="16.5" y1="9.5" x2="19" y2="12" stroke="#6B4A58" strokeWidth="1.5" />
      <line x1="16.5" y1="18.5" x2="19" y2="16" stroke="#6B4A58" strokeWidth="1.5" />
    </svg>
  );
}
function IconScreener() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="4" width="18" height="22" rx="3" fill="#FDF5F0" />
      <rect x="8" y="8" width="12" height="1.8" rx="0.9" fill="#8B6474" />
      <rect x="8" y="12" width="9" height="1.8" rx="0.9" fill="#E8806A" />
      <rect x="8" y="16" width="10" height="1.8" rx="0.9" fill="#D8D9B0" />
      <circle cx="20" cy="20" r="5" fill="#8B6474" />
      <path d="M18 20l1.5 1.5 2.5-2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSchedule() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="18" rx="3" fill="#F5F0EB" />
      <rect x="4" y="6" width="20" height="6" rx="3" fill="#D8D9B0" />
      <circle cx="10" cy="4" r="1.5" fill="#8B6474" />
      <circle cx="18" cy="4" r="1.5" fill="#8B6474" />
      <rect x="8" y="16" width="4" height="4" rx="1" fill="#8B6474" />
      <rect x="16" y="16" width="4" height="4" rx="1" fill="#E8806A" opacity="0.5" />
      <rect x="8" y="14" width="4" height="1.5" rx="0.5" fill="#B8CDAA" />
    </svg>
  );
}
function IconOffer() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="5" width="20" height="18" rx="3" fill="#FDF5F0" />
      <path d="M4 10h20" stroke="#DDD0C8" strokeWidth="1" />
      <rect x="7" y="13" width="6" height="1.5" rx="0.7" fill="#8B6474" />
      <rect x="7" y="16.5" width="8" height="1.5" rx="0.7" fill="#E8806A" />
      <rect x="7" y="20" width="5" height="1.5" rx="0.7" fill="#D8D9B0" />
      <circle cx="20" cy="8" r="3" fill="#6B4A58" />
      <path d="M18.8 8l.8.8 1.5-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBGV() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L5 7v7c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7L14 3z" fill="#F2E8EC" />
      <path d="M14 3L5 7v7c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7L14 3z" stroke="#8B6474" strokeWidth="1.2" fill="none" />
      <path d="M10 14l2.5 2.5 5-5" stroke="#6B4A58" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAnalytics() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="18" width="4" height="7" rx="1.5" fill="#8B6474" />
      <rect x="9" y="13" width="4" height="12" rx="1.5" fill="#E8806A" />
      <rect x="15" y="8" width="4" height="17" rx="1.5" fill="#6B4A58" />
      <rect x="21" y="11" width="4" height="14" rx="1.5" fill="#F4A999" />
      <polyline points="5,17 11,11 17,6 23,9" stroke="#3D2B32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="5" cy="17" r="1.5" fill="#3D2B32" />
      <circle cx="11" cy="11" r="1.5" fill="#3D2B32" />
      <circle cx="17" cy="6" r="1.5" fill="#3D2B32" />
      <circle cx="23" cy="9" r="1.5" fill="#3D2B32" />
    </svg>
  );
}
function IconCopilotChat() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="5" width="16" height="11" rx="3" fill="#F2E8EC" />
      <rect x="5" y="8" width="8" height="1.5" rx="0.7" fill="#8B6474" />
      <rect x="5" y="11" width="5" height="1.5" rx="0.7" fill="#E8806A" />
      <path d="M8 16l-2 2.5h5L8 16z" fill="#F2E8EC" />
      <rect x="10" y="13" width="15" height="10" rx="3" fill="#8B6474" />
      <rect x="12" y="16" width="7" height="1.5" rx="0.7" fill="white" opacity="0.8" />
      <rect x="12" y="19" width="5" height="1.5" rx="0.7" fill="white" opacity="0.5" />
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────── */
const features = [
  {
    Img: IconCopilot,
    color: "#9B7485",
    bg: "rgba(155,116,133,0.1)",
    title: "AI Interview Copilot",
    tagline: "Never miss a great answer again",
    desc: "Real-time transcription and smart follow-up suggestions during live interviews.",
    bullets: ["Auto-transcribes every interview", "Suggests follow-up questions instantly", "Scores candidates right after the call"],
  },
  {
    Img: IconPipeline,
    color: "#E8806A",
    bg: "rgba(232,128,106,0.1)",
    title: "Candidate Pipeline",
    tagline: "Every candidate, one clean view",
    desc: "A single dashboard for all applicants across every stage and role.",
    bullets: ["AI match scores per candidate", "Skill breakdowns at a glance", "One-click interview scheduling"],
  },
  {
    Img: IconScreener,
    color: "#7D5568",
    bg: "rgba(125,85,104,0.08)",
    title: "Resume Screener Agent",
    tagline: "Shortlist 100 CVs in 35 minutes",
    desc: "Automatically scores and ranks every applicant so you only review the best.",
    bullets: ["Reads every resume instantly", "Ranks by fit, not by order received", "Explains why each candidate scored"],
  },
  {
    Img: IconSchedule,
    color: "#8DB89A",
    bg: "rgba(141,184,154,0.1)",
    title: "Smart Scheduling",
    tagline: "Zero back-and-forth emails",
    desc: "Detects conflicts and books interview slots automatically for all parties.",
    bullets: ["Reads all interviewer calendars", "Detects conflicts before they happen", "Sends calendar invites with join links"],
  },
  {
    Img: IconOffer,
    color: "#9B7485",
    bg: "rgba(155,116,133,0.1)",
    title: "Offer Generation",
    tagline: "Right offer, first time",
    desc: "AI suggests pay bands based on live market data, then drafts the offer letter.",
    bullets: ["Market-benchmarked compensation", "One-click offer letter drafting", "Tracks acceptance in real time"],
  },
  {
    Img: IconBGV,
    color: "#7D5568",
    bg: "rgba(125,85,104,0.08)",
    title: "BGV Tracking",
    tagline: "Know before day one",
    desc: "Runs background checks automatically and alerts you the moment anything flags.",
    bullets: ["Identity, education & employment checks", "Live status dashboard per candidate", "Instant alerts on any discrepancy"],
  },
  {
    Img: IconAnalytics,
    color: "#E8806A",
    bg: "rgba(232,128,106,0.1)",
    title: "Real-time Analytics",
    tagline: "See exactly where hiring slows down",
    desc: "Tracks every stage of your funnel so you know what to fix and when.",
    bullets: ["Funnel drop-off by stage & role", "Time-to-hire and cost-per-hire trends", "AI accuracy scores over time"],
  },
  {
    Img: IconCopilotChat,
    color: "#8DB89A",
    bg: "rgba(141,184,154,0.1)",
    title: "HR Copilot Chat",
    tagline: "Ask HR anything, get instant answers",
    desc: "Chat with an AI trained on your policies, job data, and candidate history.",
    bullets: ["Answers policy questions instantly", "Compares candidates side by side", "Summarises interview feedback on demand"],
  },
];

const stats = [
  {
    icon: Clock,
    value: 18, suffix: " days", prefix: "",
    label: "Average Time to Hire",
    context: "From job post to accepted offer",
    detail: "Our AI handles screening, scheduling, and follow-ups automatically — cutting the average hiring cycle from 32 days down to 18.",
    sub: "4 days faster than the industry average",
    color: "#9B7485",
    bg: "rgba(155,116,133,0.1)",
    bar: 56,
  },
  {
    icon: Target,
    value: 91, suffix: "%", prefix: "",
    label: "AI Shortlist Accuracy",
    context: "Candidates matched to the right roles",
    detail: "Our Resume Screener scores every applicant against your job criteria — hiring managers confirm 91% of AI picks as genuinely qualified.",
    sub: "Validated by hiring managers across 200+ roles",
    color: "#E8806A",
    bg: "rgba(232,128,106,0.1)",
    bar: 91,
  },
  {
    icon: TrendingUp,
    value: 89, suffix: "%", prefix: "",
    label: "Offer Acceptance Rate",
    context: "Candidates who say yes to offers",
    detail: "AI-suggested compensation bands grounded in live market data mean offers land in the right range — fewer rejections, less negotiation.",
    sub: "Up 8% since switching to AI offer generation",
    color: "#8DB89A",
    bg: "rgba(141,184,154,0.1)",
    bar: 89,
  },
  {
    icon: Zap,
    value: 5, suffix: "×", prefix: "",
    label: "Faster Resume Screening",
    context: "Compared to manual CV review",
    detail: "What takes a recruiter 3 hours to screen manually, SprintPark's agent completes in under 35 minutes — with consistent, bias-free scoring.",
    sub: "35 min vs 3 hrs for 100 applications",
    color: "#7D5568",
    bg: "rgba(125,85,104,0.08)",
    bar: 80,
  },
];

const testimonials = [
  {
    name: "Priya Rajan",
    role: "Head of Talent Acquisition · Acme Inc",
    initials: "PR",
    color: "#8B6474",
    rating: 5,
    text: "SprintPark cut our time-to-hire from 32 days to 18. The AI copilot during interviews is a game-changer — our interviewers actually enjoy the process now.",
  },
  {
    name: "Arjun Krishnan",
    role: "Engineering Lead · Acme Inc",
    initials: "AK",
    color: "#6B4A58",
    rating: 5,
    text: "Resume screening used to eat half my week. Now I get a ranked shortlist with skill breakdowns in my inbox before my morning standup. I just review and approve.",
  },
  {
    name: "Sneha Mehta",
    role: "HR Business Partner · Acme Inc",
    initials: "SM",
    color: "#8DB89A",
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

/* ── Hooks ────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

function StatCard({ s, delay }: { s: typeof stats[0]; delay: number }) {
  const { ref, visible } = useInView();
  const count = useCounter(s.value, visible);
  return (
    <div ref={ref} className="lp-result-card" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div className="lp-result-icon" style={{ background: s.bg }}>
          <s.icon size={20} color={s.color} />
        </div>
        <span className="lp-result-context">{s.context}</span>
      </div>
      <div className="lp-result-number" style={{ color: s.color }}>
        {s.prefix}{count}{s.suffix}
      </div>
      <div className="lp-result-label">{s.label}</div>
      <p className="lp-result-detail">{s.detail}</p>
      <div className="lp-result-bar-track">
        <div className="lp-result-bar-fill" style={{ width: visible ? `${s.bar}%` : "0%", background: s.color, transition: `width 1.2s ease ${delay + 200}ms` }} />
      </div>
      <div className="lp-result-sub">{s.sub}</div>
    </div>
  );
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Component ────────────────────────────────────────── */
const navLinks = ["Features", "How it works", "Results", "Testimonials", "Contact"];
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
              l === "Contact"
                ? <Link key={l} href="/contact" className="lp-nav-link">{l}</Link>
                : <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="lp-nav-link">{l}</a>
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
                l === "Contact"
                  ? <Link key={l} href="/contact" className="lp-mobile-link" onClick={() => setMobileMenu(false)}>{l}</Link>
                  : <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="lp-mobile-link" onClick={() => setMobileMenu(false)}>{l}</a>
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
          {/* Clean HR AI illustration — right side only, minimal */}
          <svg className="lp-hero-svg" viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* ── Subtle dot grid — far right only ── */}
            {Array.from({length:8}).map((_,row)=>Array.from({length:7}).map((_,col)=>(
              <circle key={`${row}-${col}`} cx={col*55+560} cy={row*65+40} r="1.8" fill="#9B7485" opacity="0.1"/>
            )))}

            {/* ── Main dashboard card ── */}
            <rect x="480" y="60" width="340" height="200" rx="16" fill="white" opacity="0.88"/>
            <rect x="480" y="60" width="340" height="200" rx="16" stroke="#E2D4CC" strokeWidth="1.2" fill="none"/>
            {/* Card header bar */}
            <rect x="480" y="60" width="340" height="38" rx="16" fill="rgba(155,116,133,0.07)"/>
            <rect x="480" y="82" width="340" height="16" fill="rgba(155,116,133,0.07)"/>
            <circle cx="500" cy="79" r="5" fill="rgba(232,128,106,0.5)"/>
            <circle cx="516" cy="79" r="5" fill="rgba(216,217,176,0.7)"/>
            <circle cx="532" cy="79" r="5" fill="rgba(141,184,154,0.6)"/>
            <text x="650" y="83" textAnchor="middle" fontSize="10" fill="#A8919A" fontWeight="600" fontFamily="sans-serif">AI Recruitment Dashboard</text>

            {/* Stat boxes */}
            <rect x="492" y="108" width="72" height="50" rx="8" fill="rgba(155,116,133,0.07)"/>
            <text x="528" y="128" textAnchor="middle" fontSize="18" fill="#9B7485" fontWeight="800" fontFamily="sans-serif">42</text>
            <text x="528" y="145" textAnchor="middle" fontSize="8" fill="#A8919A" fontFamily="sans-serif">Open roles</text>

            <rect x="574" y="108" width="72" height="50" rx="8" fill="rgba(232,128,106,0.07)"/>
            <text x="610" y="128" textAnchor="middle" fontSize="18" fill="#E8806A" fontWeight="800" fontFamily="sans-serif">1,284</text>
            <text x="610" y="145" textAnchor="middle" fontSize="8" fill="#A8919A" fontFamily="sans-serif">Candidates</text>

            <rect x="656" y="108" width="72" height="50" rx="8" fill="rgba(141,184,154,0.1)"/>
            <text x="692" y="128" textAnchor="middle" fontSize="18" fill="#8DB89A" fontWeight="800" fontFamily="sans-serif">91%</text>
            <text x="692" y="145" textAnchor="middle" fontSize="8" fill="#A8919A" fontFamily="sans-serif">AI accuracy</text>

            <rect x="738" y="108" width="72" height="50" rx="8" fill="rgba(125,85,104,0.07)"/>
            <text x="774" y="128" textAnchor="middle" fontSize="18" fill="#7D5568" fontWeight="800" fontFamily="sans-serif">18d</text>
            <text x="774" y="145" textAnchor="middle" fontSize="8" fill="#A8919A" fontFamily="sans-serif">Avg hire time</text>

            {/* Funnel bars */}
            {[
              {label:"Sourced",    pct:100, color:"#9B7485", y:172},
              {label:"Screened",   pct:62,  color:"#E8806A", y:186},
              {label:"Interviewed",pct:38,  color:"#D8D9B0", y:200},
              {label:"Offered",    pct:20,  color:"#8DB89A", y:214},
              {label:"Hired",      pct:11,  color:"#7D5568", y:228},
            ].map(({label,pct,color,y})=>(
              <g key={label}>
                <text x="496" y={y+8} fontSize="8.5" fill="#A8919A" fontFamily="sans-serif">{label}</text>
                <rect x="552" y={y} width="240" height="9" rx="4.5" fill="rgba(226,212,204,0.4)"/>
                <rect x="552" y={y} width={240*pct/100} height="9" rx="4.5" fill={color} opacity="0.75"/>
                <text x="800" y={y+8} fontSize="8" fill="#7E6070" fontFamily="sans-serif">{pct}%</text>
              </g>
            ))}

            {/* ── Floating card 1 — AI matched ── */}
            <rect x="530" y="285" width="175" height="56" rx="12" fill="white" opacity="0.95"/>
            <rect x="530" y="285" width="175" height="56" rx="12" stroke="#E2D4CC" strokeWidth="1" fill="none"/>
            <rect x="543" y="298" width="28" height="28" rx="8" fill="rgba(141,184,154,0.2)"/>
            <circle cx="557" cy="308" r="7" fill="rgba(141,184,154,0.5)"/>
            <path d="M553 308l3 3 5-5" stroke="#4a7a5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="578" y="307" fontSize="10" fill="#4A3040" fontWeight="700" fontFamily="sans-serif">BGV Cleared</text>
            <text x="578" y="320" fontSize="9" fill="#A8919A" fontFamily="sans-serif">Marco G. · All checks passed</text>
            <rect x="578" y="327" width="55" height="8" rx="4" fill="rgba(141,184,154,0.25)"/>
            <text x="605" y="334" textAnchor="middle" fontSize="7" fill="#4a7a5a" fontWeight="600" fontFamily="sans-serif">3 mins ago</text>

            {/* ── Floating card 2 — Offer accepted ── */}
            <rect x="650" y="358" width="170" height="56" rx="12" fill="white" opacity="0.95"/>
            <rect x="650" y="358" width="170" height="56" rx="12" stroke="#E2D4CC" strokeWidth="1" fill="none"/>
            <rect x="663" y="371" width="28" height="28" rx="8" fill="rgba(232,128,106,0.12)"/>
            <path d="M671 385l3 4 6-7" stroke="#c05a40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="698" y="380" fontSize="10" fill="#4A3040" fontWeight="700" fontFamily="sans-serif">Offer Accepted</text>
            <text x="698" y="393" fontSize="9" fill="#A8919A" fontFamily="sans-serif">Priya S. · ₹38L · Jun 9</text>
            <rect x="698" y="400" width="62" height="8" rx="4" fill="rgba(232,128,106,0.15)"/>
            <text x="729" y="407" textAnchor="middle" fontSize="7" fill="#c05a40" fontWeight="600" fontFamily="sans-serif">Just now</text>

            {/* ── Floating card 3 — AI Score ── */}
            <rect x="480" y="375" width="155" height="56" rx="12" fill="white" opacity="0.95"/>
            <rect x="480" y="375" width="155" height="56" rx="12" stroke="#E2D4CC" strokeWidth="1" fill="none"/>
            <rect x="493" y="388" width="28" height="28" rx="8" fill="rgba(155,116,133,0.1)"/>
            <text x="507" y="406" textAnchor="middle" fontSize="11" fill="#9B7485" fontWeight="800" fontFamily="sans-serif">94%</text>
            <text x="528" y="397" fontSize="10" fill="#4A3040" fontWeight="700" fontFamily="sans-serif">AI Match Score</text>
            <text x="528" y="410" fontSize="9" fill="#A8919A" fontFamily="sans-serif">Sarah M. · Senior Backend</text>
            <rect x="528" y="418" width="50" height="8" rx="4" fill="rgba(155,116,133,0.12)"/>
            <text x="553" y="425" textAnchor="middle" fontSize="7" fill="#7D5568" fontWeight="600" fontFamily="sans-serif">Shortlisted</text>

            {/* ── Soft connection lines between cards ── */}
            <line x1="617" y1="260" x2="617" y2="285" stroke="#E2D4CC" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
            <line x1="735" y1="260" x2="735" y2="358" stroke="#E2D4CC" strokeWidth="1" strokeDasharray="4 3" opacity="0.4"/>
          </svg>
        </div>
        <div className="lp-hero-inner">
          <h1 className="lp-hero-h1">
            Finding great talent is hard.<br />
            <span className="lp-hero-gradient">Hiring them shouldn't be.</span>
          </h1>
          <p className="lp-hero-sub">
            SprintPark AI HR automates your entire recruitment lifecycle — from resume screening to offer letters — so your team can spend less time managing hiring tasks and more time choosing the right people.
          </p>
          <div className="lp-hero-cta">
            <Link href="/login" className="lp-btn-primary lp-btn-lg">
              Start Hiring Smarter <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="lp-btn-outline lp-btn-lg">
              See How It Works
            </a>
          </div>
          <div className="lp-hero-trust">
            {["Free 14-day trial", "Setup in 5 minutes"].map(t => (
              <span key={t} className="lp-trust-item">
                <CheckCircle size={13} color="#8DB89A" />
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
              {[["Sourced", 100, "#8B6474"], ["Screened", 62, "#E8806A"], ["Interviewed", 28, "#F4A999"], ["Offered", 11, "#D8D9B0"], ["Hired", 7, "#8DB89A"]].map(([stage, w, color]) => (
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

      {/* ── Results ── */}
      <section className="lp-section lp-section-alt" id="results">
        <div className="lp-section-inner">
          <FadeIn>
            <div className="lp-section-badge">Results</div>
            <h2 className="lp-section-h2">Numbers that speak for themselves</h2>
            <p className="lp-section-sub">Real outcomes from teams using SprintPark AI HR across their full recruitment lifecycle.</p>
          </FadeIn>
          <div className="lp-results-grid">
            {stats.map((s, i) => <StatCard key={s.label} s={s} delay={i * 120} />)}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <FadeIn>
            <div className="lp-section-badge">Features</div>
            <h2 className="lp-section-h2">Everything your recruiting team needs</h2>
            <p className="lp-section-sub">Eight AI agents working in parallel — so your team handles decisions, not busywork.</p>
          </FadeIn>
          <div className="lp-features-grid">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 60}>
                <div className="lp-feature-card">
                  {/* Front face */}
                  <div className="lp-feature-front">
                    <div className="lp-feature-icon" style={{ background: f.bg }}>
                      <f.Img />
                    </div>
                    <div className="lp-feature-tag" style={{ color: f.color }}>{f.tagline}</div>
                    <h3 className="lp-feature-title">{f.title}</h3>
                    <p className="lp-feature-desc">{f.desc}</p>
                  </div>
                  {/* Hover face */}
                  <div className="lp-feature-back" style={{ borderTop: `3px solid ${f.color}` }}>
                    <div className="lp-feature-back-title" style={{ color: f.color }}>{f.title}</div>
                    <ul className="lp-feature-bullets">
                      {f.bullets.map(b => (
                        <li key={b} className="lp-feature-bullet">
                          <span className="lp-bullet-dot" style={{ background: f.color }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="lp-feature-back-cta" style={{ color: f.color }}>Learn more →</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section lp-section-alt" id="how-it-works">
        <div className="lp-section-inner">
          <FadeIn>
            <div className="lp-section-badge">How it works</div>
            <h2 className="lp-section-h2">From job post to first day — in one platform</h2>
            <p className="lp-section-sub">A streamlined workflow that replaces five tools with one.</p>
          </FadeIn>
          <div className="lp-steps">
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={i * 120}>
                <div className="lp-step">
                  <div className="lp-step-number">{s.n}</div>
                  <div className="lp-step-body">
                    <h3 className="lp-step-title">{s.title}</h3>
                    <p className="lp-step-desc">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="lp-section" id="testimonials">
        <div className="lp-section-inner">
          <FadeIn>
            <div className="lp-section-badge">Testimonials</div>
            <h2 className="lp-section-h2">Trusted by recruiting teams</h2>
            <p className="lp-section-sub">Hear from the people who use SprintPark AI HR every day.</p>
          </FadeIn>
          <div className="lp-testimonials">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div className="lp-testimonial-card">
                  <div className="lp-testimonial-stars">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} color="#8B6474" fill="#8B6474" />
                    ))}
                  </div>
                  <p className="lp-testimonial-text">"{t.text}"</p>
                  <div className="lp-testimonial-author">
                    <div className="lp-testimonial-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, #E8806A)` }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="lp-testimonial-name">{t.name}</div>
                      <div className="lp-testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
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
              {["About", "Blog", "Careers", "Contact"].map(l => <a key={l} href={l === "Contact" ? "/contact" : "#"} className="lp-footer-link">{l}</a>)}
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
