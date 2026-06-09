"use client";
import "./FeedbackPage.css";
import { useState } from "react";
import { Star, X, MessageSquare, CheckCircle, Circle, Clock, User, ChevronDown, ChevronUp } from "lucide-react";

type RoundStatus = "completed" | "pending" | "scheduled" | "na";
type Rec = "Strong Hire" | "Hire" | "Hold" | "No Hire" | "—";

type RoundData = {
  status: RoundStatus;
  interviewer: string;
  interviewerInitials: string;
  date: string;
  rating: number;
  recommendation: Rec;
  summary: string;
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

function makeRound(status: RoundStatus, interviewer: string, initials: string, date: string,
  rating: number, rec: Rec, summary: string, strengths: string[], improvements: string[]): RoundData {
  return { status, interviewer, interviewerInitials: initials, date, rating, recommendation: rec, summary, strengths, improvements };
}

const feedbackData: CandidateFeedback[] = [
  {
    id: 1, candidate: "Yuki Tanaka", initials: "YT", avatarColor: "#B875A0",
    role: "Frontend Engineer", interviewDate: "22 May 2026",
    overallRating: 4.5, overallRecommendation: "Strong Hire", managerApprovalStatus: "pending",
    round1: makeRound("completed","Priya R.","PR","22 May 2026",4.5,"Strong Hire","Exceptional React proficiency. Clean code, strong accessibility knowledge. Proactive in trade-off discussions.",["Deep React hooks knowledge","Strong CSS architecture"],["Backend integration depth","Testing coverage"]),
    round2: makeRound("completed","Arjun K.","AK","24 May 2026",4.0,"Hire","Good micro-frontend design. Some gaps in large-scale state management but overall solid.",["Clear component decomposition","Good trade-off analysis"],["Large-scale state management","SSR/SSG trade-offs"]),
    managerialRound: makeRound("scheduled","CEO","CE","28 May 2026",0,"—","Scheduled — pending feedback.",[],[]),
    hrRound: makeRound("pending","Sneha M.","SM","TBD",0,"—","Pending after managerial round.",[],[]),
  },
  {
    id: 2, candidate: "Sarah Mitchell", initials: "SM", avatarColor: "#8A6AAE",
    role: "Senior Backend Engineer", interviewDate: "20 May 2026",
    overallRating: 4.0, overallRecommendation: "Hire", managerApprovalStatus: "pending",
    round1: makeRound("completed","Arjun K.","AK","20 May 2026",4.0,"Hire","Strong Kafka knowledge. Solved all coding problems. Minor gaps in sharding.",["Distributed systems fundamentals","Clean code"],["Database sharding","Observability depth"]),
    round2: makeRound("completed","Priya R.","PR","22 May 2026",4.5,"Strong Hire","Best system design this quarter. Clear CAP theorem understanding.",["Excellent trade-off analysis","Strong CAP theorem"],["Cost optimisation","Monitoring tooling"]),
    managerialRound: makeRound("completed","Rahul D.","RD","23 May 2026",4.0,"Hire","Strong leadership examples. Aligned on team culture.",["Cross-functional collaboration","Engineering leadership"],["Structured ownership examples"]),
    hrRound: makeRound("completed","Sneha M.","SM","24 May 2026",3.5,"Hire","Strong values alignment. Salary in band. Flexible joining.",["Cultural alignment","Long-term vision"],["Leadership articulation"]),
  },
  {
    id: 3, candidate: "Marco Greco", initials: "MG", avatarColor: "#7AB8D8",
    role: "DevOps Engineer", interviewDate: "30 May 2026",
    overallRating: 3.0, overallRecommendation: "Hold", managerApprovalStatus: "pending",
    round1: makeRound("scheduled","Sneha M.","SM","30 May 2026",0,"—","Round 1 scheduled.",[],[]),
    round2: makeRound("pending","Rahul D.","RD","TBD",0,"—","Pending scheduling.",[],[]),
    managerialRound: makeRound("pending","CEO","CE","TBD",0,"—","On hold.",[],[]),
    hrRound: makeRound("na","—","—","—",0,"—","",[],[]),
  },
  {
    id: 4, candidate: "Aisha Levi", initials: "AL", avatarColor: "#C078B0",
    role: "Data Scientist", interviewDate: "20 May 2026",
    overallRating: 4.8, overallRecommendation: "Strong Hire", managerApprovalStatus: "pending",
    round1: makeRound("completed","Rahul D.","RD","20 May 2026",5.0,"Strong Hire","Outstanding ML pipeline presentation. Best candidate this quarter.",["Exceptional ML design","Strong statistical intuition"],["Real-time inference depth"]),
    round2: makeRound("completed","Arjun K.","AK","22 May 2026",4.5,"Strong Hire","Fluent Python/SQL. Impressive MLOps awareness.",["Fluent Python and SQL","Strong MLOps"],["Streaming data pipelines"]),
    managerialRound: makeRound("completed","Priya R.","PR","24 May 2026",4.5,"Strong Hire","Strong ownership mentality. Excellent analytical communication.",["Strong ownership","Analytical communication"],["Stakeholder management scale"]),
    hrRound: makeRound("completed","Sneha M.","SM","25 May 2026",4.0,"Strong Hire","Excellent culture fit. Joining in 2 weeks.",["Strong culture fit","Quick joining"],["None significant"]),
  },
  {
    id: 5, candidate: "Priya Sharma", initials: "PS", avatarColor: "#A898D8",
    role: "Product Manager", interviewDate: "19 May 2026",
    overallRating: 3.5, overallRecommendation: "Hire", managerApprovalStatus: "pending",
    round1: makeRound("completed","Sneha M.","SM","19 May 2026",3.5,"Hire","Good product mindset. Hesitation on ambiguous prioritisation.",["Strong stakeholder management","User-centric thinking"],["Ambiguous trade-offs","Technical constraints"]),
    round2: makeRound("completed","Arjun K.","AK","20 May 2026",3.5,"Hire","Good prioritisation framework. Lacked metric definition depth.",["Good prioritisation","Clear user empathy"],["Metric definition","Technical feasibility"]),
    managerialRound: makeRound("scheduled","CEO","CE","29 May 2026",0,"—","Scheduled.",[],[]),
    hrRound: makeRound("pending","Sneha M.","SM","TBD",0,"—","Pending.",[],[]),
  },
];

const ROUNDS: { key: keyof CandidateFeedback; label: string }[] = [
  { key: "round1",          label: "Round 1" },
  { key: "round2",          label: "Round 2" },
  { key: "managerialRound", label: "Managerial" },
  { key: "hrRound",         label: "HR Round" },
];

const recStyle: Record<string, { bg: string; color: string; dot: string }> = {
  "Strong Hire": { bg: "rgba(122,184,216,0.18)", color: "#3A70A0", dot: "#7AB8D8" },
  "Hire":        { bg: "rgba(168,152,216,0.18)", color: "#5A4878", dot: "#A898D8" },
  "Hold":        { bg: "rgba(240,208,90,0.18)",  color: "#7A5A10", dot: "#EED890" },
  "No Hire":     { bg: "rgba(184,117,160,0.18)", color: "#8A4A78", dot: "#B875A0" },
  "—":           { bg: "rgba(200,190,220,0.2)",  color: "#888",    dot: "#C8B8D8" },
};

const statusConfig: Record<RoundStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  completed: { label: "Done",      cls: "rs-done",      icon: <CheckCircle size={11} /> },
  scheduled: { label: "Scheduled", cls: "rs-scheduled", icon: <Clock size={11} /> },
  pending:   { label: "Pending",   cls: "rs-pending",   icon: <Circle size={11} /> },
  na:        { label: "N/A",       cls: "rs-na",        icon: <Circle size={11} /> },
};

