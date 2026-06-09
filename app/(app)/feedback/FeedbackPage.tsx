"use client";
import "./FeedbackPage.css";
import { useState } from "react";
import { Star, X, MessageSquare, CheckCircle, Circle, Clock, User } from "lucide-react";

type RoundStatus = "completed" | "pending" | "scheduled" | "na";
type Rec = "Strong Hire" | "Hire" | "Hold" | "No Hire" | "—";

type SkillRating = { skill: string; score: number };

type RoundData = {
  status: RoundStatus;
  interviewer: string;
  interviewerInitials: string;
  date: string;
  rating: number;
  recommendation: Rec;
  summary: string;
  skills: SkillRating[];
  strengths: string[];
  improvements: string[];
};

type CandidateFeedback = {
  id: number;
  candidate: string;
  initials: string;
  avatarColor: string;
  role: string;
  interviewDate: string;
  overallRating: number;
  overallRecommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire";
  managerApprovalStatus: "pending" | "approved";
  round1: RoundData;
  round2: RoundData;
  managerialRound: RoundData;
  hrRound: RoundData;
};

function mkRound(
  status: RoundStatus, interviewer: string, initials: string, date: string,
  rating: number, rec: Rec, summary: string,
  skills: SkillRating[], strengths: string[], improvements: string[]
): RoundData {
  return { status, interviewer, interviewerInitials: initials, date, rating, recommendation: rec, summary, skills, strengths, improvements };
}

