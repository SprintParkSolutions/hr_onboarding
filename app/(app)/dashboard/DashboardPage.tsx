"use client";
import "./DashboardPage.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const FunnelChart = dynamic(() => import("./FunnelChart"), {
  ssr: false,
  loading: () => <div style={{ height: 180, background: "#f8faff", borderRadius: 8 }} />,
});

type FunnelRow = { stage: string; value: number; prev: number; color: string; conv: string | null };

const roleFunnels: Record<string, FunnelRow[]> = {
  "All Roles": [
    { stage: "Sourced",     value: 1284, prev: 1100, color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 796,  prev: 680,  color: "#9EC8FF", conv: "62%" },
    { stage: "Interviewed", value: 358,  prev: 310,  color: "#BA9FE7", conv: "45%" },
    { stage: "Offered",     value: 142,  prev: 120,  color: "#C8A8F0", conv: "40%" },
    { stage: "Hired",       value: 89,   prev: 74,   color: "#9E74D0", conv: "63%" },
  ],
  "Senior Backend Engineer": [
    { stage: "Sourced",     value: 142, prev: 120, color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 98,  prev: 82,  color: "#9EC8FF", conv: "69%" },
    { stage: "Interviewed", value: 41,  prev: 35,  color: "#BA9FE7", conv: "42%" },
    { stage: "Offered",     value: 12,  prev: 9,   color: "#C8A8F0", conv: "29%" },
    { stage: "Hired",       value: 7,   prev: 5,   color: "#9E74D0", conv: "58%" },
  ],
  "Product Designer": [
    { stage: "Sourced",     value: 87,  prev: 70,  color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 54,  prev: 44,  color: "#9EC8FF", conv: "62%" },
    { stage: "Interviewed", value: 22,  prev: 18,  color: "#BA9FE7", conv: "41%" },
    { stage: "Offered",     value: 8,   prev: 6,   color: "#C8A8F0", conv: "36%" },
    { stage: "Hired",       value: 5,   prev: 4,   color: "#9E74D0", conv: "63%" },
  ],
  "Frontend Engineer": [
    { stage: "Sourced",     value: 203, prev: 175, color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 134, prev: 110, color: "#9EC8FF", conv: "66%" },
    { stage: "Interviewed", value: 58,  prev: 48,  color: "#BA9FE7", conv: "43%" },
    { stage: "Offered",     value: 19,  prev: 15,  color: "#C8A8F0", conv: "33%" },
    { stage: "Hired",       value: 11,  prev: 9,   color: "#9E74D0", conv: "58%" },
  ],
  "Data Scientist": [
    { stage: "Sourced",     value: 56,  prev: 48,  color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 32,  prev: 26,  color: "#9EC8FF", conv: "57%" },
    { stage: "Interviewed", value: 14,  prev: 11,  color: "#BA9FE7", conv: "44%" },
    { stage: "Offered",     value: 5,   prev: 4,   color: "#C8A8F0", conv: "36%" },
    { stage: "Hired",       value: 3,   prev: 2,   color: "#9E74D0", conv: "60%" },
  ],
  "DevOps Engineer": [
    { stage: "Sourced",     value: 34,  prev: 28,  color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 22,  prev: 18,  color: "#9EC8FF", conv: "65%" },
    { stage: "Interviewed", value: 10,  prev: 8,   color: "#BA9FE7", conv: "45%" },
    { stage: "Offered",     value: 4,   prev: 3,   color: "#C8A8F0", conv: "40%" },
    { stage: "Hired",       value: 3,   prev: 2,   color: "#9E74D0", conv: "75%" },
  ],
  "Product Manager": [
    { stage: "Sourced",     value: 119, prev: 100, color: "#80B2FF", conv: null },
    { stage: "Screened",    value: 74,  prev: 62,  color: "#9EC8FF", conv: "62%" },
    { stage: "Interviewed", value: 31,  prev: 26,  color: "#BA9FE7", conv: "42%" },
    { stage: "Offered",     value: 9,   prev: 7,   color: "#C8A8F0", conv: "29%" },
    { stage: "Hired",       value: 6,   prev: 5,   color: "#9E74D0", conv: "67%" },
  ],
};

const roles = Object.keys(roleFunnels);

const agents = [
  { name: "Resume Screener",       status: "Parsing 12 resumes",   active: true },
  { name: "Scheduling Agent",      status: "3 slots booked",        active: true },
  { name: "Feedback Analyzer",     status: "Idle",                  active: false },
  { name: "Offer Letter Agent",    status: "Drafting 2 offers",     active: true },
  { name: "Background Verification", status: "5 checks running",   active: true },
  { name: "Onboarding Agent",      status: "2 day-1 checklists",    active: true },
];

const approvals = [
  { initials: "SM", color: "#8b5cf6", name: "Sarah Mitchell", role: "Senior Backend Engineer", detail: "AI match score 94% · 8 yrs Python, Kafka, AWS · Submitted by Resume Screener Agent", actions: ["Reject", "Approve"] },
  { initials: "RK", color: "#f59e0b", name: "Rohan Kapoor",   role: "Product Designer",        detail: "AI suggested band ₹28L–32L · Manager approved · Drafted by Offer Letter Agent",    actions: ["Edit", "Send"] },
  { initials: "YT", color: "#10b981", name: "Yuki Tanaka",    role: "Tomorrow 11am",           detail: "Interviewer conflict detected · 3 alternative slots proposed by Reschedule Agent",  actions: ["View slots", "Auto pick"] },
];

const CustomTooltip = null; // moved to FunnelChart.tsx