function Stars({ score, size = 11 }: { score: number; size?: number }) {
  if (!score) return <span className="no-score">—</span>;
  return (
    <span className="stars-row">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} style={{
          color: s <= Math.round(score) ? "#B875A0" : "#DDD0E8",
          fill:  s <= Math.round(score) ? "#B875A0" : "none",
        }} />
      ))}
      <span className="stars-score">{score}</span>
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

function RoundPill({ round, label, onClick, active }: {
  round: RoundData; label: string; onClick: () => void; active: boolean;
}) {
  if (round.status === "na") return null;
  const sc = statusConfig[round.status];
  return (
    <button className={`round-pill ${sc.cls} ${active ? "round-pill-active" : ""}`} onClick={onClick}>
      {sc.icon}
      <span>{label}</span>
      {round.status === "completed" && <span className="round-pill-score">{round.rating}</span>}
    </button>
  );
}

function FeedbackDrawer({ round, label, candidate, onClose }: {
  round: RoundData; label: string; candidate: CandidateFeedback; onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-drawer" onClick={e => e.stopPropagation()}>
        <div className="fb-drawer-header">
          <div className="fb-drawer-title-row">
            <div className="cand-circle" style={{ background: candidate.avatarColor }}>{candidate.initials}</div>
            <div>
              <div className="fb-drawer-name">{candidate.candidate} — {label}</div>
              <div className="fb-drawer-sub">{candidate.role} · {round.interviewer} · {round.date}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="fb-drawer-body">
          <div className="fb-drawer-meta">
            <Stars score={round.rating} size={15} />
            <RecBadge rec={round.recommendation} />
          </div>
          <p className="fb-drawer-summary">{round.summary}</p>
          {(round.strengths.length > 0 || round.improvements.length > 0) && (
            <div className="fb-drawer-cols">
              {round.strengths.length > 0 && (
                <div>
                  <div className="fb-drawer-col-title">Strengths</div>
                  <ul className="fb-pts">
                    {round.strengths.map(s => <li key={s} className="fb-pt-good">{s}</li>)}
                  </ul>
                </div>
              )}
              {round.improvements.length > 0 && (
                <div>
                  <div className="fb-drawer-col-title">To Improve</div>
                  <ul className="fb-pts">
                    {round.improvements.map(s => <li key={s} className="fb-pt-improve">{s}</li>)}
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

function SummaryModal({ f, onClose, onSend, sending, sent }: {
  f: CandidateFeedback; onClose: () => void;
  onSend: () => void; sending: boolean; sent: boolean;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-modal" onClick={e => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div className="fb-modal-title-row">
            <div className="cand-circle" style={{ background: f.avatarColor }}>{f.initials}</div>
            <div>
              <div className="fb-modal-name">{f.candidate} — Summary</div>
              <div className="fb-modal-sub">{f.role} · For Manager Approval</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="fb-modal-body">
          <div className="summary-top">
            <Stars score={f.overallRating} size={16} />
            <RecBadge rec={f.overallRecommendation} />
          </div>
          {ROUNDS.map(col => {
            const r = f[col.key] as RoundData;
            if (r.status === "na" || r.status === "pending") return null;
            const sc = statusConfig[r.status];
            return (
              <div key={col.key as string} className="summary-round">
                <div className="summary-round-head">
                  <span className={`round-pill ${sc.cls}`} style={{ pointerEvents: "none" }}>
                    {sc.icon}<span>{col.label}</span>
                  </span>
                  <div className="summary-round-meta">
                    <span className="summary-interviewer">{r.interviewer} · {r.date}</span>
                    {r.status === "completed" && <Stars score={r.rating} />}
                    {r.recommendation !== "—" && <RecBadge rec={r.recommendation} />}
                  </div>
                </div>
                {r.status === "completed" && (
                  <p className="summary-round-text">{r.summary}</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="fb-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className={`btn-send-approval ${sent ? "sent" : ""}`} onClick={onSend}
            disabled={sending || sent}>
            {sent ? <><CheckCircle size={13} /> Sent!</>
              : sending ? <><span className="spin" /> Sending...</>
              : <><MessageSquare size={13} /> Approve &amp; Send</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [roundFilter,    setRoundFilter]    = useState("All Rounds");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [jobFilter,      setJobFilter]      = useState("All Roles");
  const [dateFilter,     setDateFilter]     = useState("Any Date");
  const [drawer, setDrawer] = useState<{ f: CandidateFeedback; round: RoundData; label: string } | null>(null);
  const [summaryModal, setSummaryModal] = useState<CandidateFeedback | null>(null);
  const [approvalState, setApprovalState] = useState<Record<number, "pending" | "approved">>(
    () => Object.fromEntries(feedbackData.map(f => [f.id, f.managerApprovalStatus]))
  );
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentId,    setSentId]    = useState<number | null>(null);

  const allRoles   = ["All Roles", ...Array.from(new Set(feedbackData.map(f => f.role))).sort()];
  const dateBuckets = ["Any Date", "Last 7 days", "Last 14 days", "Last 30 days"];
  const today = new Date(2026, 5, 9);

  function parseDateStr(d: string) {
    const months: Record<string, number> = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
    const [day, mon, yr] = d.split(" ");
    const m = months[mon];
    if (m === undefined) return null;
    return new Date(parseInt(yr), m, parseInt(day));
  }

  const filtered = feedbackData.filter(f => {
    const approval = approvalState[f.id] ?? "pending";
    if (approvalFilter === "Pending" && approval !== "pending") return false;
    if (approvalFilter === "Sent"    && approval !== "approved") return false;
    if (roundFilter === "Round 1"          && f.round1.status          !== "completed") return false;
    if (roundFilter === "Round 2"          && f.round2.status          !== "completed") return false;
    if (roundFilter === "Managerial Round" && f.managerialRound.status !== "completed") return false;
    if (roundFilter === "HR Round"         && f.hrRound.status         !== "completed") return false;
    if (jobFilter !== "All Roles"  && f.role !== jobFilter) return false;
    if (dateFilter !== "Any Date") {
      const d = parseDateStr(f.interviewDate);
      if (!d) return false;
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
      setTimeout(() => { setSentId(null); setSummaryModal(null); }, 1800);
    }, 1200);
  }

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interview Feedback</h1>
          <p className="page-sub">{feedbackData.length} candidates · {feedbackData.filter(f => f.overallRecommendation === "Strong Hire").length} strong hires · avg {(feedbackData.reduce((s,f) => s + f.overallRating, 0) / feedbackData.length).toFixed(1)}/5</p>
        </div>
      </div>

      {/* Compact filter bar */}
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
        <span className="fb-filter-count">{filtered.length} of {feedbackData.length}</span>
        {anyFilter && <button className="fb-clear" onClick={() => { setRoundFilter("All Rounds"); setApprovalFilter("All"); setJobFilter("All Roles"); setDateFilter("Any Date"); }}>Clear</button>}
      </div>

      {/* Cards */}
      <div className="fb-cards">
        {filtered.length === 0 && (
          <div className="fb-empty">No candidates match the selected filters.</div>
        )}
        {filtered.map(f => {
          const approval = approvalState[f.id] ?? "pending";
          return (
            <div key={f.id} className="fb-card">
              {/* Card header */}
              <div className="fb-card-head">
                <div className="fb-card-left">
                  <div className="cand-circle" style={{ background: f.avatarColor }}>{f.initials}</div>
                  <div>
                    <div className="cand-name">{f.candidate}</div>
                    <div className="cand-role">{f.role}</div>
                  </div>
                </div>
                <div className="fb-card-right">
                  <Stars score={f.overallRating} size={12} />
                  <RecBadge rec={f.overallRecommendation} />
                </div>
              </div>

              {/* Round pills */}
              <div className="fb-rounds-row">
                {ROUNDS.map(col => {
                  const r = f[col.key] as RoundData;
                  return (
                    <RoundPill
                      key={col.key as string}
                      round={r}
                      label={col.label}
                      active={false}
                      onClick={() => r.status === "completed" && setDrawer({ f, round: r, label: col.label })}
                    />
                  );
                })}
              </div>

              {/* Interviewer + approval */}
              <div className="fb-card-foot">
                <div className="fb-interviewer">
                  <User size={11} color="#9488A8" />
                  <span>{f.round1.interviewer} · {f.interviewDate}</span>
                </div>
                {approval === "approved" ? (
                  <div className="approval-sent">
                    <CheckCircle size={13} color="#3A70A0" />
                    <span>Sent to manager</span>
                  </div>
                ) : (
                  <button className="btn-approve" onClick={() => setSummaryModal(f)}>
                    <MessageSquare size={11} /> Review &amp; Approve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback drawer */}
      {drawer && (
        <FeedbackDrawer
          round={drawer.round}
          label={drawer.label}
          candidate={drawer.f}
          onClose={() => setDrawer(null)}
        />
      )}

      {/* Summary modal */}
      {summaryModal && (
        <SummaryModal
          f={summaryModal}
          onClose={() => setSummaryModal(null)}
          onSend={() => handleSend(summaryModal)}
          sending={sendingId === summaryModal.id}
          sent={sentId === summaryModal.id}
        />
      )}
    </div>
  );
}
