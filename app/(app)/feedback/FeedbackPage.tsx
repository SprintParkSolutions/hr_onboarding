"use client";
import "./FeedbackPage.css";
import { useState, useMemo } from "react";
import { Star, X, MessageSquare, CheckCircle, Circle, Clock } from "lucide-react";
import { useInterviewStore, type Candidate, type Round, type RoundStatus as InterviewRoundStatus } from "@/lib/interviewStore";

/* ── Types ──────────────────────────────────────────────── */
type FeedbackStatus = "completed" | "pending" | "scheduled" | "na";
type Rec = "Strong Hire" | "Hire" | "Hold" | "No Hire" | "—";

type SkillRating = { skill: string; score: number };

type RoundFeedback = {
  status: FeedbackStatus;
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

/* Map interview round status → feedback status */
function toFbStatus(s: InterviewRoundStatus): FeedbackStatus {
  if (s === "passed") return "completed";
  if (s === "active") return "scheduled";
  if (s === "failed") return "completed";
  return "pending";
}

/* Build a default RoundFeedback from an interview Round */
function defaultFeedback(r: Round): RoundFeedback {
  return {
    status: toFbStatus(r.status),
    interviewer: r.interviewer,
    interviewerInitials: r.interviewer.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(),
    date: r.date,
    rating: 0,
    recommendation: "—",
    summary: r.status === "active" ? `Scheduled — pending feedback.` : r.status === "pending" ? "Pending scheduling." : "",
    skills: [],
    strengths: [],
    improvements: [],
  };
}

/* ── Pre-seeded rich feedback keyed by candidateId → roundNo ── */
const richFeedback: Record<number, Record<number, Partial<RoundFeedback>>> = {
  1: { // Yuki Tanaka
    1: { status:"completed", rating:4.5, recommendation:"Strong Hire",
         summary:"Exceptional React proficiency. Clean code, strong accessibility knowledge. Proactive in trade-off discussions.",
         skills:[{skill:"React / JS",score:5},{skill:"CSS & Layout",score:5},{skill:"Problem Solving",score:4},{skill:"Communication",score:5},{skill:"Testing",score:3}],
         strengths:["Deep React hooks knowledge","Strong CSS architecture"], improvements:["Backend integration depth","Testing coverage"] },
    2: { status:"completed", rating:4.0, recommendation:"Hire",
         summary:"Good micro-frontend design approach. Clear reasoning on component decomposition.",
         skills:[{skill:"System Design",score:4},{skill:"Scalability",score:4},{skill:"State Management",score:3},{skill:"Communication",score:4},{skill:"Trade-off Analysis",score:4}],
         strengths:["Clear component decomposition","Good trade-off analysis"], improvements:["Large-scale state management","SSR/SSG trade-offs"] },
  },
  2: { // Sarah Mitchell
    1: { status:"completed", rating:4.0, recommendation:"Hire",
         summary:"Strong Kafka and distributed systems knowledge. Solved all coding problems correctly.",
         skills:[{skill:"Coding",score:4},{skill:"Kafka / Queues",score:5},{skill:"Distributed Systems",score:4},{skill:"Database Design",score:3},{skill:"Communication",score:4}],
         strengths:["Distributed systems fundamentals","Clean code"], improvements:["Database sharding","Observability depth"] },
    2: { status:"completed", rating:4.5, recommendation:"Strong Hire",
         summary:"Best system design this quarter. Clear CAP theorem understanding.",
         skills:[{skill:"System Design",score:5},{skill:"CAP Theorem",score:5},{skill:"API Design",score:4},{skill:"Scalability",score:5},{skill:"Communication",score:4}],
         strengths:["Excellent trade-off analysis","Strong CAP theorem"], improvements:["Cost optimisation","Monitoring tooling"] },
    3: { status:"completed", rating:4.0, recommendation:"Hire",
         summary:"Strong leadership examples. Aligned on team culture and growth expectations.",
         skills:[{skill:"Leadership",score:4},{skill:"Team Collaboration",score:4},{skill:"Conflict Resolution",score:4},{skill:"Ownership",score:3},{skill:"Vision",score:4}],
         strengths:["Cross-functional collaboration","Engineering leadership"], improvements:["Structured ownership examples"] },
    4: { status:"completed", rating:3.5, recommendation:"Hire",
         summary:"Strong values alignment. Salary within band. Flexible joining date.",
         skills:[{skill:"Culture Fit",score:4},{skill:"Communication",score:4},{skill:"Motivation",score:4},{skill:"Flexibility",score:5},{skill:"Long-term Fit",score:3}],
         strengths:["Cultural alignment","Long-term vision"], improvements:["Leadership articulation"] },
  },
  4: { // Aisha Levi
    1: { status:"completed", rating:5.0, recommendation:"Strong Hire",
         summary:"Outstanding ML pipeline presentation. End-to-end ML design from ingestion to monitoring. Best candidate this quarter.",
         skills:[{skill:"Machine Learning",score:5},{skill:"Statistics",score:5},{skill:"Python / SQL",score:5},{skill:"MLOps",score:4},{skill:"Communication",score:5}],
         strengths:["Exceptional ML design","Strong statistical intuition"], improvements:["Real-time inference depth"] },
    2: { status:"completed", rating:4.5, recommendation:"Strong Hire",
         summary:"Fluent Python/SQL. Handled Bayesian vs frequentist well. Impressive MLOps and A/B testing awareness.",
         skills:[{skill:"Python",score:5},{skill:"SQL",score:5},{skill:"Experiment Design",score:4},{skill:"Feature Engineering",score:4},{skill:"Deployment",score:4}],
         strengths:["Fluent Python and SQL","Strong MLOps"], improvements:["Streaming data pipelines"] },
    3: { status:"completed", rating:4.5, recommendation:"Strong Hire",
         summary:"Strong ownership mentality. Excellent analytical communication with non-technical stakeholders.",
         skills:[{skill:"Ownership",score:5},{skill:"Communication",score:5},{skill:"Problem Framing",score:4},{skill:"Stakeholder Mgmt",score:4},{skill:"Ambiguity Handling",score:4}],
         strengths:["Strong ownership","Analytical communication"], improvements:["Stakeholder management scale"] },
    4: { status:"completed", rating:4.0, recommendation:"Strong Hire",
         summary:"Excellent culture fit. Salary in range. Ready to join within 2 weeks.",
         skills:[{skill:"Culture Fit",score:5},{skill:"Motivation",score:5},{skill:"Flexibility",score:5},{skill:"Communication",score:4},{skill:"Long-term Fit",score:4}],
         strengths:["Strong culture fit","Quick joining"], improvements:["None significant"] },
  },
  5: { // Priya Sharma
    1: { status:"completed", rating:3.5, recommendation:"Hire",
         summary:"Good product mindset with concrete alignment examples. Some hesitation on ambiguous prioritisation scenarios.",
         skills:[{skill:"Product Sense",score:4},{skill:"Prioritisation",score:3},{skill:"Stakeholder Mgmt",score:4},{skill:"Data Thinking",score:3},{skill:"Communication",score:4}],
         strengths:["Strong stakeholder management","User-centric thinking"], improvements:["Ambiguous trade-offs","Technical constraints"] },
    2: { status:"completed", rating:3.5, recommendation:"Hire",
         summary:"Good prioritisation framework. Handled feature trade-offs well. Lacked depth in metric definition.",
         skills:[{skill:"Roadmapping",score:4},{skill:"Metrics",score:3},{skill:"User Research",score:3},{skill:"Execution",score:4},{skill:"Communication",score:4}],
         strengths:["Good prioritisation","Clear user empathy"], improvements:["Metric definition","Technical feasibility"] },
  },
};

/* ── Build per-candidate round-feedback list from live interview data ── */
function buildCandidateFeedback(c: Candidate): { rounds: RoundFeedback[]; overallRating: number; overallRec: Rec } {
  const rounds = c.rounds.map(r => {
    const base = defaultFeedback(r);
    const rich = richFeedback[c.id]?.[r.roundNo];
    // Always sync interviewer from live store
    return { ...base, ...rich, interviewer: r.interviewer, interviewerInitials: r.interviewer.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(), date: r.date };
  });

  const completed = rounds.filter(r => r.status === "completed" && r.rating > 0);
  const overallRating = completed.length
    ? Math.round((completed.reduce((s, r) => s + r.rating, 0) / completed.length) * 10) / 10
    : 0;

  const recOrder: Rec[] = ["Strong Hire", "Hire", "Hold", "No Hire", "—"];
  const recs = completed.map(r => r.recommendation).filter((r): r is Exclude<Rec, "—"> => r !== "—");
  const overallRec: Rec = recs.length
    ? (recOrder.find(r => recs.includes(r as Exclude<Rec, "—">)) ?? "—")
    : "—";

  return { rounds, overallRating, overallRec };
}

/* ── Style maps ─────────────────────────────────────────── */
const recStyle: Record<string, { bg: string; color: string; dot: string }> = {
  "Strong Hire": { bg:"rgba(122,184,216,0.15)", color:"#3A70A0", dot:"#7AB8D8" },
  "Hire":        { bg:"rgba(168,152,216,0.15)", color:"#5A4878", dot:"#A898D8" },
  "Hold":        { bg:"rgba(238,208,90,0.2)",   color:"#7A5A10", dot:"#EED860" },
  "No Hire":     { bg:"rgba(184,117,160,0.15)", color:"#8A4A78", dot:"#B875A0" },
  "—":           { bg:"rgba(200,190,220,0.2)",  color:"#888",    dot:"#C8B8D8" },
};

const statusMeta: Record<FeedbackStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  completed: { label:"Completed", cls:"st-done",      icon:<CheckCircle size={12} /> },
  scheduled: { label:"Scheduled", cls:"st-scheduled", icon:<Clock size={12} /> },
  pending:   { label:"Pending",   cls:"st-pending",   icon:<Circle size={12} /> },
  na:        { label:"N/A",       cls:"st-na",        icon:<Circle size={12} /> },
};

