"use client";
import "./CandidatesPage.css";
import { useState } from "react";
import { Search, Filter, Star, X, Briefcase, Award, TrendingUp, CheckCircle, Mail, Send } from "lucide-react";

type Candidate = {
  initials: string; color: string; name: string; role: string; score: number;
  stage: string; tags: string[]; yoe: string; email: string;
  interviewDone: boolean;
  summary: string;
  experience: { company: string; title: string; duration: string }[];
  skills: { name: string; level: number }[];
  dimensions: { label: string; score: number }[];
};

const initCandidates: Candidate[] = [
  {
    initials: "SM", color: "#8b5cf6", name: "Sarah Mitchell", role: "Senior Backend Engineer",
    score: 94, stage: "Interview", tags: ["Python","Kafka","AWS"], yoe: "8 yrs", email: "sarah.mitchell@email.com", interviewDone: false,
    summary: "Highly experienced backend engineer with deep expertise in distributed systems. Strong match on all technical dimensions — particularly system design and communication. Recommended for fast-track hiring.",
    experience: [{ company: "Stripe", title: "Staff Engineer", duration: "2021 – Present" }, { company: "Flipkart", title: "Senior Backend Engineer", duration: "2018 – 2021" }, { company: "Infosys", title: "Software Engineer", duration: "2016 – 2018" }],
    skills: [{ name: "Python", level: 95 }, { name: "Kafka", level: 90 }, { name: "AWS", level: 88 }, { name: "System Design", level: 92 }, { name: "PostgreSQL", level: 80 }],
    dimensions: [{ label: "Skills", score: 96 }, { label: "Experience", score: 94 }, { label: "Education", score: 88 }, { label: "Leadership", score: 90 }, { label: "Culture Fit", score: 92 }, { label: "Communication", score: 95 }],
  },
  {
    initials: "RK", color: "#f59e0b", name: "Rohan Kapoor", role: "Product Designer",
    score: 88, stage: "Interview", tags: ["Figma","UX Research"], yoe: "5 yrs", email: "rohan.kapoor@email.com", interviewDone: true,
    summary: "Creative product designer with a strong portfolio in B2B SaaS. Excellent UX research skills and a collaborative working style.",
    experience: [{ company: "Razorpay", title: "Senior Product Designer", duration: "2022 – Present" }, { company: "Swiggy", title: "UI/UX Designer", duration: "2019 – 2022" }],
    skills: [{ name: "Figma", level: 97 }, { name: "UX Research", level: 88 }, { name: "Prototyping", level: 85 }, { name: "Design Systems", level: 82 }, { name: "User Testing", level: 80 }],
    dimensions: [{ label: "Skills", score: 92 }, { label: "Experience", score: 86 }, { label: "Education", score: 84 }, { label: "Leadership", score: 80 }, { label: "Culture Fit", score: 90 }, { label: "Communication", score: 88 }],
  },
  {
    initials: "YT", color: "#10b981", name: "Yuki Tanaka", role: "Frontend Engineer",
    score: 81, stage: "Interview", tags: ["React","TypeScript"], yoe: "4 yrs", email: "yuki.tanaka@email.com", interviewDone: false,
    summary: "Solid frontend engineer with a focus on performance and accessibility. Good TypeScript fundamentals. Interview scheduled for today — technical round pending.",
    experience: [{ company: "Atlassian", title: "Frontend Engineer", duration: "2022 – Present" }, { company: "Zoho", title: "Junior Developer", duration: "2020 – 2022" }],
    skills: [{ name: "React", level: 90 }, { name: "TypeScript", level: 85 }, { name: "CSS/Tailwind", level: 82 }, { name: "Next.js", level: 78 }, { name: "Testing", level: 70 }],
    dimensions: [{ label: "Skills", score: 84 }, { label: "Experience", score: 80 }, { label: "Education", score: 78 }, { label: "Leadership", score: 72 }, { label: "Culture Fit", score: 85 }, { label: "Communication", score: 82 }],
  },
  {
    initials: "AL", color: "#ef4444", name: "Aisha Levi", role: "Data Scientist",
    score: 76, stage: "Interview", tags: ["Python","ML","SQL"], yoe: "3 yrs", email: "aisha.levi@email.com", interviewDone: false,
    summary: "Promising data scientist with hands-on ML project experience. Needs further evaluation on leadership and communication dimensions.",
    experience: [{ company: "Mu Sigma", title: "Data Scientist", duration: "2023 – Present" }, { company: "TCS", title: "Data Analyst", duration: "2021 – 2023" }],
    skills: [{ name: "Python", level: 88 }, { name: "Machine Learning", level: 80 }, { name: "SQL", level: 85 }, { name: "TensorFlow", level: 72 }, { name: "Data Viz", level: 75 }],
    dimensions: [{ label: "Skills", score: 82 }, { label: "Experience", score: 74 }, { label: "Education", score: 80 }, { label: "Leadership", score: 65 }, { label: "Culture Fit", score: 76 }, { label: "Communication", score: 70 }],
  },
  {
    initials: "MG", color: "#2563eb", name: "Marco Greco", role: "DevOps Engineer",
    score: 91, stage: "Interview", tags: ["Kubernetes","Terraform"], yoe: "6 yrs", email: "marco.greco@email.com", interviewDone: true,
    summary: "Highly capable DevOps engineer with strong cloud-native expertise. Excellent match on infrastructure skills.",
    experience: [{ company: "Thoughtworks", title: "Senior DevOps Engineer", duration: "2021 – Present" }, { company: "HCL", title: "DevOps Engineer", duration: "2018 – 2021" }],
    skills: [{ name: "Kubernetes", level: 94 }, { name: "Terraform", level: 90 }, { name: "AWS", level: 88 }, { name: "CI/CD", level: 92 }, { name: "Docker", level: 95 }],
    dimensions: [{ label: "Skills", score: 94 }, { label: "Experience", score: 90 }, { label: "Education", score: 85 }, { label: "Leadership", score: 88 }, { label: "Culture Fit", score: 90 }, { label: "Communication", score: 86 }],
  },
  {
    initials: "PS", color: "#0891b2", name: "Priya Sharma", role: "Product Manager",
    score: 85, stage: "Interview", tags: ["Roadmapping","Agile"], yoe: "7 yrs", email: "priya.sharma@email.com", interviewDone: false,
    summary: "Experienced product manager with a strong track record in B2C and B2B products. Final round interview scheduled with the CEO.",
    experience: [{ company: "Meesho", title: "Senior Product Manager", duration: "2020 – Present" }, { company: "OYO", title: "Product Manager", duration: "2017 – 2020" }],
    skills: [{ name: "Roadmapping", level: 90 }, { name: "Agile / Scrum", level: 88 }, { name: "Data Analysis", level: 78 }, { name: "Stakeholder Mgmt", level: 85 }, { name: "User Research", level: 80 }],
    dimensions: [{ label: "Skills", score: 88 }, { label: "Experience", score: 86 }, { label: "Education", score: 82 }, { label: "Leadership", score: 84 }, { label: "Culture Fit", score: 88 }, { label: "Communication", score: 90 }],
  },
];

