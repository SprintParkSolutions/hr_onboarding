"use client";
import "./InterviewsPage.css";
import { useState, useMemo } from "react";
import {
  Calendar, Clock, Video, Monitor, Plus, Bell, Send,
  X, ChevronRight, ChevronLeft, CheckCircle, Mail, Lock,
  Search, User,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
type RoundStatus = "pending" | "active" | "passed" | "failed" | "on-hold";

type Round = {
  roundNo: number;
  type: string;
  date: string;
  time: string;
  interviewer: string;
  interviewerEmail: string;
  mode: "Video Call" | "In-person";
  duration: string;
  status: RoundStatus;
  mailSent: boolean;
};

type Candidate = {
  id: number;
  name: string;
  initials: string;
  color: string;
  email: string;
  role: string;
  rounds: Round[];
};

/* ── Seed data ──────────────────────────────────────────── */
const seed: Candidate[] = [
  { id:1,  name:"Yuki Tanaka",       initials:"YT", color:"#B875A0", email:"yuki.tanaka@email.com",       role:"Frontend Engineer",        rounds:[{roundNo:1,type:"Technical",   date:"Today",       time:"11:00 AM",interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},{roundNo:2,type:"System Design",date:"Tomorrow",   time:"2:00 PM", interviewer:"Arjun K.", interviewerEmail:"arjun.k@recruitai.app",mode:"Video Call",duration:"60 min",status:"pending",mailSent:false},{roundNo:3,type:"Managerial",  date:"28 May 2026",time:"11:00 AM",interviewer:"CEO",       interviewerEmail:"ceo@recruitai.app",     mode:"In-person", duration:"45 min",status:"pending",mailSent:false}] },
  { id:2,  name:"Sarah Mitchell",    initials:"SM", color:"#8A6AAE", email:"sarah.mitchell@email.com",     role:"Senior Backend Engineer",  rounds:[{roundNo:1,type:"Technical",   date:"20 May 2026", time:"10:00 AM",interviewer:"Arjun K.", interviewerEmail:"arjun.k@recruitai.app",mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },{roundNo:2,type:"System Design",date:"Today",       time:"2:30 PM", interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},{roundNo:3,type:"Managerial",  date:"25 May 2026",time:"10:00 AM",interviewer:"Rahul D.", interviewerEmail:"rahul.d@recruitai.app",  mode:"In-person", duration:"60 min",status:"pending",mailSent:false},{roundNo:4,type:"HR Round",    date:"26 May 2026",time:"3:00 PM", interviewer:"Sneha M.", interviewerEmail:"sneha.m@recruitai.app",  mode:"Video Call",duration:"30 min",status:"pending",mailSent:false}] },
  { id:3,  name:"Marco Greco",       initials:"MG", color:"#7AB8D8", email:"marco.greco@email.com",       role:"DevOps Engineer",          rounds:[{roundNo:1,type:"Technical",   date:"Tomorrow",    time:"10:00 AM",interviewer:"Sneha M.", interviewerEmail:"sneha.m@recruitai.app",  mode:"In-person", duration:"60 min",status:"active", mailSent:false},{roundNo:2,type:"Practical",    date:"27 May 2026",time:"11:00 AM",interviewer:"Rahul D.", interviewerEmail:"rahul.d@recruitai.app",  mode:"Video Call",duration:"60 min",status:"pending",mailSent:false}] },
  { id:4,  name:"Aisha Levi",        initials:"AL", color:"#C078B0", email:"aisha.levi@email.com",        role:"Data Scientist",           rounds:[{roundNo:1,type:"Case Study",  date:"20 May 2026", time:"3:00 PM", interviewer:"Rahul D.", interviewerEmail:"rahul.d@recruitai.app",  mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },{roundNo:2,type:"Technical",   date:"22 May 2026", time:"10:00 AM",interviewer:"Arjun K.", interviewerEmail:"arjun.k@recruitai.app",mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },{roundNo:3,type:"Managerial",  date:"Tomorrow",    time:"2:00 PM", interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"In-person", duration:"45 min",status:"active", mailSent:false},{roundNo:4,type:"HR Round",    date:"29 May 2026",time:"11:00 AM",interviewer:"Sneha M.", interviewerEmail:"sneha.m@recruitai.app",  mode:"Video Call",duration:"30 min",status:"pending",mailSent:false}] },
  { id:5,  name:"Priya Sharma",      initials:"PS", color:"#A898D8", email:"priya.sharma@email.com",      role:"Product Manager",          rounds:[{roundNo:1,type:"Product",     date:"19 May 2026", time:"11:30 AM",interviewer:"Sneha M.", interviewerEmail:"sneha.m@recruitai.app",  mode:"In-person", duration:"45 min",status:"passed", mailSent:true },{roundNo:2,type:"Culture Fit",  date:"Today",       time:"3:00 PM", interviewer:"CEO",       interviewerEmail:"ceo@recruitai.app",     mode:"In-person", duration:"45 min",status:"active", mailSent:false}] },
  { id:6,  name:"Ravi Kumar",        initials:"RK", color:"#B875A0", email:"ravi.kumar@email.com",        role:"Frontend Engineer",        rounds:[{roundNo:1,type:"Technical",   date:"23 May 2026", time:"10:00 AM",interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},{roundNo:2,type:"System Design",date:"25 May 2026", time:"11:00 AM",interviewer:"Arjun K.", interviewerEmail:"arjun.k@recruitai.app",mode:"Video Call",duration:"60 min",status:"pending",mailSent:false}] },
  { id:7,  name:"Neha Joshi",        initials:"NJ", color:"#8A6AAE", email:"neha.joshi@email.com",        role:"UX Designer",              rounds:[{roundNo:1,type:"Portfolio",   date:"22 May 2026", time:"2:00 PM", interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"45 min",status:"passed", mailSent:true },{roundNo:2,type:"Culture Fit",  date:"24 May 2026", time:"3:00 PM", interviewer:"CEO",       interviewerEmail:"ceo@recruitai.app",     mode:"In-person", duration:"45 min",status:"active", mailSent:false}] },
  { id:8,  name:"Amit Singh",        initials:"AS", color:"#7AB8D8", email:"amit.singh@email.com",        role:"Backend Engineer",         rounds:[{roundNo:1,type:"Technical",   date:"Today",       time:"9:00 AM", interviewer:"Arjun K.", interviewerEmail:"arjun.k@recruitai.app",mode:"Video Call",duration:"60 min",status:"active", mailSent:false},{roundNo:2,type:"System Design",date:"26 May 2026", time:"10:00 AM",interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"pending",mailSent:false},{roundNo:3,type:"HR Round",    date:"27 May 2026",time:"3:00 PM", interviewer:"Sneha M.", interviewerEmail:"sneha.m@recruitai.app",  mode:"Video Call",duration:"30 min",status:"pending",mailSent:false}] },
  { id:9,  name:"Divya Menon",       initials:"DM", color:"#C078B0", email:"divya.menon@email.com",       role:"Data Analyst",             rounds:[{roundNo:1,type:"Technical",   date:"21 May 2026", time:"11:00 AM",interviewer:"Rahul D.", interviewerEmail:"rahul.d@recruitai.app",  mode:"Video Call",duration:"60 min",status:"failed", mailSent:true }] },
  { id:10, name:"Karan Mehta",       initials:"KM", color:"#A898D8", email:"karan.mehta@email.com",       role:"Product Manager",          rounds:[{roundNo:1,type:"Product",     date:"22 May 2026", time:"10:00 AM",interviewer:"Priya R.",  interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },{roundNo:2,type:"Managerial",  date:"24 May 2026", time:"2:00 PM", interviewer:"CEO",       interviewerEmail:"ceo@recruitai.app",     mode:"In-person", duration:"45 min",status:"passed", mailSent:true },{roundNo:3,type:"HR Round",    date:"Today",       time:"4:00 PM", interviewer:"Sneha M.", interviewerEmail:"sneha.m@recruitai.app",  mode:"Video Call",duration:"30 min",status:"active", mailSent:false}] },
];

/* ── Status config ──────────────────────────────────────── */
const SC: Record<RoundStatus, { bg: string; color: string; label: string }> = {
  active:    { bg:"rgba(122,184,216,0.18)", color:"#3A70A0", label:"Active"    },
  passed:    { bg:"rgba(52,199,89,0.15)",  color:"#1a7a3a", label:"Passed"    },
  failed:    { bg:"rgba(184,117,160,0.18)", color:"#8A4A78", label:"Failed"    },
  "on-hold": { bg:"rgba(238,208,90,0.22)",  color:"#7A5A10", label:"On Hold"   },
  pending:   { bg:"rgba(221,208,232,0.3)",  color:"#9090B0", label:"Locked"    },
};

/* ── Email templates ────────────────────────────────────── */
function makeCandidateEmail(c: Candidate, r: Round) {
  return {
    subject: `Round ${r.roundNo} Interview — ${c.role} | ${r.date} at ${r.time}`,
    body: `Hi ${c.name.split(" ")[0]},\n\nYou are scheduled for Round ${r.roundNo} (${r.type}) interview.\n\nDetails:\n- Role        : ${c.role}\n- Round       : ${r.roundNo} — ${r.type}\n- Date        : ${r.date}\n- Time        : ${r.time} IST\n- Interviewer : ${r.interviewer}\n- Mode        : ${r.mode}\n- Duration    : ${r.duration}\n\n${r.mode==="Video Call"?"A Google Meet link will be shared 15 minutes before.":"Please arrive 10 minutes early at our office."}\n\nBest regards,\nPriya R. | RecruitAI`,
  };
}
function makeInterviewerEmail(c: Candidate, r: Round) {
  return {
    subject: `Round ${r.roundNo} Interview — ${c.name} | ${r.date}`,
    body: `Hi ${r.interviewer.split(" ")[0]},\n\nYou are conducting Round ${r.roundNo} (${r.type}) for ${c.name}.\n\nDetails:\n- Candidate   : ${c.name}\n- Role        : ${c.role}\n- Date        : ${r.date}\n- Time        : ${r.time} IST\n- Mode        : ${r.mode}\n- Duration    : ${r.duration}\n\n${r.mode==="Video Call"?"Please share Google Meet link 15 min before.":"Please be present 5 min early."}\n\nBest regards,\nPriya R. | RecruitAI`,
  };
}

/* ── Wizard type ────────────────────────────────────────── */
type WizardState = { candidate: Candidate; round: Round; step: 1|2; cSub: string; cBody: string; iSub: string; iBody: string };
type ResultTarget = { candidateId: number; roundNo: number } | null;

/* ── Component ──────────────────────────────────────────── */
export default function InterviewsPage() {
  const [data,        setData]        = useState(seed);
  const [search,      setSearch]      = useState("");
  const [roleFilter,  setRoleFilter]  = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [expandedId,  setExpandedId]  = useState<number | null>(null);
  const [wizard,      setWizard]      = useState<WizardState | null>(null);
  const [wizSent,     setWizSent]     = useState(false);
  const [resultTarget,setResultTarget]= useState<ResultTarget>(null);

  /* Derived filter options */
  const roles = useMemo(() => ["All", ...Array.from(new Set(data.map(c => c.role))).sort()], [data]);

  /* Filter candidates */
  const filtered = useMemo(() => data.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.role.toLowerCase().includes(q)) return false;
    if (roleFilter  !== "All" && c.role !== roleFilter) return false;
    if (stageFilter === "Active")    return c.rounds.some(r => r.status === "active");
    if (stageFilter === "Pending Mail") return c.rounds.some(r => r.status === "active" && !r.mailSent);
    if (stageFilter === "Completed") return c.rounds.every(r => r.status === "passed");
    return true;
  }), [data, search, roleFilter, stageFilter]);

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
      setData(prev => prev.map(c => c.id !== wizard.candidate.id ? c : {
        ...c, rounds: c.rounds.map(r => r.roundNo === wizard.round.roundNo ? { ...r, mailSent: true } : r),
      }));
      setWizSent(false); setWizard(null);
    }, 1300);
  }

  function markResult(candidateId: number, roundNo: number, result: "passed"|"failed"|"on-hold") {
    setData(prev => prev.map(c => c.id !== candidateId ? c : {
      ...c, rounds: c.rounds.map((r, i) => {
        if (r.roundNo === roundNo)     return { ...r, status: result };
        if (r.roundNo === roundNo + 1 && result === "passed") return { ...r, status: "active" as RoundStatus };
        return r;
      }),
    }));
    setResultTarget(null);
  }

  const activeCount = data.flatMap(c => c.rounds).filter(r => r.status === "active").length;

  return (
    <div className="interviews">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Interviews</h1>
          <p className="page-sub">{data.length} candidates · {activeCount} active rounds today</p>
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
          {["All","Active","Pending Mail","Completed"].map(s => (
            <button key={s} className={`stage-tab ${stageFilter === s ? "active" : ""}`} onClick={() => setStageFilter(s)}>{s}</button>
          ))}
        </div>
        <span className="int-count">{filtered.length} candidates</span>
      </div>

      {/* Table */}
      <div className="int-table-wrap">
        {/* Head */}
        <div className="int-thead">
          <div className="th th-cand">Candidate</div>
          <div className="th th-role">Role</div>
          <div className="th th-rounds">Round Progress</div>
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
                      <span key={r.roundNo}
                        className={`rdot rdot-${r.status}`}
                        title={`R${r.roundNo} ${r.type}: ${SC[r.status].label}`}
                      >
                        R{r.roundNo}
                      </span>
                    ))}
                  </div>
                  <span className="progress-text">{passedCount}/{c.rounds.length} passed</span>
                </div>

                {/* Current round */}
                <div className="td td-current">
                  {activeRound ? (
                    <div className="curr-round">
                      <span className="curr-badge">R{activeRound.roundNo} — {activeRound.type}</span>
                      <span className="curr-meta"><Calendar size={10} /> {activeRound.date} · {activeRound.time}</span>
                    </div>
                  ) : (
                    <span className="no-active">
                      {c.rounds.every(r => r.status === "passed") ? "✓ All rounds passed" :
                       c.rounds.some(r => r.status === "failed") ? "Did not pass" : "—"}
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

              {/* Expanded round detail */}
              {isExpanded && (
                <div className="int-expanded">
                  <div className="expanded-rounds">
                    {c.rounds.map(r => {
                      const sm = SC[r.status];
                      return (
                        <div key={r.roundNo} className={`exp-round exp-${r.status}`}>
                          <div className="exp-round-head">
                            <span className="exp-round-num">R{r.roundNo}</span>
                            <span className="exp-round-type">{r.type}</span>
                            <span className="exp-status" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                          </div>
                          <div className="exp-round-meta">
                            <span><Calendar size={10} /> {r.date} · {r.time}</span>
                            <span><User size={10} /> {r.interviewer}</span>
                            <span className={`exp-mode ${r.mode === "Video Call" ? "mode-video" : "mode-person"}`}>
                              {r.mode === "Video Call" ? <Video size={10} /> : <Monitor size={10} />} {r.mode}
                            </span>
                            <span><Clock size={10} /> {r.duration}</span>
                          </div>
                          {r.status === "active" && (
                            <div className="exp-actions" onClick={e => e.stopPropagation()}>
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
                          {r.status === "pending" && <div className="exp-locked"><Lock size={11} /> Awaiting previous round</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Email Wizard */}
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

      {/* Mark Result */}
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
                <button className="result-opt hold"   onClick={() => markResult(resultTarget.candidateId, resultTarget.roundNo, "on-hold")}><Clock size={17} /> On Hold</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
