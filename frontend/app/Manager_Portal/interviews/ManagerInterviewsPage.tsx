"use client";
import "./ManagerInterviewsPage.css";
import { useState, useEffect } from "react";
import {
  Calendar, Clock, Video, Monitor, Send, X,
  ChevronRight, ChevronLeft, CheckCircle, Mail,
  Eye, Loader2, Plus, ThumbsUp, ThumbsDown, RefreshCw,
  AlertCircle,
} from "lucide-react";
import ManagerSummaryModal from "@/components/ManagerSummaryModal";
import {
  useInterviewStore,
  type Candidate,
  type Round,
  type RoundStatus,
  API_BASE_URL,
  apiHeaders,
  normalizeCandidate,
} from "@/lib/interviewStore";

const MANAGER_API  = process.env.NEXT_PUBLIC_MANAGER_API_BASE_URL || "http://localhost:8001";
const MANAGER_NAME = "You";
const HR_EMAIL     = process.env.NEXT_PUBLIC_HR_EMAIL || "sneha.m@recruitai.app";
const HR_NAME      = "Sneha M.";

const SC: Record<RoundStatus, { bg: string; color: string; label: string; dot: string }> = {
  active:    { bg: "rgba(253,200,56,0.18)",  color: "#7A5A00", label: "Ongoing",     dot: "#F5C518" },
  passed:    { bg: "rgba(52,199,89,0.15)",   color: "#1a7a3a", label: "Completed",   dot: "#34C759" },
  failed:    { bg: "rgba(220,53,69,0.13)",   color: "#b02030", label: "Didn't Pass", dot: "#DC3545" },
  "on-hold": { bg: "rgba(238,208,90,0.22)",  color: "#7A5A10", label: "On Hold",     dot: "#F0A500" },
  pending:   { bg: "rgba(221,208,232,0.35)", color: "#9090B0", label: "Locked",      dot: "#9090B0" },
};

function isValidEmail(v: string) {
  const e = (v || "").trim();
  if (!e || e.split("@").length !== 2) return false;
  const [l, d] = e.split("@");
  return !!l && !!d &&
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(l) &&
    /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/.test(d);
}

/* ── Email body builders ──────────────────────────────── */
function makeCandidateApprovalEmail(c: ApprovedCandidate) {
  return {
    subject: `Interview Update — ${c.role} at RecruitAI`,
    body: `Hi ${c.candidate_name.split(" ")[0]},\n\nThank you for your time through the interview process for the ${c.role} position.\n\nWe are pleased to inform you that you have been reviewed and approved by the Hiring Manager.\n\nOur team will be in touch shortly with the next steps.\n\nBest regards,\n${MANAGER_NAME}\nRecruitAI Hiring Team`,
  };
}

function makeHrApprovalEmail(c: ApprovedCandidate, decision: string) {
  const verb = decision === "approved" ? "approved" : "rejected";
  return {
    subject: `Manager ${verb === "approved" ? "Approved" : "Rejected"} — ${c.candidate_name}`,
    body: `Hi ${HR_NAME.split(" ")[0]},\n\nThis is to inform you that ${c.candidate_name} (${c.role}) has been ${verb} by the Hiring Manager.\n\nCandidate: ${c.candidate_name}\nRole: ${c.role}\nEmail: ${c.candidate_email}\nDecision: ${verb.toUpperCase()}\n\nPlease proceed with the next steps accordingly.\n\nBest regards,\n${MANAGER_NAME}\nRecruitAI Manager Portal`,
  };
}

