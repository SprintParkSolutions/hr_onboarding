"use client";
import "./FeedbackPage.css";
import { useState } from "react";
import { Star, X, MessageSquare, CheckCircle, Circle, Clock, User } from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
type RoundStatus = "completed" | "pending" | "scheduled" | "na";

type RoundData = {
  status: RoundStatus;
  interviewer: string;
  interviewerInitials: string;
  date: string;
  rating: number;
  recommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire" | "—";
  summary: string;
  strengths: string[];
  improvements: string[];
};

type CandidateFeedback = {
  id: number;
  candidate: string;
  initials: string;
  color: string;
  role: string;
  interviewDate: string;   // latest completed round date for filtering
  overallRating: number;
  overallRecommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire";
  managerApprovalStatus: "pending" | "approved" | "rejected";
  round1: RoundData;
  round2: RoundData;
  managerialRound: RoundData;
  hrRound: RoundData;
};

function makeRound(
  status: RoundStatus, interviewer: string, initials: string, date: string,
  rating: number, rec: RoundData["recommendation"],
  summary: string, strengths: string[], improvements: string[]
): RoundData {
  return { status, interviewer, interviewerInitials: initials, date, rating, recommendation: rec, summary, strengths, improvements };
}

/* ── Data ─────────────────────────────────────────────── */
const feedbackData: CandidateFeedback[] = [
  {
    id: 1, candidate: "Yuki Tanaka", initials: "YT", color: "#10b981",
    role: "Frontend Engineer", interviewDate: "22 May 2026", overallRating: 4.5, overallRecommendation: "Strong Hire",
    managerApprovalStatus: "pending",
    round1: makeRound("completed", "Priya R.", "PR", "22 May 2026", 4.5, "Strong Hire",
      "Exceptional proficiency in React and modern frontend tooling. Tackled live coding confidently with clean well-structured code. Performance optimisation stood out.",
      ["Deep React hooks knowledge", "Strong CSS architecture", "Proactive in trade-off discussions"],
      ["Backend integration patterns need depth", "Testing coverage needs improvement"]),
    round2: makeRound("completed", "Arjun K.", "AK", "24 May 2026", 4.0, "Hire",
      "Good understanding of component architecture at scale. Designed a micro-frontend approach with clear reasoning. Some gaps in large-scale state management.",
      ["Clear component decomposition", "Understood trade-offs well"],
      ["Large-scale state management", "SSR/SSG trade-off exploration"]),
    managerialRound: makeRound("scheduled", "CEO", "CE", "28 May 2026", 0, "—",
      "Interview scheduled — managerial round feedback pending.", [], []),
    hrRound: makeRound("pending", "Sneha M.", "SM", "TBD", 0, "—",
      "Pending — HR round to be scheduled after managerial round.", [], []),
  },
  {
    id: 2, candidate: "Sarah Mitchell", initials: "SM", color: "#8b5cf6",
    role: "Senior Backend Engineer", interviewDate: "20 May 2026", overallRating: 4.0, overallRecommendation: "Hire",
    managerApprovalStatus: "pending",
    round1: makeRound("completed", "Arjun K.", "AK", "20 May 2026", 4.0, "Hire",
      "Strong Kafka and distributed systems knowledge. Solved all coding problems correctly. Minor gaps in database sharding strategies.",
      ["Strong distributed systems fundamentals", "Clean code with good test awareness"],
      ["Database sharding strategies", "Observability and monitoring depth"]),
    round2: makeRound("completed", "Priya R.", "PR", "22 May 2026", 4.5, "Strong Hire",
      "Designed a scalable notification service with excellent trade-off discussions. Clear understanding of CAP theorem and event-driven architecture.",
      ["Excellent trade-off analysis", "Strong CAP theorem understanding"],
      ["Cost optimisation depth", "Monitoring tooling choices were vague"]),
    managerialRound: makeRound("completed", "Rahul D.", "RD", "23 May 2026", 4.0, "Hire",
      "Strong leadership qualities and cross-team collaboration examples. Handled hypothetical conflict scenarios well.",
      ["Excellent cross-functional collaboration", "Clear engineering leadership style"],
      ["Could give more structured examples of ownership"]),
    hrRound: makeRound("completed", "Sneha M.", "SM", "24 May 2026", 3.5, "Hire",
      "Strong alignment with company values. Salary expectations within band. Joining date flexible.",
      ["Great cultural alignment", "Clear long-term career vision"],
      ["Could articulate leadership examples more concretely"]),
  },
  {
    id: 3, candidate: "Marco Greco", initials: "MG", color: "#2563eb",
    role: "DevOps Engineer", interviewDate: "30 May 2026", overallRating: 3.0, overallRecommendation: "Hold",
    managerApprovalStatus: "pending",
    round1: makeRound("scheduled", "Sneha M.", "SM", "30 May 2026", 0, "—",
      "Round 1 scheduled — awaiting completion.", [], []),
    round2: makeRound("pending", "Rahul D.", "RD", "TBD", 0, "—",
      "Practical/system design round pending — awaiting scheduling.", [], []),
    managerialRound: makeRound("pending", "CEO", "CE", "TBD", 0, "—",
      "Managerial round on hold — subject to Round 2 outcome.", [], []),
    hrRound: makeRound("na", "—", "—", "—", 0, "—", "", [], []),
  },
  {
    id: 4, candidate: "Aisha Levi", initials: "AL", color: "#ef4444",
    role: "Data Scientist", interviewDate: "20 May 2026", overallRating: 4.8, overallRecommendation: "Strong Hire",
    managerApprovalStatus: "pending",
    round1: makeRound("completed", "Rahul D.", "RD", "20 May 2026", 5.0, "Strong Hire",
      "Outstanding ML pipeline presentation. End-to-end coverage from data ingestion to deployment monitoring. Best data science candidate this quarter.",
      ["Exceptional ML pipeline design", "Strong statistical intuition"],
      ["Real-time inference optimisation could be deeper"]),
    round2: makeRound("completed", "Arjun K.", "AK", "22 May 2026", 4.5, "Strong Hire",
      "Fluent in Python and SQL. Handled Bayesian vs frequentist discussion confidently. MLOps awareness was impressive.",
      ["Fluent Python and SQL", "Strong MLOps awareness"],
      ["Streaming data pipelines need more exposure"]),
    managerialRound: makeRound("completed", "Priya R.", "PR", "24 May 2026", 4.5, "Strong Hire",
      "Demonstrated strong ownership and clear analytical thinking. Articulated her vision for responsible AI in data pipelines.",
      ["Strong ownership mentality", "Excellent analytical communication"],
      ["Could think more about stakeholder management at scale"]),
    hrRound: makeRound("completed", "Sneha M.", "SM", "25 May 2026", 4.0, "Strong Hire",
      "Excellent culture fit. Salary expectations in range. Ready to join within 2 weeks.",
      ["Strong culture fit", "Quick joining timeline"],
      ["None significant"]),
  },
  {
    id: 5, candidate: "Priya Sharma", initials: "PS", color: "#0891b2",
    role: "Product Manager", interviewDate: "19 May 2026", overallRating: 3.5, overallRecommendation: "Hire",
    managerApprovalStatus: "pending",
    round1: makeRound("completed", "Sneha M.", "SM", "19 May 2026", 3.5, "Hire",
      "Good product mindset with concrete examples of cross-functional alignment. Some hesitation on ambiguous prioritisation scenarios.",
      ["Strong stakeholder management", "User-centric thinking"],
      ["Confidence in ambiguous trade-offs", "Technical constraints understanding"]),
    round2: makeRound("completed", "Arjun K.", "AK", "20 May 2026", 3.5, "Hire",
      "Reasonable product sense. Handled feature prioritisation framework question well. Lacked depth in metric definition.",
      ["Good prioritisation framework", "Clear user empathy"],
      ["Metric definition needs more depth", "Technical feasibility discussions"]),
    managerialRound: makeRound("scheduled", "CEO", "CE", "29 May 2026", 0, "—",
      "Managerial round scheduled — feedback pending.", [], []),
    hrRound: makeRound("pending", "Sneha M.", "SM", "TBD", 0, "—",
      "HR round pending — awaiting managerial round completion.", [], []),
  },
];