/* ── Small components ───────────────────────────────────── */
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
      <div className="skill-bar-fill" style={{ width:`${pct}%`, background:color }} />
    </div>
  );
}

/* ── Round cell in table ────────────────────────────────── */
function RoundCell({ round, label, onView }: { round: RoundFeedback; label: string; onView: () => void }) {
  const sm = statusMeta[round.status];
  if (round.status === "na") return <div className="rc-na">—</div>;
  return (
    <div className="rc-cell">
      <span className={`rc-status ${sm.cls}`}>{sm.icon}{sm.label}</span>
      {round.status === "completed"
        ? <button className="btn-view" onClick={onView}><MessageSquare size={11} /> View Feedback</button>
        : <span className="rc-note">{round.status === "scheduled" ? `Sched. · ${round.date}` : "Awaiting"}</span>}
    </div>
  );
}

/* ── Feedback Detail Modal ──────────────────────────────── */
function FeedbackModal({ round, colLabel, candidate, onClose }: {
  round: RoundFeedback; colLabel: string; candidate: Candidate; onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-modal" onClick={e => e.stopPropagation()}>
        <div className="fb-modal-hd">
          <div className="fb-modal-hd-left">
            <div className="fb-avatar" style={{ background: candidate.color }}>{candidate.initials}</div>
            <div>
              <div className="fb-modal-title">{candidate.name} — {colLabel}</div>
              <div className="fb-modal-sub">{candidate.role} · {round.interviewer} · {round.date}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="fb-modal-body">
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
          <div className="fm-section">
            <div className="fm-section-title">Interview Summary</div>
            <p className="fm-summary">{round.summary}</p>
          </div>
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
          {(round.strengths.length > 0 || round.improvements.length > 0) && (
            <div className="fm-two-col">
              {round.strengths.length > 0 && (
                <div className="fm-section">
                  <div className="fm-section-title">Strengths</div>
                  <ul className="fm-list">{round.strengths.map(s => <li key={s} className="fm-good">{s}</li>)}</ul>
                </div>
              )}
              {round.improvements.length > 0 && (
                <div className="fm-section">
                  <div className="fm-section-title">Areas to Improve</div>
                  <ul className="fm-list">{round.improvements.map(s => <li key={s} className="fm-improve">{s}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Approval Summary Modal ─────────────────────────────── */
function ApprovalModal({ candidate, rounds, overallRating, overallRec, onClose, onSend, sending, sent }: {
  candidate: Candidate; rounds: RoundFeedback[];
  overallRating: number; overallRec: Rec;
  onClose: () => void; onSend: () => void; sending: boolean; sent: boolean;
}) {
  const allSkills: Record<string, number[]> = {};
  rounds.filter(r => r.status === "completed").forEach(r => {
    r.skills.forEach(sk => {
      if (!allSkills[sk.skill]) allSkills[sk.skill] = [];
      allSkills[sk.skill].push(sk.score);
    });
  });
  const aggSkills = Object.entries(allSkills)
    .map(([skill, scores]) => ({ skill, avg: Math.round((scores.reduce((a,b) => a+b,0)/scores.length)*10)/10 }))
    .sort((a,b) => b.avg - a.avg);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-modal fb-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="fb-modal-hd">
          <div className="fb-modal-hd-left">
            <div className="fb-avatar" style={{ background: candidate.color }}>{candidate.initials}</div>
            <div>
              <div className="fb-modal-title">{candidate.name} — Full Interview Summary</div>
              <div className="fb-modal-sub">{candidate.role} · For Manager Approval</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="fb-modal-body">
          <div className="fm-overview">
            <div className="fm-ov-block">
              <div className="fm-ov-label">Overall Rating</div>
              <div className="fm-ov-big">{overallRating || "—"}</div>
              <MiniStars score={overallRating} size={14} />
            </div>
            <div className="fm-ov-block">
              <div className="fm-ov-label">Recommendation</div>
              <RecBadge rec={overallRec} />
            </div>
          </div>
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
          <div className="fm-section">
            <div className="fm-section-title">Round-by-Round Summary</div>
            {rounds.map((r, i) => {
              if (r.status === "pending") return null;
              const sm = statusMeta[r.status];
              return (
                <div key={i} className="fm-round-block">
                  <div className="fm-round-head">
                    <span className={`rc-status ${sm.cls}`} style={{ cursor:"default" }}>{sm.icon} Round {i+1}</span>
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

/* ── Page ───────────────────────────────────────────────── */
export default function FeedbackPage() {
  const { candidates } = useInterviewStore();

  const [approvalFilter, setApprovalFilter] = useState("All");
  const [jobFilter,      setJobFilter]      = useState("All Roles");
  const [dateFilter,     setDateFilter]     = useState("Any Date");
  const [modal,    setModal]    = useState<{ candidate: Candidate; round: RoundFeedback; label: string } | null>(null);
  const [approval, setApproval] = useState<Candidate | null>(null);
  const [approvalState, setApprovalState] = useState<Record<number, "pending" | "approved">>(
    () => Object.fromEntries(candidates.map(c => [c.id, "pending" as const]))
  );
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentId,    setSentId]    = useState<number | null>(null);

  /* Build derived feedback for all candidates from live store */
  const allFeedback = useMemo(() =>
    candidates.map(c => ({ candidate: c, ...buildCandidateFeedback(c) })),
    [candidates]
  );

  /* Max round count across all candidates (for dynamic column headers) */
  const maxRounds = useMemo(() => Math.max(...candidates.map(c => c.rounds.length), 1), [candidates]);

  const allRoles    = ["All Roles", ...Array.from(new Set(candidates.map(c => c.role))).sort()];
  const dateBuckets = ["Any Date","Last 7 days","Last 14 days","Last 30 days"];
  const today       = new Date(2026, 5, 9);

  function parseDate(d: string) {
    const months: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
    const parts = d.split(" ");
    if (parts.length < 3) return null;
    const m = months[parts[1]]; if (m === undefined) return null;
    return new Date(parseInt(parts[2]), m, parseInt(parts[0]));
  }

  const filtered = allFeedback.filter(({ candidate, rounds, overallRec }) => {
    const appr = approvalState[candidate.id] ?? "pending";
    if (approvalFilter === "Pending" && appr !== "pending")  return false;
    if (approvalFilter === "Sent"    && appr !== "approved") return false;
    if (jobFilter !== "All Roles" && candidate.role !== jobFilter) return false;
    if (dateFilter !== "Any Date") {
      const completedDates = rounds
        .filter(r => r.status === "completed" && r.date !== "TBD")
        .map(r => parseDate(r.date))
        .filter(Boolean) as Date[];
      if (!completedDates.length) return false;
      const earliest = new Date(Math.min(...completedDates.map(d => d.getTime())));
      const diff = Math.floor((today.getTime() - earliest.getTime()) / 86400000);
      if (dateFilter === "Last 7 days"  && diff > 7)  return false;
      if (dateFilter === "Last 14 days" && diff > 14) return false;
      if (dateFilter === "Last 30 days" && diff > 30) return false;
    }
    return true;
  });

  const anyFilter = approvalFilter !== "All" || jobFilter !== "All Roles" || dateFilter !== "Any Date";

  function handleSend(candidateId: number) {
    setSendingId(candidateId);
    setTimeout(() => {
      setApprovalState(p => ({ ...p, [candidateId]: "approved" }));
      setSendingId(null); setSentId(candidateId);
      setTimeout(() => { setSentId(null); setApproval(null); }, 1800);
    }, 1200);
  }

  const strongHires  = allFeedback.filter(({ overallRec }) => overallRec === "Strong Hire").length;
  const avgRating    = allFeedback.length
    ? (allFeedback.reduce((s, { overallRating }) => s + overallRating, 0) / allFeedback.length).toFixed(1)
    : "—";

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interview Feedback</h1>
          <p className="page-sub">
            {candidates.length} candidates &middot; {strongHires} strong hires &middot; avg {avgRating}/5
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="fb-filters">
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
        <span className="fb-count">{filtered.length} of {allFeedback.length}</span>
        {anyFilter && (
          <button className="fb-clear" onClick={() => { setApprovalFilter("All"); setJobFilter("All Roles"); setDateFilter("Any Date"); }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="fb-table-wrap">
        <div className="fb-scroll">
          {/* Dynamic header */}
          <div className="fb-head" style={{ gridTemplateColumns: `180px 150px repeat(${maxRounds}, minmax(140px, 1fr)) 150px` }}>
            <div className="fbc fbc-cand">Candidate</div>
            <div className="fbc fbc-int">Primary Interviewer</div>
            {Array.from({ length: maxRounds }, (_, i) => (
              <div key={i} className="fbc fbc-round">Round {i + 1}</div>
            ))}
            <div className="fbc fbc-appr">Manager Approval</div>
          </div>

          {filtered.length === 0 && (
            <div className="fb-empty">No candidates match the selected filters.</div>
          )}

          {filtered.map(({ candidate: c, rounds, overallRating, overallRec }) => {
            const appr = approvalState[c.id] ?? "pending";
            return (
              <div
                key={c.id}
                className="fb-row"
                style={{ gridTemplateColumns: `180px 150px repeat(${maxRounds}, minmax(140px, 1fr)) 150px` }}
              >
                {/* Candidate */}
                <div className="fbc fbc-cand">
                  <div className="cand-av" style={{ background: c.color }}>{c.initials}</div>
                  <div>
                    <div className="cand-name">{c.name}</div>
                    <div className="cand-role">{c.role}</div>
                  </div>
                </div>

                {/* Primary interviewer (round 1) */}
                <div className="fbc fbc-int">
                  {rounds[0] && (
                    <div className="int-row">
                      <div className="int-av">{rounds[0].interviewerInitials}</div>
                      <div>
                        <div className="int-name">{rounds[0].interviewer}</div>
                        <div className="int-date">{rounds[0].date}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* One column per round slot up to maxRounds */}
                {Array.from({ length: maxRounds }, (_, i) => {
                  const r = rounds[i];
                  if (!r) {
                    return <div key={i} className="fbc fbc-round"><div className="rc-na">—</div></div>;
                  }
                  return (
                    <div key={i} className="fbc fbc-round">
                      <RoundCell
                        round={r}
                        label={`Round ${i + 1} — ${c.rounds[i]?.type ?? ""}`}
                        onView={() => setModal({ candidate: c, round: r, label: `Round ${i + 1} — ${c.rounds[i]?.type ?? ""}` })}
                      />
                    </div>
                  );
                })}

                {/* Approval */}
                <div className="fbc fbc-appr">
                  {appr === "approved"
                    ? <div className="appr-sent"><CheckCircle size={14} color="#3A70A0" /><span>Summary Sent</span></div>
                    : <button className="btn-approve" onClick={() => setApproval(c)}><MessageSquare size={11} /> Review &amp; Approve</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback detail modal */}
      {modal && (
        <FeedbackModal
          round={modal.round}
          colLabel={modal.label}
          candidate={modal.candidate}
          onClose={() => setModal(null)}
        />
      )}

      {/* Approval summary modal */}
      {approval && (() => {
        const fb = allFeedback.find(f => f.candidate.id === approval.id);
        if (!fb) return null;
        return (
          <ApprovalModal
            candidate={approval}
            rounds={fb.rounds}
            overallRating={fb.overallRating}
            overallRec={fb.overallRec}
            onClose={() => setApproval(null)}
            onSend={() => handleSend(approval.id)}
            sending={sendingId === approval.id}
            sent={sentId === approval.id}
          />
        );
      })()}
    </div>
  );
}