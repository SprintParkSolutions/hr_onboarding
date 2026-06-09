"use client";
import "./InterviewsPage.css";
import { useState } from "react";
import { Calendar, Clock, Video, User, Monitor, Plus, Bell, Send, X, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

const interviews = [
  { candidate: "Yuki Tanaka",    initials: "YT", color: "#B875A0", candidateEmail: "yuki.tanaka@email.com",    interviewerEmail: "priya.r@recruitai.app",  role: "Frontend Engineer",       type: "Technical",    date: "Today",       time: "11:00 AM", interviewer: "Priya R.",  mode: "Video Call", duration: "60 min", status: "Confirmed" },
  { candidate: "Sarah Mitchell", initials: "SM", color: "#8A6AAE", candidateEmail: "sarah.mitchell@email.com", interviewerEmail: "arjun.k@recruitai.app",  role: "Senior Backend Engineer", type: "System Design", date: "Today",       time: "2:30 PM",  interviewer: "Arjun K.", mode: "Video Call", duration: "60 min", status: "Confirmed" },
  { candidate: "Marco Greco",    initials: "MG", color: "#7AB8D8", candidateEmail: "marco.greco@email.com",    interviewerEmail: "sneha.m@recruitai.app",  role: "DevOps Engineer",         type: "Technical",    date: "Tomorrow",    time: "10:00 AM", interviewer: "Sneha M.", mode: "In-person",  duration: "60 min", status: "Pending" },
  { candidate: "Aisha Levi",     initials: "AL", color: "#C078B0", candidateEmail: "aisha.levi@email.com",     interviewerEmail: "rahul.d@recruitai.app",  role: "Data Scientist",          type: "Case Study",   date: "Tomorrow",    time: "3:00 PM",  interviewer: "Rahul D.", mode: "Video Call", duration: "60 min", status: "Rescheduled" },
  { candidate: "Priya Sharma",   initials: "PS", color: "#A898D8", candidateEmail: "priya.sharma@email.com",   interviewerEmail: "ceo@recruitai.app",      role: "Product Manager",         type: "Culture Fit",  date: "22 May 2026", time: "11:30 AM", interviewer: "CEO",      mode: "In-person",  duration: "45 min", status: "Confirmed" },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  Confirmed:   { bg: "rgba(122,184,216,0.2)", text: "#3A70A0" },
  Pending:     { bg: "rgba(238,208,90,0.25)", text: "#7A5A10" },
  Rescheduled: { bg: "rgba(184,117,160,0.18)", text: "#8A4A78" },
};

type Interview = typeof interviews[0];

type ReminderState = {
  interview: Interview;
  step: 1 | 2;                // 1 = candidate, 2 = interviewer
  candidateSubject: string;
  candidateBody: string;
  interviewerSubject: string;
  interviewerBody: string;
};

function makeCandidateBody(i: Interview) {
  return `Hi ${i.candidate.split(" ")[0]},

This is a reminder for your upcoming interview with RecruitAI.

Interview Details:
- Role       : ${i.role}
- Round      : ${i.type}
- Date       : ${i.date}
- Time       : ${i.time} IST
- Interviewer: ${i.interviewer}
- Mode       : ${i.mode}
- Duration   : ${i.duration}

${i.mode === "Video Call"
  ? "A Google Meet link will be shared 15 minutes before the interview."
  : "Please arrive 10 minutes early at our office."}

Please ensure you are available on time. Reach out to priya.r@recruitai.app for any queries.

Best regards,
Priya R.
Talent Acquisition | RecruitAI`;
}

function makeInterviewerBody(i: Interview) {
  return `Hi ${i.interviewer.split(" ")[0]},

This is a reminder for the upcoming interview you are conducting.

Interview Details:
- Candidate  : ${i.candidate}
- Role       : ${i.role}
- Round      : ${i.type}
- Date       : ${i.date}
- Time       : ${i.time} IST
- Mode       : ${i.mode}
- Duration   : ${i.duration}

${i.mode === "Video Call"
  ? "Please share the Google Meet link with the candidate 15 minutes before the interview."
  : "Please be present at the interview room 5 minutes early."}

For any rescheduling requests, contact priya.r@recruitai.app.

Best regards,
Priya R.
Talent Acquisition | RecruitAI`;
}

export default function InterviewsPage() {
  const [reminder, setReminder] = useState<ReminderState | null>(null);
  const [sent, setSent]         = useState(false);

  function openReminder(i: Interview) {
    setReminder({
      interview: i,
      step: 1,
      candidateSubject:   `Interview Reminder - ${i.role} | ${i.date} at ${i.time}`,
      candidateBody:      makeCandidateBody(i),
      interviewerSubject: `Interview Reminder - ${i.candidate} | ${i.role} | ${i.date} at ${i.time}`,
      interviewerBody:    makeInterviewerBody(i),
    });
    setSent(false);
  }

  function handleSendBoth() {
    setSent(true);
    setTimeout(() => { setReminder(null); setSent(false); }, 1800);
  }

  function close() { setReminder(null); setSent(false); }

  return (
    <div className="interviews">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interviews</h1>
          <p className="page-sub">4 interviews today · 9 this week</p>
        </div>
        <button className="btn-primary"><Plus size={14} /> Schedule interview</button>
      </div>

      <div className="int-list">
        {interviews.map((i) => (
          <div key={i.candidate + i.time} className="int-card">
            <div className="int-candidate">
              <div className="int-avatar" style={{ background: i.color }}>{i.initials}</div>
              <div>
                <div className="int-name">{i.candidate}</div>
                <div className="int-role-type">{i.role} · <span className="int-type">{i.type}</span></div>
              </div>
            </div>

            <div className="int-fields">
              <div className="int-field">
                <span className="int-field-label"><Calendar size={11} /> Date</span>
                <span className="int-field-val">{i.date}</span>
              </div>
              <div className="int-field">
                <span className="int-field-label"><Clock size={11} /> Time</span>
                <span className="int-field-val">{i.time}</span>
              </div>
              <div className="int-field">
                <span className="int-field-label"><User size={11} /> Interviewer</span>
                <span className="int-field-val">{i.interviewer}</span>
              </div>
              <div className="int-field">
                <span className="int-field-label"><Monitor size={11} /> Mode</span>
                <span className={`int-mode-badge ${i.mode === "Video Call" ? "video" : "inperson"}`}>
                  {i.mode === "Video Call" ? <Video size={11} /> : <Monitor size={11} />}
                  {i.mode}
                </span>
              </div>
              <div className="int-field">
                <span className="int-field-label"><Clock size={11} /> Duration</span>
                <span className="int-field-val">{i.duration}</span>
              </div>
            </div>

            <div className="int-right">
              <span className="int-status" style={{ background: statusStyle[i.status].bg, color: statusStyle[i.status].text }}>{i.status}</span>
              <div className="int-actions">
                <button className="btn-reminder" onClick={() => openReminder(i)}><Bell size={13} /> Reminder</button>
                <button className="btn-outline-sm">View</button>
                <button className="btn-primary-sm">Join</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2-step Reminder Modal ── */}
      {reminder && (
        <div className="modal-overlay" onClick={close}>
          <div className="reminder-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="reminder-header">
              <div className="reminder-title">
                <Bell size={16} color="#B875A0" />
                <span>Send Reminder</span>
              </div>
              <button className="close-btn" onClick={close}><X size={18} /></button>
            </div>

            {/* Step indicator */}
            <div className="step-bar">
              <div className={`step-item ${reminder.step === 1 ? "step-active" : "step-done"}`}>
                <div className="step-circle">
                  {reminder.step > 1 ? <CheckCircle size={14} /> : "1"}
                </div>
                <div>
                  <div className="step-label">Candidate</div>
                  <div className="step-sub">{reminder.interview.candidate}</div>
                </div>
              </div>
              <div className="step-line" />
              <div className={`step-item ${reminder.step === 2 ? "step-active" : reminder.step > 2 ? "step-done" : "step-idle"}`}>
                <div className="step-circle">{reminder.step > 2 ? <CheckCircle size={14} /> : "2"}</div>
                <div>
                  <div className="step-label">Interviewer</div>
                  <div className="step-sub">{reminder.interview.interviewer}</div>
                </div>
              </div>
            </div>

            {/* Step 1 — Candidate email */}
            {reminder.step === 1 && (
              <div className="reminder-body">
                <div className="email-recipient-banner candidate-banner">
                  <div className="erb-left">
                    <div className="erb-avatar" style={{ background: reminder.interview.color }}>{reminder.interview.initials}</div>
                    <div>
                      <div className="erb-name">{reminder.interview.candidate}</div>
                      <div className="erb-email">{reminder.interview.candidateEmail}</div>
                    </div>
                  </div>
                  <span className="erb-tag">Candidate</span>
                </div>

                <div className="email-form-group">
                  <label className="reminder-section-label">Subject</label>
                  <input className="email-input" value={reminder.candidateSubject}
                    onChange={e => setReminder({ ...reminder, candidateSubject: e.target.value })} />
                </div>
                <div className="email-form-group">
                  <label className="reminder-section-label">Message</label>
                  <textarea className="email-textarea" rows={11} value={reminder.candidateBody}
                    onChange={e => setReminder({ ...reminder, candidateBody: e.target.value })} />
                </div>
              </div>
            )}

            {/* Step 2 — Interviewer email */}
            {reminder.step === 2 && (
              <div className="reminder-body">
                <div className="email-recipient-banner interviewer-banner">
                  <div className="erb-left">
                    <div className="erb-avatar erb-avatar-int">{reminder.interview.interviewer.slice(0,2).toUpperCase()}</div>
                    <div>
                      <div className="erb-name">{reminder.interview.interviewer}</div>
                      <div className="erb-email">{reminder.interview.interviewerEmail}</div>
                    </div>
                  </div>
                  <span className="erb-tag erb-tag-int">Interviewer</span>
                </div>

                <div className="email-form-group">
                  <label className="reminder-section-label">Subject</label>
                  <input className="email-input" value={reminder.interviewerSubject}
                    onChange={e => setReminder({ ...reminder, interviewerSubject: e.target.value })} />
                </div>
                <div className="email-form-group">
                  <label className="reminder-section-label">Message</label>
                  <textarea className="email-textarea" rows={11} value={reminder.interviewerBody}
                    onChange={e => setReminder({ ...reminder, interviewerBody: e.target.value })} />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="reminder-footer">
              {reminder.step === 1 ? (
                <>
                  <button className="btn-outline" onClick={close}>Cancel</button>
                  <button className="btn-next" onClick={() => setReminder({ ...reminder, step: 2 })}>
                    Next — Interviewer Email <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-back" onClick={() => setReminder({ ...reminder, step: 1 })}>
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button
                    className={`btn-send ${sent ? "sent" : ""}`}
                    onClick={handleSendBoth}
                    disabled={sent}
                  >
                    {sent
                      ? <><CheckCircle size={14} /> Both Sent!</>
                      : <><Send size={14} /> Send to Both</>}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