type EmailModal = { candidate: Candidate; subject: string; body: string } | null;

function ScoreRing({ score }: { score: number }) {
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#ddeeff" strokeWidth="8" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="url(#grad)" strokeWidth="8"
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
        transform="rotate(-90 45 45)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#80B2FF" /><stop offset="100%" stopColor="#9E74D0" />
        </linearGradient>
      </defs>
      <text x="45" y="49" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1a2a40">{score}%</text>
    </svg>
  );
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initCandidates);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [emailModal, setEmailModal] = useState<EmailModal>(null);
  const [sent, setSent] = useState(false);
  const [search, setSearch] = useState("");

  const doneCount = candidates.filter(c => c.interviewDone).length;

  function toggleDone(name: string) {
    setCandidates(prev => prev.map(c => c.name === name ? { ...c, interviewDone: !c.interviewDone } : c));
    if (selected?.name === name) setSelected(prev => prev ? { ...prev, interviewDone: !prev.interviewDone } : null);
  }

  function openEmail(c: Candidate) {
    setEmailModal({
      candidate: c,
      subject: `Interview Schedule - ${c.role} at SprintPark`,
      body: `Hi ${c.name.split(" ")[0]},\n\nWe are pleased to inform you that you have been shortlisted for the ${c.role} position at SprintPark. We would like to schedule an interview with you.\n\nInterview Details:\n• Round: Technical Interview\n• Duration: 60 minutes\n• Mode: Video Call (Google Meet / Zoom)\n• Proposed Date: Please confirm your availability for the slots below\n\nAvailable Slots:\n  - Monday, 26 May 2026 at 10:00 AM IST\n  - Tuesday, 27 May 2026 at 2:00 PM IST\n  - Wednesday, 28 May 2026 at 11:00 AM IST\n\nPlease reply with your preferred slot or suggest an alternative time that works for you.\n\nBest regards,\nPriya R.\nTalent Acquisition | SprintPark\npriya.r@sprintpark.ai`,
    });
    setSent(false);
  }

  function handleSend() { setSent(true); setTimeout(() => setEmailModal(null), 1500); }

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="candidates">
      <div className="page-header">
        <div>
          <h1 className="page-title">Candidates — Interview Stage</h1>
          <p className="page-sub">{candidates.length} in interview · {doneCount} done · {candidates.length - doneCount} pending</p>
        </div>
        <button className="btn-primary">+ Add candidate</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={14} color="#7a9abf" />
          <input placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-outline"><Filter size={13} /> Filter</button>
        <div className="interview-legend">
          <span className="legend-done">✓ Done ({doneCount})</span>
          <span className="legend-pending">○ Pending ({candidates.length - doneCount})</span>
        </div>
      </div>

      <div className={`cand-layout ${selected ? "panel-open" : ""}`}>
        <div className="card">
          <div className="table-scroll">
          <table className="cand-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th>AI Score</th>
                <th>Stage</th>
                <th>Tags</th>
                <th>Interview Done</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name} className={`${selected?.name === c.name ? "row-active" : ""} ${c.interviewDone ? "row-done" : ""}`}>
                  <td>
                    <div className="cand-name-cell">
                      <div className="avatar" style={{ background: c.color }}>{c.initials}</div>
                      <div>
                        <div className="cand-name cand-name-link" onClick={() => setSelected(c)}>{c.name}</div>
                        <div className="cand-yoe">{c.yoe} experience</div>
                      </div>
                    </div>
                  </td>
                  <td className="cand-role">{c.role}</td>
                  <td>
                    <div className="score-cell">
                      <Star size={12} color="#f59e0b" fill="#f59e0b" />
                      <span className="score-val">{c.score}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="stage-badge interview-stage">Interview</span>
                  </td>
                  <td><div className="tags">{c.tags.map(t => <span key={t} className="tag">{t}</span>)}</div></td>
                  <td>
                    <label className="interview-check">
                      <input type="checkbox" checked={c.interviewDone} onChange={() => toggleDone(c.name)} />
                      <span className={`check-label ${c.interviewDone ? "done" : "pending"}`}>
                        {c.interviewDone ? "✓ Done" : "○ Pending"}
                      </span>
                    </label>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-email" onClick={() => openEmail(c)}>
                        <Mail size={13} /> Email
                      </button>
                      <button className="btn-outline-sm" onClick={() => setSelected(c)}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="detail-panel">
            <div className="panel-header">
              <div className="panel-avatar" style={{ background: selected.color }}>{selected.initials}</div>
              <div className="panel-title-block">
                <h2 className="panel-name">{selected.name}</h2>
                <p className="panel-role">{selected.role}</p>
                <span className="stage-badge interview-stage">Interview</span>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>

            <div className="panel-score-row">
              <ScoreRing score={selected.score} />
              <div className="panel-score-info">
                <div className="panel-score-label">AI Match Score</div>
                <div className="panel-score-sub">{selected.yoe} experience · {selected.tags.length} key skills matched</div>
                <div className={`panel-score-verdict ${selected.score >= 85 ? "strong" : selected.score >= 75 ? "good" : "fair"}`}>
                  {selected.score >= 85 ? "✓ Strong Match" : selected.score >= 75 ? "✓ Good Match" : "~ Fair Match"}
                </div>
              </div>
            </div>

            {/* Interview status in panel */}
            <div className="panel-interview-row">
              <span className="panel-int-label">Interview Status</span>
              <label className="interview-check">
                <input type="checkbox" checked={selected.interviewDone} onChange={() => toggleDone(selected.name)} />
                <span className={`check-label ${selected.interviewDone ? "done" : "pending"}`}>
                  {selected.interviewDone ? "✓ Interview Done" : "○ Interview Pending"}
                </span>
              </label>
              <button className="btn-email" style={{ marginLeft: "auto" }} onClick={() => openEmail(selected)}>
                <Mail size={13} /> Send Email
              </button>
            </div>

            <div className="panel-section">
              <div className="panel-section-title"><Award size={14} /> AI Summary</div>
              <p className="panel-summary">{selected.summary}</p>
            </div>
            <div className="panel-section">
              <div className="panel-section-title"><TrendingUp size={14} /> Match Dimensions</div>
              <div className="dimensions">
                {selected.dimensions.map((d) => (
                  <div key={d.label} className="dim-row">
                    <span className="dim-label">{d.label}</span>
                    <div className="dim-bar-wrap"><div className="dim-bar" style={{ width: `${d.score}%` }} /></div>
                    <span className="dim-score">{d.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-section">
              <div className="panel-section-title"><CheckCircle size={14} /> Skills</div>
              <div className="skill-list">
                {selected.skills.map((s) => (
                  <div key={s.name} className="skill-row">
                    <span className="skill-name">{s.name}</span>
                    <div className="skill-bar-wrap"><div className="skill-bar" style={{ width: `${s.level}%` }} /></div>
                    <span className="skill-pct">{s.level}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-section">
              <div className="panel-section-title"><Briefcase size={14} /> Work Experience</div>
              <div className="exp-list">
                {selected.experience.map((e) => (
                  <div key={e.company} className="exp-row">
                    <div className="exp-dot" />
                    <div><div className="exp-title">{e.title}</div><div className="exp-company">{e.company} · {e.duration}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn-outline-sm">Reject</button>
              <button className="btn-email" onClick={() => openEmail(selected)}><Mail size={13} /> Email</button>
              <button className="btn-primary">Schedule Interview</button>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div className="modal-overlay" onClick={() => setEmailModal(null)}>
          <div className="email-modal" onClick={e => e.stopPropagation()}>
            <div className="email-modal-header">
              <div className="email-modal-title"><Mail size={16} color="#7a52b0" /><span>Send Interview Email to {emailModal.candidate.name}</span></div>
              <button className="close-btn" onClick={() => setEmailModal(null)}><X size={18} /></button>
            </div>
            <div className="email-modal-body">
              <div className="email-to-row">
                <span className="email-field-label">To</span>
                <span className="email-to-value">{emailModal.candidate.email}</span>
              </div>
              <div className="email-form-group">
                <label className="email-field-label">Subject</label>
                <input className="email-input" value={emailModal.subject} onChange={e => setEmailModal({ ...emailModal, subject: e.target.value })} />
              </div>
              <div className="email-form-group">
                <label className="email-field-label">Message</label>
                <textarea className="email-textarea" rows={9} value={emailModal.body} onChange={e => setEmailModal({ ...emailModal, body: e.target.value })} />
              </div>
            </div>
            <div className="email-modal-footer">
              <button className="btn-outline" onClick={() => setEmailModal(null)}>Cancel</button>
              <button className={`btn-send ${sent ? "sent" : ""}`} onClick={handleSend}>
                {sent ? "✓ Sent!" : <><Send size={14} /> Send Email</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