const ROUND_COLS: { key: keyof CandidateFeedback; label: string; shortLabel: string }[] = [
  { key: "round1",          label: "Round 1 — Technical",     shortLabel: "Round 1"    },
  { key: "round2",          label: "Round 2 — System Design", shortLabel: "Round 2"    },
  { key: "managerialRound", label: "Managerial Round",        shortLabel: "Managerial" },
  { key: "hrRound",         label: "HR Round",                shortLabel: "HR Round"   },
];

const recStyle: Record<string, { bg: string; text: string; dot: string }> = {
  "Strong Hire": { bg: "rgba(110,200,160,0.18)", text: "#1a7a50", dot: "#6ec8a0" },
  "Hire":        { bg: "rgba(128,178,255,0.18)", text: "#2a5090", dot: "#80B2FF" },
  "Hold":        { bg: "rgba(240,192,96,0.22)",  text: "#806020", dot: "#f0c060" },
  "No Hire":     { bg: "rgba(224,112,144,0.18)", text: "#a03050", dot: "#e07090" },
  "—":           { bg: "rgba(200,200,200,0.2)",  text: "#999",    dot: "#ccc"    },
};

const statusMeta: Record<RoundStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", cls: "status-completed", icon: <CheckCircle size={12} /> },
  scheduled: { label: "Scheduled", cls: "status-scheduled", icon: <Clock size={12} />       },
  pending:   { label: "Pending",   cls: "status-pending",   icon: <Circle size={12} />       },
  na:        { label: "N/A",       cls: "status-na",        icon: <Circle size={12} />       },
};

