"use client";
import "./InterviewsPage.css";
import { useState, useMemo } from "react";
import {
  Calendar, Video, Monitor, Plus, Bell, Send,
  X, ChevronRight, ChevronLeft, CheckCircle, Mail, Lock,
  Search, User, Pencil, Trash2, Clock, Briefcase,
} from "lucide-react";
import { useInterviewStore, type Candidate, type Round, type RoundStatus } from "@/lib/interviewStore";

/* ── Status config ──────────────────────────────────────── */
const SC: Record<RoundStatus, { bg: string; color: string; label: string }> = {
  active:    { bg:"rgba(253,200,56,0.2)",   color:"#7A5A00", label:"Ongoing"     },
  passed:    { bg:"rgba(52,199,89,0.15)",   color:"#1a7a3a", label:"Completed"   },
  failed:    { bg:"rgba(220,53,69,0.13)",   color:"#b02030", label:"Didn't Pass" },
  "on-hold": { bg:"rgba(238,208,90,0.22)",  color:"#7A5A10", label:"On Hold"     },
  pending:   { bg:"rgba(221,208,232,0.3)",  color:"#9090B0", label:"Locked"      },
};

/* ── Email templates ────────────────────────────────────── */
function makeCandidateEmail(c: Candidate, r: Round) {
  return {
    subject: `Round ${r.roundNo} Interview — ${c.role} | ${r.date} at ${r.time}`,
    body: `Hi ${c.name.split(" ")[0]},\n\nYou are scheduled for Round ${r.roundNo} (${r.type}) interview.\n\nDetails:\n- Role        : ${c.role}\n- Round       : ${r.roundNo} — ${r.type}\n- Date        : ${r.date}\n- Time        : ${r.time}\n- Interviewer : ${r.interviewer}\n- Mode        : ${r.mode}\n- Duration    : ${r.duration}\n\n${r.mode==="Video Call"?"A Google Meet link will be shared 15 minutes before.":"Please arrive 10 minutes early at our office."}\n\nBest regards,\nPriya R. | RecruitAI`,
  };
}
function makeInterviewerEmail(c: Candidate, r: Round) {
  return {
    subject: `Round ${r.roundNo} Interview — ${c.name} | ${r.date}`,
    body: `Hi ${r.interviewer.split(" ")[0]},\n\nYou are conducting Round ${r.roundNo} (${r.type}) for ${c.name}.\n\nDetails:\n- Candidate   : ${c.name}\n- Role        : ${c.role}\n- Date        : ${r.date}\n- Time        : ${r.time}\n- Mode        : ${r.mode}\n- Duration    : ${r.duration}\n\n${r.mode==="Video Call"?"Please share Google Meet link 15 min before.":"Please be present 5 min early."}\n\nBest regards,\nPriya R. | RecruitAI`,
  };
}

/* ── Types ──────────────────────────────────────────────── */
type WizardState = { candidate: Candidate; round: Round; step: 1|2; cSub: string; cBody: string; iSub: string; iBody: string };
type ResultTarget = { candidateId: number; roundNo: number } | null;

// Fields editable on a round
type RoundTextField = "type" | "date" | "time" | "interviewer" | "duration";
type EditTarget =
  | { kind: "round-text"; candidateId: number; roundNo: number; field: RoundTextField }
  | { kind: "candidate-role"; candidateId: number };