const feedbackData: CandidateFeedback[] = [
  {
    id: 1, candidate: "Yuki Tanaka", initials: "YT", avatarColor: "#B875A0",
    role: "Frontend Engineer", interviewDate: "22 May 2026",
    overallRating: 4.5, overallRecommendation: "Strong Hire", managerApprovalStatus: "pending",
    round1: mkRound("completed","Priya R.","PR","22 May 2026",4.5,"Strong Hire",
      "Exceptional React proficiency. Clean code, strong accessibility knowledge. Proactive in trade-off discussions throughout the session.",
      [{skill:"React / JS",score:5},{skill:"CSS & Layout",score:5},{skill:"Problem Solving",score:4},{skill:"Communication",score:5},{skill:"Testing",score:3}],
      ["Deep React hooks knowledge","Strong CSS architecture"],["Backend integration depth","Testing coverage"]),
    round2: mkRound("completed","Arjun K.","AK","24 May 2026",4.0,"Hire",
      "Good micro-frontend design approach. Clear reasoning on component decomposition. Some gaps in large-scale state management.",
      [{skill:"System Design",score:4},{skill:"Scalability",score:4},{skill:"State Management",score:3},{skill:"Communication",score:4},{skill:"Trade-off Analysis",score:4}],
      ["Clear component decomposition","Good trade-off analysis"],["Large-scale state management","SSR/SSG trade-offs"]),
    managerialRound: mkRound("scheduled","CEO","CE","28 May 2026",0,"—","Scheduled — pending feedback.",[],[],[]),
    hrRound: mkRound("pending","Sneha M.","SM","TBD",0,"—","Pending after managerial round.",[],[],[]),
  },
  {
    id: 2, candidate: "Sarah Mitchell", initials: "SM", avatarColor: "#8A6AAE",
    role: "Senior Backend Engineer", interviewDate: "20 May 2026",
    overallRating: 4.0, overallRecommendation: "Hire", managerApprovalStatus: "pending",
    round1: mkRound("completed","Arjun K.","AK","20 May 2026",4.0,"Hire",
      "Strong Kafka and distributed systems knowledge. Solved all coding problems correctly. Minor gaps in database sharding.",
      [{skill:"Coding",score:4},{skill:"Kafka / Queues",score:5},{skill:"Distributed Systems",score:4},{skill:"Database Design",score:3},{skill:"Communication",score:4}],
      ["Distributed systems fundamentals","Clean code"],["Database sharding","Observability depth"]),
    round2: mkRound("completed","Priya R.","PR","22 May 2026",4.5,"Strong Hire",
      "Best system design this quarter. Clear CAP theorem understanding. Designed scalable notification service.",
      [{skill:"System Design",score:5},{skill:"CAP Theorem",score:5},{skill:"API Design",score:4},{skill:"Scalability",score:5},{skill:"Communication",score:4}],
      ["Excellent trade-off analysis","Strong CAP theorem"],["Cost optimisation","Monitoring tooling"]),
    managerialRound: mkRound("completed","Rahul D.","RD","23 May 2026",4.0,"Hire",
      "Strong leadership examples. Aligned on team culture and growth expectations.",
      [{skill:"Leadership",score:4},{skill:"Team Collaboration",score:4},{skill:"Conflict Resolution",score:4},{skill:"Ownership",score:3},{skill:"Vision",score:4}],
      ["Cross-functional collaboration","Engineering leadership"],["Structured ownership examples"]),
    hrRound: mkRound("completed","Sneha M.","SM","24 May 2026",3.5,"Hire",
      "Strong values alignment. Salary within band. Flexible joining date.",
      [{skill:"Culture Fit",score:4},{skill:"Communication",score:4},{skill:"Motivation",score:4},{skill:"Flexibility",score:5},{skill:"Long-term Fit",score:3}],
      ["Cultural alignment","Long-term vision"],["Leadership articulation"]),
  },
  {
    id: 3, candidate: "Marco Greco", initials: "MG", avatarColor: "#9870C8",
    role: "DevOps Engineer", interviewDate: "30 May 2026",
    overallRating: 3.0, overallRecommendation: "Hold", managerApprovalStatus: "pending",
    round1: mkRound("scheduled","Sneha M.","SM","30 May 2026",0,"—","Round 1 scheduled.",[],[],[]),
    round2: mkRound("pending","Rahul D.","RD","TBD",0,"—","Pending scheduling.",[],[],[]),
    managerialRound: mkRound("pending","CEO","CE","TBD",0,"—","On hold.",[],[],[]),
    hrRound: mkRound("na","—","—","—",0,"—","",[],[],[]),
  },
  {
    id: 4, candidate: "Aisha Levi", initials: "AL", avatarColor: "#C078B0",
    role: "Data Scientist", interviewDate: "20 May 2026",
    overallRating: 4.8, overallRecommendation: "Strong Hire", managerApprovalStatus: "pending",
    round1: mkRound("completed","Rahul D.","RD","20 May 2026",5.0,"Strong Hire",
      "Outstanding ML pipeline presentation. End-to-end ML design from ingestion to monitoring. Best candidate this quarter.",
      [{skill:"Machine Learning",score:5},{skill:"Statistics",score:5},{skill:"Python / SQL",score:5},{skill:"MLOps",score:4},{skill:"Communication",score:5}],
      ["Exceptional ML design","Strong statistical intuition"],["Real-time inference depth"]),
    round2: mkRound("completed","Arjun K.","AK","22 May 2026",4.5,"Strong Hire",
      "Fluent Python/SQL. Handled Bayesian vs frequentist well. Impressive MLOps and A/B testing awareness.",
      [{skill:"Python",score:5},{skill:"SQL",score:5},{skill:"Experiment Design",score:4},{skill:"Feature Engineering",score:4},{skill:"Deployment",score:4}],
      ["Fluent Python and SQL","Strong MLOps"],["Streaming data pipelines"]),
    managerialRound: mkRound("completed","Priya R.","PR","24 May 2026",4.5,"Strong Hire",
      "Strong ownership mentality. Excellent analytical communication with non-technical stakeholders.",
      [{skill:"Ownership",score:5},{skill:"Communication",score:5},{skill:"Problem Framing",score:4},{skill:"Stakeholder Mgmt",score:4},{skill:"Ambiguity Handling",score:4}],
      ["Strong ownership","Analytical communication"],["Stakeholder management scale"]),
    hrRound: mkRound("completed","Sneha M.","SM","25 May 2026",4.0,"Strong Hire",
      "Excellent culture fit. Salary in range. Ready to join within 2 weeks.",
      [{skill:"Culture Fit",score:5},{skill:"Motivation",score:5},{skill:"Flexibility",score:5},{skill:"Communication",score:4},{skill:"Long-term Fit",score:4}],
      ["Strong culture fit","Quick joining"],["None significant"]),
  },
  {
    id: 5, candidate: "Priya Sharma", initials: "PS", avatarColor: "#A898D8",
    role: "Product Manager", interviewDate: "19 May 2026",
    overallRating: 3.5, overallRecommendation: "Hire", managerApprovalStatus: "pending",
    round1: mkRound("completed","Sneha M.","SM","19 May 2026",3.5,"Hire",
      "Good product mindset with concrete alignment examples. Some hesitation on ambiguous prioritisation scenarios.",
      [{skill:"Product Sense",score:4},{skill:"Prioritisation",score:3},{skill:"Stakeholder Mgmt",score:4},{skill:"Data Thinking",score:3},{skill:"Communication",score:4}],
      ["Strong stakeholder management","User-centric thinking"],["Ambiguous trade-offs","Technical constraints"]),
    round2: mkRound("completed","Arjun K.","AK","20 May 2026",3.5,"Hire",
      "Good prioritisation framework. Handled feature trade-offs well. Lacked depth in metric definition.",
      [{skill:"Roadmapping",score:4},{skill:"Metrics",score:3},{skill:"User Research",score:3},{skill:"Execution",score:4},{skill:"Communication",score:4}],
      ["Good prioritisation","Clear user empathy"],["Metric definition","Technical feasibility"]),
    managerialRound: mkRound("scheduled","CEO","CE","29 May 2026",0,"—","Scheduled.",[],[],[]),
    hrRound: mkRound("pending","Sneha M.","SM","TBD",0,"—","Pending.",[],[],[]),
  },
];