export default function DashboardPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const funnelData = roleFunnels[selectedRole];
  const totalSourced = funnelData[0].value;
  const totalHired   = funnelData[funnelData.length - 1].value;
  const overallConv  = ((totalHired / totalSourced) * 100).toFixed(1);

  const stats = [
    { label: "Open roles",        value: "42",    trend: "+6 this week",    up: true,  icon: Briefcase, link: "/jobs" },
    { label: "Active candidates", value: "1,284", trend: "218 in pipeline", up: null,  icon: Users,     link: "/candidates" },
    { label: "Avg time to hire",  value: "18 days",trend: "4d faster vs Q4",up: true,  icon: Clock,     link: null },
    { label: "AI shortlisted",    value: "94",    trend: "12 pending review",up: null, icon: Sparkles,  link: "/candidates" },
  ];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1 className="dash-greeting">Good afternoon, Priya</h1>
          <p className="dash-sub">12 approvals pending · 7 AI agents active · 4 interviews today</p>
        </div>
        <div className="dash-actions">
          <button className="btn-primary">+ New job</button>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.link ? "stat-card-link" : ""}`} onClick={() => s.link && router.push(s.link)}>
            <div className="stat-top"><span className="stat-label">{s.label}</span><s.icon size={16} color="#8aaabb" /></div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-trend ${s.up === true ? "up" : s.up === false ? "down" : ""}`}>
              {s.up === true && <TrendingUp size={12} />}{s.up === false && <TrendingDown size={12} />}{s.trend}
            </div>
            {s.link && <span className="stat-cta">View all →</span>}
          </div>
        ))}
      </div>

      <div className="mid-grid">
        {/* HIRING FUNNEL */}
        <div className="card funnel-card">
          <div className="card-header">
            <span className="card-title">Hiring Funnel</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="card-meta">Last 30 days</span>
              {/* Role Dropdown */}
              <div style={{ position: "relative" }}>
                <button className="funnel-role-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {selectedRole} <ChevronDown size={13} />
                </button>
                {dropdownOpen && (
                  <>
                    <div onClick={() => setDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
                    <div className="funnel-dropdown">
                      {roles.map(r => (
                        <div key={r} className={`funnel-dropdown-item ${r === selectedRole ? "active" : ""}`}
                          onClick={() => { setSelectedRole(r); setDropdownOpen(false); }}>
                          {r}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="funnel-summary">
            <div className="funnel-summary-item">
              <span className="fs-val">{totalSourced.toLocaleString()}</span>
              <span className="fs-label">Total sourced</span>
            </div>
            <ArrowRight size={14} color="#c8d8e8" />
            <div className="funnel-summary-item">
              <span className="fs-val">{totalHired}</span>
              <span className="fs-label">Hired</span>
            </div>
            <ArrowRight size={14} color="#c8d8e8" />
            <div className="funnel-summary-item">
              <span className="fs-val" style={{ color: "#9E74D0" }}>{overallConv}%</span>
              <span className="fs-label">Overall conv.</span>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ height: 180, marginBottom: 16 }}>
            <FunnelChart data={funnelData} />
          </div>

          {/* Column headers */}
          <div className="funnel-col-header">
            <div className="funnel-dot" style={{ opacity: 0 }} />
            <span className="funnel-stage-name" />
            <div style={{ flex: 1 }} />
            <span className="funnel-col-label">Count</span>
            <span className="funnel-col-label">Conv %</span>
            <span className="funnel-col-label">vs Prev</span>
          </div>

          {/* Detail rows */}
          {funnelData.map((f) => (
            <div key={f.stage} className="funnel-detail-row">
              <div className="funnel-dot" style={{ background: f.color }} />
              <span className="funnel-stage-name">{f.stage}</span>
              <div className="funnel-bar-wrap">
                <div className="funnel-bar" style={{ width: `${(f.value / totalSourced) * 100}%`, background: f.color }} />
              </div>
              <span className="funnel-count">{f.value.toLocaleString()}</span>
              {f.conv
                ? <span className="funnel-conv">{f.conv}</span>
                : <span className="funnel-conv funnel-conv-base">Base</span>}
              <span className={`funnel-delta ${f.value > f.prev ? "pos" : "neg"}`}>
                {f.value > f.prev ? "▲" : "▼"} {Math.abs(f.value - f.prev)}
              </span>
            </div>
          ))}
        </div>

        {/* LIVE AI AGENTS */}
        <div className="card agents-card">
          <div className="card-header">
            <span className="card-title">Live AI agents</span>
            <span className="agents-badge">● 7 active</span>
          </div>
          {agents.map((a) => (
            <div key={a.name} className="agent-row">
              <div className="agent-icon" />
              <div className="agent-info">
                <span className="agent-name">{a.name}</span>
                <span className="agent-status">{a.status}</span>
              </div>
              <span className={`agent-dot ${a.active ? "active" : "idle"}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="card approvals-card">
        <div className="card-header">
          <span className="card-title">Pending your approval</span>
          <a href="#" className="view-all">View all 12 →</a>
        </div>
        {approvals.map((a) => (
          <div key={a.name} className="approval-row">
            <div className="approval-avatar" style={{ background: a.color }}>{a.initials}</div>
            <div className="approval-info">
              <div className="approval-name">{a.name} · <span className="approval-role">{a.role}</span></div>
              <div className="approval-detail">{a.detail}</div>
            </div>
            <div className="approval-btns">
              <button className="btn-outline-sm">{a.actions[0]}</button>
              <button className="btn-primary-sm">{a.actions[1]}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