/* ── Component ──────────────────────────────────────────── */
export default function InterviewsPage() {
  const { candidates, setCandidates, addRound, removeRound } = useInterviewStore();

  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [stageFilter,  setStageFilter]  = useState("All");
  const [expandedId,   setExpandedId]   = useState<number | null>(null);
  const [wizard,       setWizard]       = useState<WizardState | null>(null);
  const [wizSent,      setWizSent]      = useState(false);
  const [resultTarget, setResultTarget] = useState<ResultTarget>(null);

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editValue,  setEditValue]  = useState("");

  /* ── Edit helpers ── */
  function startRoundEdit(candidateId: number, roundNo: number, field: RoundTextField, current: string, e: React.MouseEvent) {
    e.stopPropagation();
    setEditTarget({ kind: "round-text", candidateId, roundNo, field });
    setEditValue(current);
  }

  function startRoleEdit(candidateId: number, current: string, e: React.MouseEvent) {
    e.stopPropagation();
    setEditTarget({ kind: "candidate-role", candidateId });
    setEditValue(current);
  }

  function commitEdit() {
    if (!editTarget) return;
    const v = editValue.trim();
    if (!v) { setEditTarget(null); return; }

    if (editTarget.kind === "candidate-role") {
      setCandidates(prev => prev.map(c => c.id === editTarget.candidateId ? { ...c, role: v } : c));
    } else {
      const { candidateId, roundNo, field } = editTarget;
      setCandidates(prev => prev.map(c => c.id !== candidateId ? c : {
        ...c,
        rounds: c.rounds.map(r => r.roundNo === roundNo ? { ...r, [field]: v } : r),
      }));
    }
    setEditTarget(null);
  }

  function toggleMode(candidateId: number, roundNo: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCandidates(prev => prev.map(c => c.id !== candidateId ? c : {
      ...c,
      rounds: c.rounds.map(r => r.roundNo === roundNo
        ? { ...r, mode: r.mode === "Video Call" ? "In-person" : "Video Call" }
        : r
      ),
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter")  commitEdit();
    if (e.key === "Escape") setEditTarget(null);
  }

  /* ── Inline text field ── */
  function EditText({
    candidateId, roundNo, field, value, placeholder, wide = false,
  }: {
    candidateId: number; roundNo: number; field: RoundTextField;
    value: string; placeholder?: string; wide?: boolean;
  }) {
    const active = editTarget?.kind === "round-text"
      && editTarget.candidateId === candidateId
      && editTarget.roundNo === roundNo
      && editTarget.field === field;

    if (active) {
      return (
        <input
          className={`exp-field-input ${wide ? "exp-field-input-wide" : ""}`}
          value={editValue}
          placeholder={placeholder}
          autoFocus
          onChange={e => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
        />
      );
    }
    return (
      <button
        className="exp-field-btn"
        onClick={e => startRoundEdit(candidateId, roundNo, field, value, e)}
        title={`Edit ${field}`}
      >
        <span>{value || placeholder}</span>
        <Pencil size={9} className="edit-pencil" />
      </button>
    );
  }

  /* ── Role editable text ── */
  function EditRole({ candidateId, value }: { candidateId: number; value: string }) {
    const active = editTarget?.kind === "candidate-role" && editTarget.candidateId === candidateId;
    if (active) {
      return (
        <input
          className="exp-field-input exp-field-input-wide"
          value={editValue}
          autoFocus
          onChange={e => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
        />
      );
    }
    return (
      <button
        className="exp-field-btn exp-role-btn"
        onClick={e => startRoleEdit(candidateId, value, e)}
        title="Edit role"
      >
        <span>{value}</span>
        <Pencil size={9} className="edit-pencil" />
      </button>
    );
  }

  /* filters */
  const roles = useMemo(() => ["All", ...Array.from(new Set(candidates.map(c => c.role))).sort()], [candidates]);
  const filtered = useMemo(() => candidates.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.role.toLowerCase().includes(q)) return false;
    if (roleFilter !== "All" && c.role !== roleFilter) return false;
    if (stageFilter === "Active")       return c.rounds.some(r => r.status === "active");
    if (stageFilter === "Pending Mail") return c.rounds.some(r => r.status === "active" && !r.mailSent);
    if (stageFilter === "Completed")    return c.rounds.some(r => r.status === "passed");
    return true;
  }), [candidates, search, roleFilter, stageFilter]);

  function openWizard(c: Candidate, r: Round) {
    const ce = makeCandidateEmail(c, r);
    const ie = makeInterviewerEmail(c, r);
    setWizard({ candidate:c, round:r, step:1, cSub:ce.subject, cBody:ce.body, iSub:ie.subject, iBody:ie.body });
    setWizSent(false);
  }

  function sendBoth() {
    if (!wizard) return;
    setWizSent(true);
    setTimeout(() => {
      setCandidates(prev => prev.map(c => c.id !== wizard.candidate.id ? c : {
        ...c, rounds: c.rounds.map(r => r.roundNo === wizard.round.roundNo ? { ...r, mailSent: true } : r),
      }));
      setWizSent(false); setWizard(null);
    }, 1300);
  }

  function markResult(candidateId: number, roundNo: number, result: "passed"|"failed"|"on-hold") {
    setCandidates(prev => prev.map(c => c.id !== candidateId ? c : {
      ...c, rounds: c.rounds.map(r => {
        if (r.roundNo === roundNo)     return { ...r, status: result };
        if (r.roundNo === roundNo + 1 && result === "passed") return { ...r, status: "active" as RoundStatus };
        return r;
      }),
    }));
    setResultTarget(null);
  }

  const activeCount = candidates.flatMap(c => c.rounds).filter(r => r.status === "active").length;

  return (
    <div className="interviews">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Interviews</h1>
          <p className="page-sub">{candidates.length} candidates · {activeCount} active rounds today</p>
        </div>
        <button className="btn-primary"><Plus size={14} /> Schedule</button>
      </div>

      {/* Filter bar */}
      <div className="int-filterbar">
        <div className="int-search">
          <Search size={14} color="#9090B0" />
          <input placeholder="Search candidate or role…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="int-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <div className="int-stage-tabs">
          {[
            { key:"All",          label:"All",          count: candidates.length },
            { key:"Active",       label:"Active",       count: candidates.filter(c => c.rounds.some(r => r.status === "active")).length },
            { key:"Pending Mail", label:"Pending Mail", count: candidates.filter(c => c.rounds.some(r => r.status === "active" && !r.mailSent)).length },
            { key:"Completed",    label:"Completed",    count: candidates.filter(c => c.rounds.some(r => r.status === "passed")).length },
          ].map(s => (
            <button key={s.key} className={`stage-tab ${stageFilter === s.key ? "active" : ""}`} onClick={() => setStageFilter(s.key)}>
              {s.label} <span className="stage-count">{s.count}</span>
            </button>
          ))}
        </div>
        <span className="int-count">{filtered.length} candidates</span>
      </div>

      {/* Legend */}
      <div className="status-legend">
        <span className="legend-title">Round Status:</span>
        <span className="legend-item"><span className="legend-dot dot-ongoing" />Ongoing</span>
        <span className="legend-item"><span className="legend-dot dot-completed" />Completed</span>
        <span className="legend-item"><span className="legend-dot dot-didntpass" />Didn&apos;t Pass</span>
        <span className="legend-item"><span className="legend-dot dot-onhold" />On Hold</span>
        <span className="legend-item"><span className="legend-dot dot-locked" />Locked</span>
      </div>

      <div className="int-table-wrap">
        <div className="int-thead">
          <div className="th th-cand">Candidate</div>
          <div className="th th-role">Role</div>
          <div className="th th-rounds">Round Progress</div>
          <div className="th th-interviewer">Interviewer</div>
          <div className="th th-current">Current Round</div>
          <div className="th th-action">Action</div>
        </div>

        {filtered.length === 0 && <div className="int-empty">No candidates match your filters.</div>}

        {filtered.map(c => {
          const activeRound = c.rounds.find(r => r.status === "active");
          const passedCount = c.rounds.filter(r => r.status === "passed").length;
          const isExpanded  = expandedId === c.id;

          return (
            <div key={c.id} className="int-row-wrap">
              {/* Main row */}
              <div
                className={`int-row ${isExpanded ? "row-open" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                {/* Candidate */}
                <div className="td td-cand">
                  <div className="cand-av" style={{ background: c.color }}>{c.initials}</div>
                  <div>
                    <div className="cand-name">{c.name}</div>
                    <div className="cand-email">{c.email}</div>
                  </div>
                </div>

                {/* Role */}
                <div className="td td-role">{c.role}</div>

                {/* Round progress pills */}
                <div className="td td-rounds">
                  <div className="round-dots">
                    {c.rounds.map(r => (
                      <span key={r.roundNo} className={`rdot rdot-${r.status}`} title={`R${r.roundNo} ${r.type}: ${SC[r.status].label}`}>
                        R{r.roundNo}
                      </span>
                    ))}
                  </div>
                  <span className="progress-text">{passedCount}/{c.rounds.length} passed</span>
                </div>

                {/* Interviewer (active round) */}
                <div className="td td-interviewer" onClick={e => e.stopPropagation()}>
                  {activeRound ? (
                    editTarget?.kind === "round-text" && editTarget.candidateId === c.id
                      && editTarget.roundNo === activeRound.roundNo && editTarget.field === "interviewer" ? (
                      <input
                        className="exp-field-input"
                        value={editValue}
                        autoFocus
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <button
                        className="interviewer-edit-btn"
                        onClick={e => startRoundEdit(c.id, activeRound.roundNo, "interviewer", activeRound.interviewer, e)}
                      >
                        <User size={11} />
                        <span>{activeRound.interviewer}</span>
                        <Pencil size={10} className="edit-pencil" />
                      </button>
                    )
                  ) : (
                    <span className="no-active">—</span>
                  )}
                </div>

                {/* Current round */}
                <div className="td td-current">
                  {activeRound ? (
                    <div className="curr-round">
                      <span className="curr-badge">R{activeRound.roundNo} — {activeRound.type}</span>
                      <span className="curr-meta"><Calendar size={10} /> {activeRound.date}</span>
                    </div>
                  ) : (
                    <span className="no-active">
                      {c.rounds.every(r => r.status === "passed") ? "✓ All rounds passed" :
                       c.rounds.some(r => r.status === "failed")  ? "Did not pass" : "—"}
                    </span>
                  )}
                </div>

                {/* Action */}
                <div className="td td-action" onClick={e => e.stopPropagation()}>
                  {activeRound && (
                    activeRound.mailSent ? (
                      <div className="action-stack">
                        <span className="mail-sent-tag"><CheckCircle size={12} /> Mail Sent</span>
                        <button className="btn-mark" onClick={() => setResultTarget({ candidateId: c.id, roundNo: activeRound.roundNo })}>
                          Mark Result
                        </button>
                      </div>
                    ) : (
                      <button className="btn-send-mail" onClick={() => openWizard(c, activeRound)}>
                        <Bell size={12} /> Send Mail
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* ── Expanded round detail ── */}
              {isExpanded && (
                <div className="int-expanded">
                  <div className="expanded-rounds">
                    {c.rounds.map(r => {
                      const sm = SC[r.status];
                      const canDelete = r.status === "pending" && c.rounds.length > 1;
                      return (
                        <div key={r.roundNo} className={`exp-round exp-${r.status}`} onClick={e => e.stopPropagation()}>

                          {/* ── Round header: number + editable type + status + delete ── */}
                          <div className="exp-round-head">
                            <span className="exp-round-num">R{r.roundNo}</span>
                            <span className="exp-round-type">
                              <EditText candidateId={c.id} roundNo={r.roundNo} field="type" value={r.type} placeholder="Round type" />
                            </span>
                            <span className="exp-status" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                            {canDelete && (
                              <button className="btn-delete-round" title="Remove round" onClick={e => { e.stopPropagation(); removeRound(c.id, r.roundNo); }}>
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>

                          {/* ── Editable fields grid ── */}
                          <div className="exp-fields-grid">

                            {/* Role */}
                            <div className="exp-field-row">
                              <span className="exp-field-label"><Briefcase size={10} /> Role</span>
                              <EditRole candidateId={c.id} value={c.role} />
                            </div>

                            {/* Date */}
                            <div className="exp-field-row">
                              <span className="exp-field-label"><Calendar size={10} /> Date</span>
                              <EditText candidateId={c.id} roundNo={r.roundNo} field="date" value={r.date} placeholder="e.g. 10 Jun 2026" />
                            </div>

                            {/* Time */}
                            <div className="exp-field-row">
                              <span className="exp-field-label"><Clock size={10} /> Time</span>
                              <EditText candidateId={c.id} roundNo={r.roundNo} field="time" value={r.time} placeholder="e.g. 10:00 AM" />
                            </div>

                            {/* Interviewer */}
                            <div className="exp-field-row">
                              <span className="exp-field-label"><User size={10} /> Interviewer</span>
                              <EditText candidateId={c.id} roundNo={r.roundNo} field="interviewer" value={r.interviewer} placeholder="Name" />
                            </div>

                            {/* Mode toggle */}
                            <div className="exp-field-row">
                              <span className="exp-field-label">
                                {r.mode === "Video Call" ? <Video size={10} /> : <Monitor size={10} />} Mode
                              </span>
                              <button
                                className={`exp-mode-toggle ${r.mode === "Video Call" ? "mode-video" : "mode-person"}`}
                                onClick={e => toggleMode(c.id, r.roundNo, e)}
                                title="Click to toggle mode"
                              >
                                {r.mode === "Video Call" ? <Video size={10} /> : <Monitor size={10} />}
                                {r.mode}
                                <Pencil size={9} className="edit-pencil" />
                              </button>
                            </div>

                            {/* Duration */}
                            <div className="exp-field-row">
                              <span className="exp-field-label"><Clock size={10} /> Duration</span>
                              <EditText candidateId={c.id} roundNo={r.roundNo} field="duration" value={r.duration} placeholder="e.g. 60 min" />
                            </div>

                          </div>

                          {/* ── Actions ── */}
                          {r.status === "active" && (
                            <div className="exp-actions">
                              {r.mailSent ? (
                                <>
                                  <span className="mail-sent-tag"><CheckCircle size={12} /> Mail Sent</span>
                                  <button className="btn-mark" onClick={() => setResultTarget({ candidateId: c.id, roundNo: r.roundNo })}>Mark Result</button>
                                </>
                              ) : (
                                <button className="btn-send-mail" onClick={() => openWizard(c, r)}>
                                  <Bell size={12} /> Send Mail
                                </button>
                              )}
                            </div>
                          )}
                          {r.status === "pending" && (
                            <div className="exp-locked"><Lock size={11} /> Awaiting previous round</div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Round card */}
                    <button className="exp-add-round" onClick={e => { e.stopPropagation(); addRound(c.id); }}>
                      <Plus size={14} />
                      <span>Add Round</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Email Wizard ── */}
      {wizard && (
        <div className="modal-overlay" onClick={() => setWizard(null)}>
          <div className="reminder-modal" onClick={e => e.stopPropagation()}>
            <div className="reminder-header">
              <div className="reminder-title"><Mail size={16} color="#B875A0" /><span>Round {wizard.round.roundNo} — {wizard.round.type} · {wizard.candidate.name}</span></div>
              <button className="close-btn" onClick={() => setWizard(null)}><X size={18} /></button>
            </div>
            <div className="step-bar">
              <div className={`step-item ${wizard.step === 1 ? "step-active" : "step-done"}`}>
                <div className="step-circle">{wizard.step > 1 ? <CheckCircle size={14} /> : "1"}</div>
                <div><div className="step-label">Candidate</div><div className="step-sub">{wizard.candidate.email}</div></div>
              </div>
              <div className="step-line" />
              <div className={`step-item ${wizard.step === 2 ? "step-active" : "step-idle"}`}>
                <div className="step-circle">2</div>
                <div><div className="step-label">Interviewer</div><div className="step-sub">{wizard.round.interviewerEmail}</div></div>
              </div>
            </div>
            {wizard.step === 1 && (
              <div className="reminder-body">
                <div className="email-recipient-banner candidate-banner">
                  <div className="erb-left">
                    <div className="erb-avatar" style={{ background: wizard.candidate.color }}>{wizard.candidate.initials}</div>
                    <div><div className="erb-name">{wizard.candidate.name}</div><div className="erb-email">{wizard.candidate.email}</div></div>
                  </div>
                  <span className="erb-tag">Candidate</span>
                </div>
                <div className="email-form-group">
                  <label className="reminder-section-label">Subject</label>
                  <input className="email-input" value={wizard.cSub} onChange={e => setWizard({ ...wizard, cSub: e.target.value })} />
                </div>
                <div className="email-form-group">
                  <label className="reminder-section-label">Message</label>
                  <textarea className="email-textarea" rows={10} value={wizard.cBody} onChange={e => setWizard({ ...wizard, cBody: e.target.value })} />
                </div>
              </div>
            )}
            {wizard.step === 2 && (
              <div className="reminder-body">
                <div className="email-recipient-banner interviewer-banner">
                  <div className="erb-left">
                    <div className="erb-avatar erb-avatar-int">{wizard.round.interviewer.slice(0,2).toUpperCase()}</div>
                    <div><div className="erb-name">{wizard.round.interviewer}</div><div className="erb-email">{wizard.round.interviewerEmail}</div></div>
                  </div>
                  <span className="erb-tag erb-tag-int">Interviewer</span>
                </div>
                <div className="email-form-group">
                  <label className="reminder-section-label">Subject</label>
                  <input className="email-input" value={wizard.iSub} onChange={e => setWizard({ ...wizard, iSub: e.target.value })} />
                </div>
                <div className="email-form-group">
                  <label className="reminder-section-label">Message</label>
                  <textarea className="email-textarea" rows={10} value={wizard.iBody} onChange={e => setWizard({ ...wizard, iBody: e.target.value })} />
                </div>
              </div>
            )}
            <div className="reminder-footer">
              {wizard.step === 1 ? (
                <>
                  <button className="btn-outline" onClick={() => setWizard(null)}>Cancel</button>
                  <button className="btn-next" onClick={() => setWizard({ ...wizard, step: 2 })}>Next — Interviewer <ChevronRight size={14} /></button>
                </>
              ) : (
                <>
                  <button className="btn-back" onClick={() => setWizard({ ...wizard, step: 1 })}><ChevronLeft size={14} /> Back</button>
                  <button className={`btn-send ${wizSent ? "sent" : ""}`} onClick={sendBoth} disabled={wizSent}>
                    {wizSent ? <><CheckCircle size={14} /> Both Sent!</> : <><Send size={14} /> Send to Both</>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Result ── */}
      {resultTarget && (
        <div className="modal-overlay" onClick={() => setResultTarget(null)}>
          <div className="result-modal" onClick={e => e.stopPropagation()}>
            <div className="reminder-header">
              <div className="reminder-title"><Bell size={16} color="#B875A0" /><span>Mark Round {resultTarget.roundNo} Result</span></div>
              <button className="close-btn" onClick={() => setResultTarget(null)}><X size={18} /></button>
            </div>
            <div className="result-body">
              <p className="result-hint">Marking "Passed" will unlock the next round automatically.</p>
              <div className="result-options">
                <button className="result-opt passed" onClick={() => markResult(resultTarget.candidateId, resultTarget.roundNo, "passed")}><CheckCircle size={17} /> Completed &amp; Passed</button>
                <button className="result-opt failed" onClick={() => markResult(resultTarget.candidateId, resultTarget.roundNo, "failed")}><X size={17} /> Did Not Pass</button>
                <button className="result-opt hold"   onClick={() => markResult(resultTarget.candidateId, resultTarget.roundNo, "on-hold")}><Mail size={17} /> On Hold</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