const ROUND_COLS: { key: keyof CandidateFeedback; label: string }[] = [
  { key: "round1",          label: "Round 1" },
  { key: "round2",          label: "Round 2" },
  { key: "managerialRound", label: "Managerial" },
  { key: "hrRound",         label: "HR Round" },
];

const recStyle: Record<string, { bg: string; color: string; dot: string }> = {
  "Strong Hire": { bg: "rgba(122,184,216,0.15)", color: "#3A70A0", dot: "#7AB8D8" },
  "Hire":        { bg: "rgba(168,152,216,0.15)", color: "#5A4878", dot: "#A898D8" },
  "Hold":        { bg: "rgba(238,208,90,0.2)",   color: "#7A5A10", dot: "#EED860" },
  "No Hire":     { bg: "rgba(184,117,160,0.15)", color: "#8A4A78", dot: "#B875A0" },
  "—":           { bg: "rgba(200,190,220,0.2)",  color: "#888",    dot: "#C8B8D8" },
};

const statusMeta: Record<RoundStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", cls: "st-done",      icon: <CheckCircle size={12} /> },
  scheduled: { label: "Scheduled", cls: "st-scheduled", icon: <Clock size={12} /> },
  pending:   { label: "Pending",   cls: "st-pending",   icon: <Circle size={12} /> },
  na:        { label: "N/A",       cls: "st-na",        icon: <Circle size={12} /> },
};

function MiniStars({ score, size = 11 }: { score: number; size?: number }) {
  if (!score) return <span className="no-score">—</span>;
  return (
    <span className="mini-stars">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} style={{
          color: s <= Math.round(score) ? "#B875A0" : "#E0D0E8",
          fill:  s <= Math.round(score) ? "#B875A0" : "none",
        }} />
      ))}
      <span className="mini-score">{score}</span>
    </span>
  );
}

function RecBadge({ rec }: { rec: string }) {
  const s = recStyle[rec] ?? recStyle["—"];
  return (
    <span className="rec-badge" style={{ background: s.bg, color: s.color }}>
      <span className="rec-dot" style={{ background: s.dot }} />{rec}
    </span>
  );
}

function SkillBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4.5 ? "#7AB8D8" : score >= 3.5 ? "#A898D8" : score >= 2.5 ? "#B875A0" : "#E0D0E8";
  return (
    <div className="skill-bar-track">
      <div className="skill-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

/* ── Round cell in table ─────────────────────────────── */
function RoundCell({ round, onView }: { round: RoundData; onView: () => void }) {
  if (round.status === "na") return <div className="rc-na">—</div>;
  const sm = statusMeta[round.status];
  return (
    <div className="rc-cell">
      <span className={`rc-status ${sm.cls}`}>{sm.icon}{sm.label}</span>
      <MiniStars score={round.rating} />
      {round.status === "completed"
        ? <button className="btn-view" onClick={onView}><MessageSquare size={11} /> View Feedback</button>
        : <span className="rc-note">{round.status === "scheduled" ? `Sched. · ${round.date}` : "Awaiting"}</span>}
    </div>
  );
}

/* ── Feedback Modal ──────────────────────────────────── */
function FeedbackModal({ round, colLabel, candidate, onClose }: {
  round: RoundData; colLabel: string; candidate: CandidateFeedback; onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-modal" onClick={e => e.stopPropagation()}>
        <div className="fb-modal-hd">
          <div className="fb-modal-hd-left">
            <div className="fb-avatar" style={{ background: candidate.avatarColor }}>{candidate.initials}</div>
            <div>
              <div className="fb-modal-title">{candidate.candidate} — {colLabel}</div>
              <div className="fb-modal-sub">{candidate.role} · {round.interviewer} · {round.date}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="fb-modal-body">
          {/* Overall */}
          <div className="fm-overview">
            <div className="fm-ov-block">
              <div className="fm-ov-label">Rating</div>
              <div className="fm-ov-big">{round.rating || "—"}</div>
              <MiniStars score={round.rating} size={15} />
            </div>
            <div className="fm-ov-block">
              <div className="fm-ov-label">Recommendation</div>
              <RecBadge rec={round.recommendation} />
            </div>
            <div className="fm-ov-block">
              <div className="fm-ov-label">Interviewer</div>
              <div className="fm-chip">
                <div className="fm-chip-avatar">{round.interviewerInitials}</div>
                <span>{round.interviewer}</span>
              </div>
            </div>
          </div>
          {/* Summary */}
          <div className="fm-section">
            <div className="fm-section-title">Interview Summary</div>
            <p className="fm-summary">{round.summary}</p>
          </div>
          {/* Skills */}
          {round.skills.length > 0 && (
            <div className="fm-section">
              <div className="fm-section-title">Skill Ratings</div>
              <div className="fm-skills">
                {round.skills.map(sk => (
                  <div key={sk.skill} className="fm-skill-row">
                    <div className="fm-skill-top">
                      <span className="fm-skill-name">{sk.skill}</span>
                      <span className="fm-skill-score">{sk.score}/5</span>
                    </div>
                    <SkillBar score={sk.score} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Strengths & Improvements */}
          {(round.strengths.length > 0 || round.improvements.length > 0) && (
            <div className="fm-two-col">
              {round.strengths.length > 0 && (
                <div className="fm-section">
                  <div className="fm-section-title">Strengths</div>
                  <ul className="fm-list">
                    {round.strengths.map(s => <li key={s} className="fm-good">{s}</li>)}
                  </ul>
                </div>
              )}
              {round.improvements.length > 0 && (
                <div className="fm-section">
                  <div className="fm-section-title">Areas to Improve</div>
                  <ul className="fm-list">
                    {round.improvements.map(s => <li key={s} className="fm-improve">{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Approval Summary Modal ──────────────────────────── */
function ApprovalModal({ f, onClose, onSend, sending, sent }: {
  f: CandidateFeedback; onClose: () => void;
  onSend: () => void; sending: boolean; sent: boolean;
}) {
  const allSkills: Record<string, number[]> = {};
  ROUND_COLS.forEach(col => {
    const r = f[col.key] as RoundData;
    if (r.status !== "completed") return;
    r.skills.forEach(sk => {
      if (!allSkills[sk.skill]) allSkills[sk.skill] = [];
      allSkills[sk.skill].push(sk.score);
    });
  });
  const aggSkills = Object.entries(allSkills)
    .map(([skill, scores]) => ({ skill, avg: Math.round((scores.reduce((a,b)=>a+b,0)/scores.length)*10)/10 }))
    .sort((a,b) => b.avg - a.avg);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-modal fb-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="fb-modal-hd">
          <div className="fb-modal-hd-left">
            <div className="fb-avatar" style={{ background: f.avatarColor }}>{f.initials}</div>
            <div>
              <div className="fb-modal-title">{f.candidate} — Full Interview Summary</div>
              <div className="fb-modal-sub">{f.role} · For Manager Approval</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="fb-modal-body">
          {/* Verdict */}
          <div className="fm-overview">
            <div className="fm-ov-block">
              <div className="fm-ov-label">Overall Rating</div>
              <div className="fm-ov-big">{f.overallRating}</div>
              <MiniStars score={f.overallRating} size={14} />
            </div>
            <div className="fm-ov-block">
              <div className="fm-ov-label">Recommendation</div>
              <RecBadge rec={f.overallRecommendation} />
            </div>
          </div>
          {/* Aggregated skills */}
          {aggSkills.length > 0 && (
            <div className="fm-section">
              <div className="fm-section-title">Overall Skill Ratings (avg across all rounds)</div>
              <div className="fm-skills">
                {aggSkills.map(sk => (
                  <div key={sk.skill} className="fm-skill-row">
                    <div className="fm-skill-top">
                      <span className="fm-skill-name">{sk.skill}</span>
                      <span className="fm-skill-score">{sk.avg}/5</span>
                    </div>
                    <SkillBar score={sk.avg} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Per-round summaries */}
          <div className="fm-section">
            <div className="fm-section-title">Round-by-Round Summary</div>
            {ROUND_COLS.map(col => {
              const r = f[col.key] as RoundData;
              if (r.status === "na" || r.status === "pending") return null;
              const sm = statusMeta[r.status];
              return (
                <div key={col.key as string} className="fm-round-block">
                  <div className="fm-round-head">
                    <span className={`rc-status ${sm.cls}`} style={{ cursor: "default" }}>{sm.icon}{col.label}</span>
                    <div className="fm-round-meta">
                      <span className="fm-round-int">{r.interviewer} · {r.date}</span>
                      {r.status === "completed" && <MiniStars score={r.rating} />}
                      {r.recommendation !== "—" && <RecBadge rec={r.recommendation} />}
                    </div>
                  </div>
                  {r.status === "completed" && (
                    <>
                      <p className="fm-round-summary">{r.summary}</p>
                      {r.skills.length > 0 && (
                        <div className="fm-skill-chips">
                          {r.skills.map(sk => (
                            <span key={sk.skill} className="fm-skill-chip" style={{
                              background: sk.score >= 4 ? "rgba(122,184,216,0.15)" : sk.score >= 3 ? "rgba(168,152,216,0.15)" : "rgba(184,117,160,0.12)",
                              color: sk.score >= 4 ? "#3A70A0" : sk.score >= 3 ? "#5A4878" : "#8A4A78",
                            }}>
                              {sk.skill} <strong>{sk.score}/5</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {r.status === "scheduled" && <p className="fm-round-pending">Scheduled for {r.date} — feedback pending.</p>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="fb-modal-ft">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className={`btn-send ${sent ? "sent" : ""}`} onClick={onSend} disabled={sending || sent}>
            {sent    ? <><CheckCircle size={13} /> Approved &amp; Sent!</>
             : sending ? <><span className="spin" /> Sending...</>
             : <><MessageSquare size={13} /> Approve &amp; Send Summary</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function FeedbackPage() {
  const [roundFilter,    setRoundFilter]    = useState("All Rounds");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [jobFilter,      setJobFilter]      = useState("All Roles");
  const [dateFilter,     setDateFilter]     = useState("Any Date");
  const [modal,    setModal]    = useState<{ f: CandidateFeedback; round: RoundData; label: string } | null>(null);
  const [approval, setApproval] = useState<CandidateFeedback | null>(null);
  const [approvalState, setApprovalState] = useState<Record<number, "pending" | "approved">>(
    () => Object.fromEntries(feedbackData.map(f => [f.id, f.managerApprovalStatus]))
  );
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentId,    setSentId]    = useState<number | null>(null);

  const allRoles    = ["All Roles", ...Array.from(new Set(feedbackData.map(f => f.role))).sort()];
  const dateBuckets = ["Any Date","Last 7 days","Last 14 days","Last 30 days"];
  const today       = new Date(2026, 5, 9);

  function parseDate(d: string) {
    const months: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
    const [day, mon, yr] = d.split(" ");
    const m = months[mon]; if (m === undefined) return null;
    return new Date(parseInt(yr), m, parseInt(day));
  }

  const filtered = feedbackData.filter(f => {
    const appr = approvalState[f.id] ?? "pending";
    if (approvalFilter === "Pending" && appr !== "pending")  return false;
    if (approvalFilter === "Sent"    && appr !== "approved") return false;
    if (roundFilter === "Round 1"          && f.round1.status          !== "completed") return false;
    if (roundFilter === "Round 2"          && f.round2.status          !== "completed") return false;
    if (roundFilter === "Managerial Round" && f.managerialRound.status !== "completed") return false;
    if (roundFilter === "HR Round"         && f.hrRound.status         !== "completed") return false;
    if (jobFilter !== "All Roles" && f.role !== jobFilter) return false;
    if (dateFilter !== "Any Date") {
      const d = parseDate(f.interviewDate); if (!d) return false;
      const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (dateFilter === "Last 7 days"  && diff > 7)  return false;
      if (dateFilter === "Last 14 days" && diff > 14) return false;
      if (dateFilter === "Last 30 days" && diff > 30) return false;
    }
    return true;
  });

  const anyFilter = roundFilter !== "All Rounds" || approvalFilter !== "All" ||
                    jobFilter !== "All Roles" || dateFilter !== "Any Date";

  function handleSend(f: CandidateFeedback) {
    setSendingId(f.id);
    setTimeout(() => {
      setApprovalState(p => ({ ...p, [f.id]: "approved" }));
      setSendingId(null); setSentId(f.id);
      setTimeout(() => { setSentId(null); setApproval(null); }, 1800);
    }, 1200);
  }

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interview Feedback</h1>
          <p className="page-sub">
            {feedbackData.length} candidates &middot; {feedbackData.filter(f => f.overallRecommendation === "Strong Hire").length} strong hires &middot; avg {(feedbackData.reduce((s,f) => s+f.overallRating,0)/feedbackData.length).toFixed(1)}/5
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="fb-filters">
        <select className="fb-select" value={roundFilter}    onChange={e => setRoundFilter(e.target.value)}>
          <option value="All Rounds">All Rounds</option>
          <option value="Round 1">Round 1</option>
          <option value="Round 2">Round 2</option>
          <option value="Managerial Round">Managerial</option>
          <option value="HR Round">HR Round</option>
        </select>
        <select className="fb-select" value={jobFilter}      onChange={e => setJobFilter(e.target.value)}>
          {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="fb-select" value={dateFilter}     onChange={e => setDateFilter(e.target.value)}>
          {dateBuckets.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="fb-select" value={approvalFilter} onChange={e => setApprovalFilter(e.target.value)}>
          <option value="All">All Approvals</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
        </select>
        <span className="fb-count">{filtered.length} of {feedbackData.length}</span>
        {anyFilter && <button className="fb-clear" onClick={() => { setRoundFilter("All Rounds"); setApprovalFilter("All"); setJobFilter("All Roles"); setDateFilter("Any Date"); }}>Clear</button>}
      </div>

      {/* Table */}
      <div className="fb-table-wrap">
        <div className="fb-scroll">
          {/* Header */}
          <div className="fb-head">
            <div className="fbc fbc-cand">Candidate</div>
            <div className="fbc fbc-int">Interviewer</div>
            {ROUND_COLS.map(c => (
              <div key={c.key as string} className="fbc fbc-round">{c.label}</div>
            ))}
            <div className="fbc fbc-appr">Manager Approval</div>
          </div>

          {filtered.length === 0 && (
            <div className="fb-empty">No candidates match the selected filters.</div>
          )}

          {filtered.map(f => {
            const appr = approvalState[f.id] ?? "pending";
            return (
              <div key={f.id} className="fb-row">
                {/* Candidate */}
                <div className="fbc fbc-cand">
                  <div className="cand-av" style={{ background: f.avatarColor }}>{f.initials}</div>
                  <div>
                    <div className="cand-name">{f.candidate}</div>
                    <div className="cand-role">{f.role}</div>
                    <MiniStars score={f.overallRating} />
                    <RecBadge rec={f.overallRecommendation} />
                  </div>
                </div>
                {/* Primary interviewer */}
                <div className="fbc fbc-int">
                  <div className="int-row">
                    <div className="int-av">{f.round1.interviewerInitials}</div>
                    <div>
                      <div className="int-name">{f.round1.interviewer}</div>
                      <div className="int-date">{f.round1.date}</div>
                    </div>
                  </div>
                </div>
                {/* Round columns */}
                {ROUND_COLS.map(col => (
                  <div key={col.key as string} className="fbc fbc-round">
                    <RoundCell
                      round={f[col.key] as RoundData}
                      onView={() => setModal({ f, round: f[col.key] as RoundData, label: col.label })}
                    />
                  </div>
                ))}
                {/* Approval */}
                <div className="fbc fbc-appr">
                  {appr === "approved"
                    ? <div className="appr-sent"><CheckCircle size={14} color="#3A70A0" /><span>Summary Sent</span></div>
                    : <button className="btn-approve" onClick={() => setApproval(f)}><MessageSquare size={11} /> Review &amp; Approve</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modal && (
        <FeedbackModal round={modal.round} colLabel={modal.label} candidate={modal.f} onClose={() => setModal(null)} />
      )}
      {approval && (
        <ApprovalModal
          f={approval}
          onClose={() => setApproval(null)}
          onSend={() => handleSend(approval)}
          sending={sendingId === approval.id}
          sent={sentId === approval.id}
        />
      )}
    </div>
  );
}