/* ── Helpers ─────────────────────────────────────────── */
function MiniStars({ score }: { score: number }) {
  if (!score) return <span className="no-score">—</span>;
  return (
    <span className="mini-stars">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={11} style={{
          color: s <= Math.round(score) ? "#9B7485" : "#DDD0C8",
          fill:  s <= Math.round(score) ? "#9B7485" : "none",
        }} />
      ))}
      <span className="mini-score">{score}</span>
    </span>
  );
}

function RecBadge({ rec }: { rec: string }) {
  const s = recStyle[rec] ?? recStyle["—"];
  return (
    <span className="rec-badge" style={{ background: s.bg, color: s.text }}>
      <span className="rec-dot" style={{ background: s.dot }} />{rec}
    </span>
  );
}

function RoundCell({ round, onView }: { round: RoundData; onView: () => void }) {
  if (round.status === "na") return <div className="round-na">—</div>;
  const sm = statusMeta[round.status];
  return (
    <div className="round-cell">
      <span className={`status-badge ${sm.cls}`}>{sm.icon}{sm.label}</span>
      <div className="round-interviewer">
        <div className="round-iavatar">{round.interviewerInitials}</div>
        <div>
          <div className="round-iname">{round.interviewer}</div>
          <div className="round-idate">{round.date}</div>
        </div>
      </div>
      <MiniStars score={round.rating} />
      {round.status === "completed" ? (
        <button className="btn-view-feedback" onClick={onView}>
          <MessageSquare size={11} /> View Feedback
        </button>
      ) : (
        <span className="round-no-feedback">
          {round.status === "scheduled" ? `Scheduled · ${round.date}` : "Awaiting schedule"}
        </span>
      )}
    </div>
  );
}