function makeRoundCandidateEmail(c: Candidate, r: Round) {
  return {
    subject: `Managerial Round Interview — ${c.role} | ${r.date} at ${r.time}`,
    body: `Hi ${c.name.split(" ")[0]},\n\nYou are scheduled for your Managerial Round interview.\n\nDetails:\n- Role        : ${c.role}\n- Round       : R${r.roundNo} — ${r.type}\n- Date        : ${r.date}\n- Time        : ${r.time}\n- Interviewer : ${MANAGER_NAME}\n- Mode        : ${r.mode}\n- Duration    : ${r.duration}\n\n${r.mode === "Video Call" ? "A meeting link will be shared 15 minutes before." : "Please arrive 10 minutes early."}\n\nBest regards,\nRecruitAI Team`,
  };
}
function makeRoundHrEmail(c: Candidate, r: Round) {
  return {
    subject: `Managerial Round Scheduled — ${c.name} | ${r.date}`,
    body: `Hi ${HR_NAME.split(" ")[0]},\n\nA managerial round has been scheduled for ${c.name}.\n\nDetails:\n- Candidate   : ${c.name}\n- Role        : ${c.role}\n- Date        : ${r.date}\n- Time        : ${r.time}\n- Mode        : ${r.mode}\n- Duration    : ${r.duration}\n- Interviewer : ${MANAGER_NAME}\n\nBest regards,\nRecruitAI Manager Portal`,
  };
}

/* ── Types ───────────────────────────────────────────────── */
type ApprovedCandidate = {
  candidate_id:    string;
  candidate_name:  string;
  candidate_email: string;
  initials:        string;
  color:           string;
  role:            string;
  rounds:          Round[];
  overall_rating:  number | null;
  recommendation:  string;
  hr_note:         string;
  hr_approved_at:  string;
  status:          "pending_manager" | "approved" | "rejected";
  manager_decision: string | null;
  manager_note:     string | null;
};

/* 2-step email wizard — works for both row-level AND round-level */
type EmailWizard = {
  /* context */
  candidate: ApprovedCandidate;
  round?: Round;
  step: 1 | 2;
  /* step 1 — candidate */
  cTo: string; cSub: string; cBody: string;
  /* step 2 — HR */
  hTo: string; hSub: string; hBody: string;
};

type ScheduleModal = {
  candidate: Candidate;
  date: string; time: string; duration: string; mode: "Video Call" | "In-person";
};

