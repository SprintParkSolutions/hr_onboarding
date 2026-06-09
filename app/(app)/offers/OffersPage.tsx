"use client";
import "./OffersPage.css";
import { FileText, Send, Users, Calendar, Cpu, TrendingUp, Pencil, Check, X } from "lucide-react";
import { useState } from "react";

const initialOffers = [
  { initials: "RK", color: "#f59e0b", name: "Rohan Kapoor",   role: "Product Designer",        band: "₹28L – ₹32L", equity: "0.05%", bonus: "₹2L", status: "Sent",     sentDate: "20 May 2026" },
  { initials: "SM", color: "#8b5cf6", name: "Sarah Mitchell",  role: "Senior Backend Engineer", band: "₹42L – ₹48L", equity: "0.1%",  bonus: "₹4L", status: "Draft",    sentDate: "—" },
  { initials: "MG", color: "#2563eb", name: "Marco Greco",     role: "DevOps Engineer",         band: "₹36L – ₹40L", equity: "0.08%", bonus: "₹3L", status: "Accepted", sentDate: "18 May 2026" },
  { initials: "PS", color: "#0891b2", name: "Priya Sharma",    role: "Product Manager",         band: "₹38L – ₹44L", equity: "0.12%", bonus: "₹5L", status: "Declined", sentDate: "15 May 2026" },
];

const hiredEmployees = [
  {
    initials: "MG", color: "#2563eb", name: "Marco Greco",
    role: "DevOps Engineer", dept: "Infrastructure",
    ctc: "₹38L", joiningDate: "2 Jun 2026",
    technologies: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD"],
    reportingTo: "Sneha M.", location: "Bangalore",
  },
  {
    initials: "YT", color: "#10b981", name: "Yuki Tanaka",
    role: "Frontend Engineer", dept: "Engineering",
    ctc: "₹24L", joiningDate: "9 Jun 2026",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    reportingTo: "Arjun K.", location: "Remote",
  },
  {
    initials: "AL", color: "#ef4444", name: "Aisha Levi",
    role: "Data Scientist", dept: "Analytics",
    ctc: "₹22L", joiningDate: "16 Jun 2026",
    technologies: ["Python", "TensorFlow", "SQL", "Spark"],
    reportingTo: "Rahul D.", location: "Hyderabad",
  },
  {
    initials: "DS", color: "#8b5cf6", name: "Divya Sharma",
    role: "Product Designer", dept: "Design",
    ctc: "₹26L", joiningDate: "2 Jun 2026",
    technologies: ["Figma", "Prototyping", "Design Systems", "User Research"],
    reportingTo: "Priya R.", location: "Mumbai",
  },
  {
    initials: "SJ", color: "#0891b2", name: "Suresh Joshi",
    role: "DevOps Engineer", dept: "Infrastructure",
    ctc: "₹34L", joiningDate: "23 Jun 2026",
    technologies: ["Docker", "AWS", "CI/CD", "Grafana"],
    reportingTo: "Sneha M.", location: "Bangalore",
  },
  {
    initials: "RV", color: "#f59e0b", name: "Rohit Verma",
    role: "Product Manager", dept: "Product",
    ctc: "₹40L", joiningDate: "1 Jul 2026",
    technologies: ["Roadmapping", "Agile", "SQL", "Mixpanel"],
    reportingTo: "CEO", location: "Delhi",
  },
];

const roleStats = [
  { role: "Senior Backend Engineer", hired: 7,  target: 10, color: "#80B2FF" },
  { role: "Product Designer",        hired: 5,  target: 6,  color: "#BA9FE7" },
  { role: "Frontend Engineer",       hired: 11, target: 12, color: "#9CE0FF" },
  { role: "Data Scientist",          hired: 3,  target: 5,  color: "#C8A8F0" },
  { role: "DevOps Engineer",         hired: 3,  target: 4,  color: "#9E74D0" },
  { role: "Product Manager",         hired: 6,  target: 8,  color: "#80B2FF" },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  Sent:     { bg: "rgba(128,178,255,0.2)",  text: "#1a6080" },
  Draft:    { bg: "rgba(253,255,200,0.6)",  text: "#806020" },
  Accepted: { bg: "rgba(200,247,220,0.6)",  text: "#2a7a50" },
  Declined: { bg: "rgba(255,200,216,0.5)",  text: "#c0506a" },
};