function FeedbackModal({ round, colLabel, candidate, onClose }: {
  round: RoundData; colLabel: string; candidate: CandidateFeedback; onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fb-modal" onClick={e => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div className="fb-modal-title-row">
            <div className="fb-avatar" style={{ background: candidate.color }}>{candidate.initials}</div>
            <div>
              <div className="fb-modal-name">{candidate.candidate}</div>
              <div className="fb-modal-sub">{candidate.role} · {colLabel} · {round.date}</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="fb-modal-body">
          <div className="fb-modal-overall">
            <div className="fb-modal-overall-left">
              <div className="fb-modal-rating-num">{round.rating || "—"}</div>
              {round.rating > 0 && (
                <span className="mini-stars" style={{ gap: 3 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={18} style={{
                      color: s <= Math.round(round.rating) ? "#9B7485" : "#DDD0C8",
                      fill:  s <= Math.round(round.rating) ? "#9B7485" : "none",
                    }} />
                  ))}
                </span>
              )}
              <div className="fb-modal-rating-label">Overall Rating</div>
            </div>
            <div className="fb-modal-overall-right">
              <div className="fb-modal-rec-label">Recommendation</div>
              <RecBadge rec={round.recommendation} />
              <div style={{ marginTop: 10 }}>
                <div className="fb-modal-rec-label">Interviewer</div>
                <div className="fb-interviewer-chip">
                  <div className="fb-iavatar-chip">{round.interviewerInitials}</div>
                  <span>{round.interviewer}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fb-modal-section">
            <div className="fb-modal-section-title">Interview Summary</div>
            <p className="fb-summary-text">{round.summary}</p>
          </div>
          {(round.strengths.length > 0 || round.improvements.length > 0) && (
            <div className="fb-modal-two-col">
              <div className="fb-modal-section">
                <div className="fb-modal-section-title">Strengths</div>
                <ul className="fb-bullet-list strengths">
                  {round.strengths.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div className="fb-modal-section">
                <div className="fb-modal-section-title">Areas to Improve</div>
                <ul className="fb-bullet-list improvements">
                  {round.improvements.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
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
  const [modal,          setModal]          = useState<{ candidate: CandidateFeedback; round: RoundData; colLabel: string } | null>(null);
  const [summaryModal,   setSummaryModal]   = useState<CandidateFeedback | null>(null);
  const [approvalState,  setApprovalState]  = useState<Record<number, "pending" | "approved" | "rejected">>(
    () => Object.fromEntries(feedbackData.map(f => [f.id, f.managerApprovalStatus]))
  );
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentId,    setSentId]    = useState<number | null>(null);

  // Derive unique roles and date buckets from data
  const allRoles = ["All Roles", ...Array.from(new Set(feedbackData.map(f => f.role))).sort()];
  const dateBuckets = ["Any Date", "Last 7 days", "Last 14 days", "Last 30 days"];

  // Parse date strings like "22 May 2026"
  function parseDateStr(d: string): Date | null {
    const months: Record<string, number> = {
      Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5,
      Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11
    };
    const parts = d.split(" ");
    if (parts.length !== 3) return null;
    const month = months[parts[1]];
    if (month === undefined) return null;
    return new Date(parseInt(parts[2]), month, parseInt(parts[0]));
  }

  const today = new Date(2026, 5, 9); // June 9 2026 — current date in app

  const filtered = feedbackData.filter(f => {
    const approval = approvalState[f.id] ?? "pending";

    // Approval filter
    if (approvalFilter === "Pending" && approval !== "pending")  return false;
    if (approvalFilter === "Sent"    && approval !== "approved") return false;

    // Round filter
    if (roundFilter === "Round 1"          && f.round1.status          !== "completed") return false;
    if (roundFilter === "Round 2"          && f.round2.status          !== "completed") return false;
    if (roundFilter === "Managerial Round" && f.managerialRound.status !== "completed") return false;
    if (roundFilter === "HR Round"         && f.hrRound.status         !== "completed") return false;

    // Job title filter
    if (jobFilter !== "All Roles" && f.role !== jobFilter) return false;

    // Date filter
    if (dateFilter !== "Any Date") {
      const d = parseDateStr(f.interviewDate);
      if (!d) return false;
      const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (dateFilter === "Last 7 days"  && diffDays > 7)  return false;
      if (dateFilter === "Last 14 days" && diffDays > 14) return false;
      if (dateFilter === "Last 30 days" && diffDays > 30) return false;
    }

    return true;
  });

  const anyFilterActive = roundFilter !== "All Rounds" || approvalFilter !== "All" ||
                          jobFilter !== "All Roles" || dateFilter !== "Any Date";

  function clearFilters() {
    setRoundFilter("All Rounds");
    setApprovalFilter("All");
    setJobFilter("All Roles");
    setDateFilter("Any Date");
  }

  function handleSendSummary(f: CandidateFeedback) {
    setSendingId(f.id);
    setTimeout(() => {
      setApprovalState(prev => ({ ...prev, [f.id]: "approved" }));
      setSendingId(null);
      setSentId(f.id);
      setTimeout(() => { setSentId(null); setSummaryModal(null); }, 1800);
    }, 1200);
  }

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interviewer Feedback</h1>
          <p className="page-sub">
            {feedbackData.length} candidates &middot; {feedbackData.filter(f => f.overallRecommendation === "Strong Hire").length} strong hires &middot; avg {(feedbackData.reduce((s, f) => s + f.overallRating, 0) / feedbackData.length).toFixed(1)}/5
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="fb-filters-bar">
        {/* Round */}
        <div className="fb-dropdown-group">
          <label className="fb-dropdown-label" htmlFor="round-filter">Round</label>
          <div className="fb-select-wrap">
            <select id="round-filter" className="fb-select" value={roundFilter}
              onChange={e => setRoundFilter(e.target.value)}>
              <option value="All Rounds">All Rounds</option>
              <option value="Round 1">Round 1</option>
              <option value="Round 2">Round 2</option>
              <option value="Managerial Round">Managerial Round</option>
              <option value="HR Round">HR Round</option>
            </select>
            <span className="fb-select-arrow">&#9660;</span>
          </div>
        </div>

        {/* Job Title */}
        <div className="fb-dropdown-group">
          <label className="fb-dropdown-label" htmlFor="job-filter">Job Title</label>
          <div className="fb-select-wrap">
            <select id="job-filter" className="fb-select" value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}>
              {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <span className="fb-select-arrow">&#9660;</span>
          </div>
        </div>

        {/* Date */}
        <div className="fb-dropdown-group">
          <label className="fb-dropdown-label" htmlFor="date-filter">Interview Date</label>
          <div className="fb-select-wrap">
            <select id="date-filter" className="fb-select" value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}>
              {dateBuckets.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="fb-select-arrow">&#9660;</span>
          </div>
        </div>

        {/* Manager Approval */}
        <div className="fb-dropdown-group">
          <label className="fb-dropdown-label" htmlFor="approval-filter">Approval Status</label>
          <div className="fb-select-wrap">
            <select id="approval-filter" className="fb-select" value={approvalFilter}
              onChange={e => setApprovalFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
            </select>
            <span className="fb-select-arrow">&#9660;</span>
          </div>
        </div>

        {/* Summary */}
        <div className="fb-filter-summary">
          Showing <strong>{filtered.length}</strong> of {feedbackData.length} candidates
          {roundFilter !== "All Rounds"  && <span className="fb-filter-tag">{roundFilter}</span>}
          {jobFilter   !== "All Roles"   && <span className="fb-filter-tag">{jobFilter}</span>}
          {dateFilter  !== "Any Date"    && <span className="fb-filter-tag">{dateFilter}</span>}
          {approvalFilter !== "All"      && <span className="fb-filter-tag">{approvalFilter}</span>}
          {anyFilterActive && (
            <button className="fb-clear-filter" onClick={clearFilters}>&#x2715; Clear all</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="fb-table-wrap">
        <div className="fb-scroll">
          <div className="fb-head">
            <div className="fbc fbc-candidate">Candidate</div>
            <div className="fbc fbc-interviewer">Interviewer</div>
            {ROUND_COLS.map(col => (
              <div key={col.key as string} className="fbc fbc-round">
                <span className="col-round-label">{col.shortLabel}</span>
                <span className="col-round-sublabel">{col.label.split(" — ")[1] || ""}</span>
              </div>
            ))}
            <div className="fbc fbc-approval">Manager Approval</div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
              No candidates match the selected filters.
            </div>
          )}

          {filtered.map(f => {
            const approval = approvalState[f.id] ?? "pending";
            return (
              <div key={f.id} className="fb-row">
                <div className="fbc fbc-candidate">
                  <div className="fb-avatar-sm" style={{ background: f.color }}>{f.initials}</div>
                  <div>
                    <div className="fb-cand-name">{f.candidate}</div>
                    <div className="fb-cand-role">{f.role}</div>
                  </div>
                </div>

                <div className="fbc fbc-interviewer">
                  <div className="fb-irow">
                    <div className="fb-iavatar">{f.round1.interviewerInitials}</div>
                    <div>
                      <div className="fb-iname">{f.round1.interviewer}</div>
                      <div className="fb-idate">{f.round1.date}</div>
                    </div>
                  </div>
                  <div className="fb-int-label"><User size={10} /> Technical Lead</div>
                </div>

                {ROUND_COLS.map(col => (
                  <div key={col.key as string} className="fbc fbc-round">
                    <RoundCell
                      round={f[col.key] as RoundData}
                      onView={() => setModal({ candidate: f, round: f[col.key] as RoundData, colLabel: col.label })}
                    />
                  </div>
                ))}

                <div className="fbc fbc-approval">
                  {approval === "approved" ? (
                    <div className="approval-sent-status">
                      <CheckCircle size={14} color="#2a7a4a" />
                      <span>Summary sent to manager</span>
                    </div>
                  ) : (
                    <button className="btn-approve" onClick={() => setSummaryModal(f)}>
                      <MessageSquare size={12} /> Review &amp; Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modal && (
        <FeedbackModal
          round={modal.round}
          colLabel={modal.colLabel}
          candidate={modal.candidate}
          onClose={() => setModal(null)}
        />
      )}

      {summaryModal && (
        <div className="modal-overlay" onClick={() => setSummaryModal(null)}>
          <div className="fb-modal fb-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="fb-modal-header">
              <div className="fb-modal-title-row">
                <div className="fb-avatar" style={{ background: summaryModal.color }}>{summaryModal.initials}</div>
                <div>
                  <div className="fb-modal-name">{summaryModal.candidate} — Interview Summary</div>
                  <div className="fb-modal-sub">{summaryModal.role} &middot; All Rounds &middot; For Manager Approval</div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSummaryModal(null)}><X size={18} /></button>
            </div>
            <div className="fb-modal-body">
              <div className="summary-banner">
                <div className="summary-banner-left">
                  <div className="summary-banner-label">Overall Recommendation</div>
                  <RecBadge rec={summaryModal.overallRecommendation} />
                </div>
                <div className="summary-banner-right">
                  <div className="summary-banner-label">Avg Rating</div>
                  <MiniStars score={summaryModal.overallRating} />
                </div>
              </div>

              {ROUND_COLS.map(col => {
                const r = summaryModal[col.key] as RoundData;
                if (r.status === "na" || r.status === "pending") return null;
                return (
                  <div key={col.key as string} className="summary-round-block">
                    <div className="summary-round-header">
                      <div className="summary-round-title">
                        {r.status === "completed"
                          ? <CheckCircle size={14} color="#8DB89A" />
                          : <Clock size={14} color="#E8806A" />}
                        <span>{col.label}</span>
                      </div>
                      <div className="summary-round-meta">
                        <div className="fb-irow" style={{ gap: 6 }}>
                          <div className="fb-iavatar" style={{ width: 22, height: 22, fontSize: 8 }}>{r.interviewerInitials}</div>
                          <span style={{ fontSize: 12, color: "var(--text-sm)", fontWeight: 600 }}>{r.interviewer}</span>
                        </div>
                        <MiniStars score={r.rating} />
                        {r.recommendation !== "—" && <RecBadge rec={r.recommendation} />}
                      </div>
                    </div>
                    {r.status === "completed" && (
                      <>
                        <p className="fb-summary-text">{r.summary}</p>
                        <div className="fb-modal-two-col" style={{ marginTop: 8 }}>
                          {r.strengths.length > 0 && (
                            <div>
                              <div className="fb-modal-section-title">Strengths</div>
                              <ul className="fb-bullet-list strengths">
                                {r.strengths.map(s => <li key={s}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                          {r.improvements.length > 0 && (
                            <div>
                              <div className="fb-modal-section-title">Areas to Improve</div>
                              <ul className="fb-bullet-list improvements">
                                {r.improvements.map(s => <li key={s}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="fb-modal-footer">
              <button className="btn-outline" onClick={() => setSummaryModal(null)}>Cancel</button>
              <button
                className={`btn-approve-send ${sentId === summaryModal.id ? "sent" : ""}`}
                onClick={() => handleSendSummary(summaryModal)}
                disabled={sendingId === summaryModal.id || sentId === summaryModal.id}
              >
                {sentId === summaryModal.id
                  ? <><CheckCircle size={14} /> Approved &amp; Sent!</>
                  : sendingId === summaryModal.id
                  ? <><span className="btn-spinner" /> Sending...</>
                  : <><MessageSquare size={14} /> Approve &amp; Send Summary</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