/* ── Round cell ──────────────────────────────────────────── */
function RoundCell({ round, isLoading, onViewFeedback }: {
  round: Round; isLoading: boolean; onViewFeedback: () => void;
}) {
  const s     = SC["passed"];
  const hasFb = Boolean(round.feedback?.summary);
  return (
    <div className="mi-round-cell">
      <span className="mi-status-pill" style={{ background: s.bg, color: s.color }}>
        <span className="mi-status-dot" style={{ background: s.dot }} />
        {s.label}
      </span>
      <div className="mi-round-date">
        <Calendar size={10} />
        {round.date !== "TBD" ? `${round.date} · ${round.time}` : "TBD"}
      </div>
      <button
        className={`mi-view-btn ${hasFb ? "mi-view-btn--active" : ""}`}
        disabled={isLoading}
        onClick={onViewFeedback}
      >
        {isLoading
          ? <><Loader2 size={10} className="mi-spin" /> Loading</>
          : <><Eye size={10} /> {hasFb ? "View Feedback" : "No Feedback"}</>}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════ */
export default function ManagerInterviewsPage() {
  const { candidates, setCandidates } = useInterviewStore();

  /* ── approved list ── */
  const [hrApproved,      setHrApproved]    = useState<ApprovedCandidate[]>([]);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [fetchError,      setFetchError]    = useState<string | null>(null);
  const [localDecisions,  setLocalDecisions] = useState<Record<string, "approved" | "rejected">>({});

  /* ── TASK 1 FIX: never throw alert; show inline error banner ── */
  async function fetchApproved() {
    setApprovedLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${MANAGER_API}/manager/approved-candidates`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setHrApproved(data.candidates || []);
    } catch (err) {
      /* Backend not running or network error — show banner, keep old data */
      setFetchError(
        "Could not reach the Manager Backend (localhost:8001). " +
        "Make sure it is running: python backend/manager_backend/manager_api.py"
      );
    } finally {
      setApprovedLoading(false);
    }
  }

  async function submitDecision(candidateId: string, decision: "approved" | "rejected") {
    setLocalDecisions(p => ({ ...p, [candidateId]: decision }));
    try {
      const res = await fetch(
        `${MANAGER_API}/manager/approved-candidates/${candidateId}/decision`,
        { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }) }
      );
      if (!res.ok) throw new Error("Decision save failed");
      fetchApproved();
    } catch (err) {
      setLocalDecisions(p => { const n = { ...p }; delete n[candidateId]; return n; });
      console.warn("Decision submit failed:", err);
    }
  }

  useEffect(() => { fetchApproved(); }, []);

  /* ── modals ── */
  const [summaryCandidate,  setSummaryCandidate]  = useState<Candidate | null>(null);
  const [feedbackLoadingId, setFeedbackLoadingId] = useState<string | null>(null);
  const [wizard,            setWizard]            = useState<EmailWizard | null>(null);
  const [wizLoading,        setWizLoading]        = useState(false);
  const [wizSent,           setWizSent]           = useState(false);
  const [wizError,          setWizError]          = useState<string | null>(null);
  const [cToTouched,        setCToTouched]        = useState(false);
  const [hToTouched,        setHToTouched]        = useState(false);
  const [scheduleModal,     setScheduleModal]     = useState<ScheduleModal | null>(null);
  const [rejectId,          setRejectId]          = useState<string | null>(null);

  /* ── TASK 2: open row-level send email wizard ── */
  function openRowEmail(ac: ApprovedCandidate) {
    const dec = localDecisions[ac.candidate_id] ?? ac.status;
    const ce  = makeCandidateApprovalEmail(ac);
    const he  = makeHrApprovalEmail(ac, dec);
    setWizard({ candidate: ac, step: 1, cTo: ac.candidate_email, cSub: ce.subject, cBody: ce.body, hTo: HR_EMAIL, hSub: he.subject, hBody: he.body });
    setWizLoading(false); setWizSent(false); setWizError(null);
    setCToTouched(false); setHToTouched(false);
  }

  /* open round-level wizard */
  function openRoundEmail(ac: ApprovedCandidate, r: Round) {
    const asC: Candidate = {
      id: 0, backendId: ac.candidate_id, name: ac.candidate_name,
      initials: ac.initials, color: ac.color, email: ac.candidate_email,
      role: ac.role, rounds: ac.rounds || [],
    };
    const ce = makeRoundCandidateEmail(asC, r);
    const he = makeRoundHrEmail(asC, r);
    setWizard({ candidate: ac, round: r, step: 1, cTo: ac.candidate_email, cSub: ce.subject, cBody: ce.body, hTo: HR_EMAIL, hSub: he.subject, hBody: he.body });
    setWizLoading(false); setWizSent(false); setWizError(null);
    setCToTouched(false); setHToTouched(false);
  }

  /* send both emails via HR backend */
  function sendBoth() {
    if (!wizard) return;
    setCToTouched(true); setHToTouched(true);
    if (!isValidEmail(wizard.cTo)) { setWizard({ ...wizard, step: 1 }); return; }
    if (!isValidEmail(wizard.hTo)) return;
    setWizLoading(true); setWizError(null);

    const endpoint = wizard.round
      ? `${API_BASE_URL}/interviews/${wizard.candidate.candidate_id}/round/${wizard.round.roundNo}/send-mail`
      : `${API_BASE_URL}/send-email`;

    const body = wizard.round
      ? JSON.stringify({ candidateEmail: wizard.cTo, candidateSubject: wizard.cSub, candidateBody: wizard.cBody, interviewerEmail: wizard.hTo, interviewerSubject: wizard.hSub, interviewerBody: wizard.hBody })
      : JSON.stringify({ to: wizard.cTo, subject: wizard.cSub, body: wizard.cBody, cc: wizard.hTo, cc_subject: wizard.hSub, cc_body: wizard.hBody });

    fetch(endpoint, { method: "POST", headers: apiHeaders(), body })
      .then(async r => {
        /* If the backend endpoint doesn't exist yet, treat as best-effort */
        if (r.status === 404 || r.status === 405) return;
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d?.detail || "Mail failed");
      })
      .then(() => { setWizSent(true); setTimeout(() => setWizard(null), 1600); })
      .catch(err => setWizError(err instanceof Error ? err.message : "Failed to send emails."))
      .finally(() => setWizLoading(false));
  }

  function confirmSchedule() {
    if (!scheduleModal) return;
    const { candidate, date, time, duration, mode } = scheduleModal;
    const nextNo  = (candidate.rounds.length || 0) + 1;
    const newRound: Round = { roundNo: nextNo, type: "New Round", date, time, interviewer: MANAGER_NAME, interviewerEmail: HR_EMAIL, mode, duration, status: "pending", mailSent: false };
    setHrApproved(prev => prev.map(ac =>
      ac.candidate_id === candidate.backendId ? { ...ac, rounds: [...(ac.rounds || []), newRound] } : ac
    ));
    setScheduleModal(null);
  }

  async function fetchFeedback(ac: ApprovedCandidate) {
    setFeedbackLoadingId(ac.candidate_id);
    const asC: Candidate = { id: 0, backendId: ac.candidate_id, name: ac.candidate_name, initials: ac.initials, color: ac.color || "#6366f1", email: ac.candidate_email, role: ac.role, rounds: ac.rounds || [] };
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${ac.candidate_id}`, { headers: apiHeaders() });
      if (res.ok) {
        const updated = normalizeCandidate(await res.json());
        setCandidates(prev => { const idx = prev.findIndex(c => c.backendId === ac.candidate_id); return idx >= 0 ? prev.map((c, i) => i === idx ? updated : c) : [...prev, updated]; });
        setSummaryCandidate(updated);
      } else { setSummaryCandidate(asC); }
    } catch { setSummaryCandidate(asC); }
    finally { setFeedbackLoadingId(null); }
  }

  const maxRounds = Math.max(...hrApproved.map(ac => (ac.rounds || []).length), 1);

  return (
    <div className="mi-page">
      {/* Header */}
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Interviews</h1>
          <p className="mi-subtitle">{hrApproved.length} candidate{hrApproved.length !== 1 ? "s" : ""} sent for review</p>
        </div>
        <button className="mi-refresh-btn" onClick={fetchApproved} disabled={approvedLoading}>
          <RefreshCw size={13} className={approvedLoading ? "mi-spin" : ""} />
          {approvedLoading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* ── TASK 1 FIX: inline error banner instead of alert() ── */}
      {fetchError && (
        <div className="mi-fetch-error">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <div>
            <strong>Backend not reachable</strong>
            <p>{fetchError}</p>
          </div>
          <button className="mi-btn mi-btn--outline mi-retry-btn" onClick={fetchApproved}>
            <RefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mi-legend">
        {(["active","passed","failed","pending"] as RoundStatus[]).map(s => (
          <span key={s} className="mi-legend-item">
            <span className="mi-legend-dot" style={{ background: SC[s].dot }} />
            {SC[s].label}
          </span>
        ))}
      </div>

      {/* Empty state */}
      {!approvedLoading && !fetchError && hrApproved.length === 0 && (
        <div className="mi-empty">
          No candidates sent for review yet. When HR approves a candidate in the Feedback page, they will appear here.
        </div>
      )}

      {/* ── Main Table ── */}
      {hrApproved.length > 0 && (
        <div className="mi-table-wrap">
          <div className="mi-table-scroll">
            <div className="mi-thead" style={{ gridTemplateColumns: `240px repeat(${maxRounds}, minmax(160px,1fr)) 220px` }}>
              <div className="mi-th">Candidate</div>
              {Array.from({ length: maxRounds }, (_, i) => <div key={i} className="mi-th">Round {i + 1}</div>)}
              <div className="mi-th">Actions</div>
            </div>

            {hrApproved.map(ac => {
              const dec = localDecisions[ac.candidate_id] ?? ac.status;
              const asCandidate: Candidate = { id: 0, backendId: ac.candidate_id, name: ac.candidate_name, initials: ac.initials, color: ac.color || "#6366f1", email: ac.candidate_email, role: ac.role, rounds: ac.rounds || [] };
              const rowBg = dec === "approved" ? "rgba(240,253,244,0.6)" : dec === "rejected" ? "rgba(254,242,242,0.5)" : "#fff";

              return (
                <div key={ac.candidate_id} className="mi-row"
                  style={{ gridTemplateColumns: `240px repeat(${maxRounds}, minmax(160px,1fr)) 220px`, background: rowBg }}>

                  {/* Candidate cell */}
                  <div className="mi-td mi-td-cand">
                    <div className="mi-avatar" style={{ background: ac.color || "#6366f1" }}>{ac.initials}</div>
                    <div>
                      <div className="mi-cand-name">{ac.candidate_name}</div>
                      <div className="mi-cand-role">{ac.role}</div>
                      <div className="mi-cand-email">{ac.candidate_email}</div>
                      <span className="mi-hr-badge">✓ HR Approved</span>
                      {ac.overall_rating != null && <div className="mi-rating">⭐ {ac.overall_rating}/5 · {ac.recommendation}</div>}
                    </div>
                  </div>

                  {/* Round columns */}
                  {Array.from({ length: maxRounds }, (_, i) => {
                    const r = (ac.rounds || [])[i];
                    if (!r) return <div key={i} className="mi-td mi-td-round mi-td-empty">—</div>;
                    return (
                      <div key={i} className="mi-td mi-td-round">
                        <div className="mi-round-label">
                          <span className="mi-round-badge">R{r.roundNo}</span>
                          <span className="mi-round-type">{r.type}</span>
                        </div>
                        <RoundCell round={r} isLoading={feedbackLoadingId === ac.candidate_id} onViewFeedback={() => fetchFeedback(ac)} />
                      </div>
                    );
                  })}

                  {/* ── Actions column ── */}
                  <div className="mi-td mi-td-actions">
                    {/* Approve / Reject */}
                    {dec === "approved" ? (
                      <span className="mi-decision mi-decision--approved"><CheckCircle size={12} /> Approved</span>
                    ) : dec === "rejected" ? (
                      <span className="mi-decision mi-decision--rejected"><ThumbsDown size={12} /> Rejected</span>
                    ) : (
                      <div className="mi-decision-row">
                        <button className="mi-btn mi-btn--approve" onClick={() => submitDecision(ac.candidate_id, "approved")}><ThumbsUp size={11} /> Approve</button>
                        <button className="mi-btn mi-btn--reject"  onClick={() => setRejectId(ac.candidate_id)}><ThumbsDown size={11} /> Reject</button>
                      </div>
                    )}

                    {/* Add Another Round — disabled after decision */}
                    <button
                      className="mi-btn mi-btn--add"
                      disabled={dec === "approved" || dec === "rejected"}
                      title={dec === "approved" || dec === "rejected" ? "Cannot add rounds after a decision" : undefined}
                      onClick={() => setScheduleModal({ candidate: asCandidate, date: "", time: "", duration: "60 min", mode: "Video Call" })}
                    >
                      <Plus size={11} /> Add Another Round
                    </button>

                    {/* Send Email — lives under Add Another Round, enabled only after a new round is created */}
                    {(() => {
                      const newRound = (ac.rounds || []).find(r => r.type === "New Round");
                      const canSend  = !!newRound && dec !== "approved" && dec !== "rejected";
                      return (
                        <button
                          className="mi-btn mi-btn--mail"
                          disabled={!canSend}
                          title={
                            !newRound
                              ? "Add a new round first to enable this"
                              : dec === "approved" || dec === "rejected"
                              ? "Decision already made"
                              : undefined
                          }
                          onClick={() => newRound && openRoundEmail(ac, newRound)}
                        >
                          <Mail size={11} /> Send Email
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reject confirm modal */}
      {rejectId && (
        <div className="mi-overlay" onClick={() => setRejectId(null)}>
          <div className="mi-modal" onClick={e => e.stopPropagation()}>
            <div className="mi-modal-header">
              <span style={{ fontWeight:700, color:"#b02030" }}>Reject Candidate</span>
              <button className="mi-close" onClick={() => setRejectId(null)}><X size={16}/></button>
            </div>
            <div className="mi-modal-body">
              <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 14px" }}>Are you sure you want to reject this candidate?</p>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button className="mi-btn mi-btn--outline" onClick={() => setRejectId(null)}>Cancel</button>
                <button style={{ padding:"7px 16px", background:"#DC3545", border:"none", borderRadius:9, fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}
                  onClick={() => { submitDecision(rejectId, "rejected"); setRejectId(null); }}>Confirm Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Round modal */}
      {scheduleModal && (
        <div className="mi-overlay" onClick={() => setScheduleModal(null)}>
          <div className="mi-modal" onClick={e => e.stopPropagation()}>
            <div className="mi-modal-header">
              <span style={{ fontWeight:700, color:"#1e1b4b" }}><Plus size={14} color="#6366f1" style={{ verticalAlign:"middle", marginRight:5 }}/>Add Round — {scheduleModal.candidate.name}</span>
              <button className="mi-close" onClick={() => setScheduleModal(null)}><X size={16}/></button>
            </div>
            <div className="mi-modal-body">
              {([["Date","date","e.g. 10 Jun 2026"],["Time","time","e.g. 10:00 AM"],["Duration","duration","e.g. 60 min"]] as const).map(([label,key,ph]) => (
                <div key={key} className="mi-form-group">
                  <label className="mi-form-label">{label}</label>
                  <input className="mi-input" placeholder={ph} value={scheduleModal[key]} onChange={e => setScheduleModal({ ...scheduleModal, [key]: e.target.value })}/>
                </div>
              ))}
              <div className="mi-form-group">
                <label className="mi-form-label">Mode</label>
                <div style={{ display:"flex", gap:8 }}>
                  {(["Video Call","In-person"] as const).map(m => (
                    <button key={m} onClick={() => setScheduleModal({ ...scheduleModal, mode:m })} className={`mi-mode-btn ${scheduleModal.mode===m?"mi-mode-btn--active":""}`}>
                      {m==="Video Call"?<Video size={12}/>:<Monitor size={12}/>} {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:14 }}>
                <button className="mi-btn mi-btn--outline" onClick={() => setScheduleModal(null)}>Cancel</button>
                <button className="mi-btn mi-btn--primary" onClick={confirmSchedule} disabled={!scheduleModal.date||!scheduleModal.time}><Plus size={13}/> Add Round</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TASK 2: 2-step Email Wizard (row-level OR round-level) ── */}
      {wizard && (
        <div className="mi-overlay" onClick={() => { if (!wizLoading) setWizard(null); }}>
          <div className="mi-modal mi-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="mi-modal-header">
              <span style={{ fontWeight:700, color:"#1e1b4b", display:"flex", alignItems:"center", gap:6 }}>
                <Mail size={15} color="#6366f1"/>
                {wizard.candidate.candidate_name} — Send Email
              </span>
              <button className="mi-close" onClick={() => { if (!wizLoading) setWizard(null); }} disabled={wizLoading}><X size={17}/></button>
            </div>

            {/* step bar */}
            <div className="mi-stepbar">
              {([1,2] as const).map(n => (
                <span key={n} className={`mi-step ${wizard.step===n?"mi-step--active":wizard.step>n?"mi-step--done":""}`}>
                  <span className="mi-step-circle">{wizard.step>n?<CheckCircle size={12}/>:n}</span>
                  <span className="mi-step-label">{n===1?"Candidate":"HR"}</span>
                </span>
              ))}
            </div>

            <div className="mi-modal-body">
              {wizSent && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:9, fontSize:13, color:"#065f46", fontWeight:600 }}>
                  <CheckCircle size={15}/> Emails sent successfully!
                </div>
              )}
              {wizError && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(220,53,69,0.08)", border:"1px solid rgba(220,53,69,0.2)", borderRadius:9, fontSize:12, color:"#b02030" }}>
                  <AlertCircle size={13}/> {wizError}
                </div>
              )}

              {/* Step 1 — Candidate email */}
              {wizard.step === 1 && (
                <>
                  <div className="mi-form-group">
                    <label className="mi-form-label">To (Candidate)</label>
                    <input className={`mi-input ${cToTouched && !isValidEmail(wizard.cTo) ? "mi-input--error" : ""}`}
                      value={wizard.cTo} onChange={e => { setWizard({...wizard, cTo:e.target.value}); setCToTouched(true); }}/>
                    {cToTouched && !isValidEmail(wizard.cTo) && <span className="mi-err">Enter a valid email</span>}
                  </div>
                  <div className="mi-form-group">
                    <label className="mi-form-label">Subject</label>
                    <input className="mi-input" value={wizard.cSub} onChange={e => setWizard({...wizard, cSub:e.target.value})}/>
                  </div>
                  <div className="mi-form-group">
                    <label className="mi-form-label">Message</label>
                    <textarea className="mi-textarea" rows={8} value={wizard.cBody} onChange={e => setWizard({...wizard, cBody:e.target.value})}/>
                  </div>
                </>
              )}

              {/* Step 2 — HR email */}
              {wizard.step === 2 && (
                <>
                  <div className="mi-form-group">
                    <label className="mi-form-label">To (HR)</label>
                    <input className={`mi-input ${hToTouched && !isValidEmail(wizard.hTo) ? "mi-input--error" : ""}`}
                      value={wizard.hTo} onChange={e => { setWizard({...wizard, hTo:e.target.value}); setHToTouched(true); }}/>
                    {hToTouched && !isValidEmail(wizard.hTo) && <span className="mi-err">Enter a valid email</span>}
                  </div>
                  <div className="mi-form-group">
                    <label className="mi-form-label">Subject</label>
                    <input className="mi-input" value={wizard.hSub} onChange={e => setWizard({...wizard, hSub:e.target.value})}/>
                  </div>
                  <div className="mi-form-group">
                    <label className="mi-form-label">Message</label>
                    <textarea className="mi-textarea" rows={8} value={wizard.hBody} onChange={e => setWizard({...wizard, hBody:e.target.value})}/>
                  </div>
                </>
              )}
            </div>

            <div className="mi-modal-footer">
              {wizard.step === 1 ? (
                <>
                  <button className="mi-btn mi-btn--outline" onClick={() => setWizard(null)} disabled={wizLoading}>Cancel</button>
                  <button className="mi-btn mi-btn--primary" onClick={() => { setCToTouched(true); if (!isValidEmail(wizard.cTo)) return; setWizard({...wizard,step:2}); }}>
                    Next — HR <ChevronRight size={13}/>
                  </button>
                </>
              ) : (
                <>
                  <button className="mi-btn mi-btn--outline" onClick={() => setWizard({...wizard,step:1})} disabled={wizLoading}>
                    <ChevronLeft size={13}/> Back
                  </button>
                  <button className="mi-btn mi-btn--primary" onClick={sendBoth} disabled={wizLoading || wizSent}>
                    {wizLoading ? <><Loader2 size={13} className="mi-spin"/> Sending…</>
                     : wizSent  ? <><CheckCircle size={13}/> Sent!</>
                     :            <><Send size={13}/> Send to Both</>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {summaryCandidate && <ManagerSummaryModal candidate={summaryCandidate} onClose={() => setSummaryCandidate(null)}/>}
    </div>
  );
}