type BgvCheck = { label: string; status: "Verified" | "Pending" | "In Progress" | "Failed" };
type BgvRecord = {
  initials: string; color: string; name: string; role: string;
  agency: string; initiatedDate: string; expectedDate: string;
  overallStatus: "Clear" | "Pending" | "In Progress" | "Action Required";
  checks: BgvCheck[];
};

const bgvRecords: BgvRecord[] = [
  {
    initials: "MG", color: "#2563eb", name: "Marco Greco", role: "DevOps Engineer",
    agency: "AuthBridge", initiatedDate: "19 May 2026", expectedDate: "26 May 2026",
    overallStatus: "Clear",
    checks: [
      { label: "Identity",        status: "Verified"    },
      { label: "Education",       status: "Verified"    },
      { label: "Employment",      status: "Verified"    },
      { label: "Criminal Record", status: "Verified"    },
      { label: "Address",         status: "Verified"    },
      { label: "Reference",       status: "Verified"    },
    ],
  },
  {
    initials: "YT", color: "#10b981", name: "Yuki Tanaka", role: "Frontend Engineer",
    agency: "KPMG BGV", initiatedDate: "20 May 2026", expectedDate: "27 May 2026",
    overallStatus: "In Progress",
    checks: [
      { label: "Identity",        status: "Verified"    },
      { label: "Education",       status: "Verified"    },
      { label: "Employment",      status: "In Progress" },
      { label: "Criminal Record", status: "Pending"     },
      { label: "Address",         status: "Pending"     },
      { label: "Reference",       status: "In Progress" },
    ],
  },
  {
    initials: "AL", color: "#ef4444", name: "Aisha Levi", role: "Data Scientist",
    agency: "AuthBridge", initiatedDate: "21 May 2026", expectedDate: "28 May 2026",
    overallStatus: "Action Required",
    checks: [
      { label: "Identity",        status: "Verified"    },
      { label: "Education",       status: "Failed"      },
      { label: "Employment",      status: "Verified"    },
      { label: "Criminal Record", status: "Verified"    },
      { label: "Address",         status: "Pending"     },
      { label: "Reference",       status: "Verified"    },
    ],
  },
  {
    initials: "DS", color: "#8b5cf6", name: "Divya Sharma", role: "Product Designer",
    agency: "First Advantage", initiatedDate: "18 May 2026", expectedDate: "25 May 2026",
    overallStatus: "Clear",
    checks: [
      { label: "Identity",        status: "Verified"    },
      { label: "Education",       status: "Verified"    },
      { label: "Employment",      status: "Verified"    },
      { label: "Criminal Record", status: "Verified"    },
      { label: "Address",         status: "Verified"    },
      { label: "Reference",       status: "Verified"    },
    ],
  },
  {
    initials: "SJ", color: "#0891b2", name: "Suresh Joshi", role: "DevOps Engineer",
    agency: "KPMG BGV", initiatedDate: "22 May 2026", expectedDate: "29 May 2026",
    overallStatus: "Pending",
    checks: [
      { label: "Identity",        status: "Pending"     },
      { label: "Education",       status: "Pending"     },
      { label: "Employment",      status: "Pending"     },
      { label: "Criminal Record", status: "Pending"     },
      { label: "Address",         status: "Pending"     },
      { label: "Reference",       status: "Pending"     },
    ],
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState(initialOffers);
  // editingBand: index of the row being edited, or null
  const [editingBand, setEditingBand] = useState<number | null>(null);
  const [bandDraft, setBandDraft] = useState("");

  function startEdit(index: number) {
    setEditingBand(index);
    setBandDraft(offers[index].band);
  }

  function commitEdit(index: number) {
    const trimmed = bandDraft.trim();
    if (trimmed) {
      setOffers((prev) =>
        prev.map((o, i) => (i === index ? { ...o, band: trimmed } : o))
      );
    }
    setEditingBand(null);
  }

  function cancelEdit() {
    setEditingBand(null);
  }

  return (
    <div className="offers">
      <div className="page-header">
        <div>
          <h1 className="page-title">Offers</h1>
          <p className="page-sub">142 offers generated · 89 accepted this quarter</p>
        </div>
        <button className="btn-primary">+ Generate offer</button>
      </div>

      {/* ── Offers Table ── */}
      <div className="card">
        <div className="table-scroll">
        <table className="offers-table">
          <thead>
            <tr><th>Candidate</th><th>Role</th><th>Compensation Band</th><th>Equity</th><th>Joining Bonus</th><th>Status</th><th>Sent</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {offers.map((o, i) => (
              <tr key={o.name}>
                <td><div className="cand-cell"><div className="avatar" style={{ background: o.color }}>{o.initials}</div><span className="cand-name">{o.name}</span></div></td>
                <td className="role-cell">{o.role}</td>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>
                  {editingBand === i ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        value={bandDraft}
                        autoFocus
                        onChange={(e) => setBandDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(i);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        style={{
                          width: 140,
                          padding: "4px 8px",
                          border: "1.5px solid #9E74D0",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(158,116,208,0.2)",
                        }}
                      />
                      <button
                        onClick={() => commitEdit(i)}
                        title="Save"
                        style={{ display:"flex", alignItems:"center", justifyContent:"center", width:26, height:26, border:"none", borderRadius:6, background:"rgba(16,185,129,0.15)", color:"#10b981", cursor:"pointer" }}
                      ><Check size={13} /></button>
                      <button
                        onClick={cancelEdit}
                        title="Cancel"
                        style={{ display:"flex", alignItems:"center", justifyContent:"center", width:26, height:26, border:"none", borderRadius:6, background:"rgba(239,68,68,0.12)", color:"#ef4444", cursor:"pointer" }}
                      ><X size={13} /></button>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEdit(i)}
                      title="Click to edit"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "1.5px dashed #9E74D0",
                        background: "rgba(158,116,208,0.07)",
                      }}
                    >
                      <span>{o.band}</span>
                      <Pencil size={12} style={{ color: "#9E74D0", flexShrink: 0 }} />
                    </div>
                  )}
                </td>
                <td>{o.equity}</td>
                <td>{o.bonus}</td>
                <td><span className="status-badge" style={{ background: statusStyle[o.status].bg, color: statusStyle[o.status].text }}>{o.status}</span></td>
                <td className="date-cell">{o.sentDate}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn-outline-sm"><FileText size={12} /> View</button>
                    {o.status === "Draft" && <button className="btn-primary-sm"><Send size={12} /> Send</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* ── Hired by Role ── */}
      <div className="section-heading">
        <Users size={16} color="#9E74D0" />
        <span>Hired by Role</span>
        <span className="section-sub">This quarter · {roleStats.reduce((s, r) => s + r.hired, 0)} total hires</span>
      </div>
      <div className="role-stats-grid">
        {roleStats.map((r) => (
          <div key={r.role} className="role-stat-card">
            <div className="rs-top">
              <span className="rs-role">{r.role}</span>
              <span className="rs-count" style={{ color: r.color }}>{r.hired}<span className="rs-target">/{r.target}</span></span>
            </div>
            <div className="rs-bar-wrap">
              <div className="rs-bar" style={{ width: `${(r.hired / r.target) * 100}%`, background: r.color }} />
            </div>
            <div className="rs-label">{r.hired} hired of {r.target} target · {Math.round((r.hired / r.target) * 100)}% filled</div>
          </div>
        ))}
      </div>

      {/* ── Hired Employees Detail ── */}
      <div className="section-heading">
        <TrendingUp size={16} color="#9E74D0" />
        <span>Hired Employees</span>
        <span className="section-sub">CTC, joining date & technology stack</span>
      </div>
      <div className="card">
        <div className="table-scroll">
        <table className="hired-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role / Dept</th>
              <th><span className="th-icon"><TrendingUp size={11} /> CTC</span></th>
              <th><span className="th-icon"><Calendar size={11} /> Joining Date</span></th>
              <th>Location</th>
              <th>Reporting To</th>
              <th><span className="th-icon"><Cpu size={11} /> Technologies</span></th>
            </tr>
          </thead>
          <tbody>
            {hiredEmployees.map((e) => (
              <tr key={e.name}>
                <td>
                  <div className="cand-cell">
                    <div className="avatar" style={{ background: e.color }}>{e.initials}</div>
                    <span className="cand-name">{e.name}</span>
                  </div>
                </td>
                <td>
                  <div className="role-dept-cell">
                    <span className="role-cell">{e.role}</span>
                    <span className="dept-tag">{e.dept}</span>
                  </div>
                </td>
                <td><span className="ctc-val">{e.ctc}</span></td>
                <td><span className="joining-date">{e.joiningDate}</span></td>
                <td className="date-cell">{e.location}</td>
                <td className="date-cell">{e.reportingTo}</td>
                <td>
                  <div className="tech-tags">
                    {e.technologies.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
