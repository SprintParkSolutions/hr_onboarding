"use client";
import "./InterviewsPage.css";
import { useState } from "react";
import { Calendar, Clock, Video, User, Monitor, Plus, Bell, Send, X } from "lucide-react";

const interviews = [
  { candidate: "Yuki Tanaka",    initials: "YT", color: "#10b981", candidateEmail: "yuki.tanaka@email.com",    interviewerEmail: "priya.r@recruitai.app",  role: "Frontend Engineer",       type: "Technical",    date: "Today",       time: "11:00 AM", interviewer: "Priya R.",  mode: "Video Call", duration: "60 min", status: "Confirmed" },
  { candidate: "Sarah Mitchell", initials: "SM", color: "#8b5cf6", candidateEmail: "sarah.mitchell@email.com", interviewerEmail: "arjun.k@recruitai.app",  role: "Senior Backend Engineer", type: "System Design", date: "Today",       time: "2:30 PM",  interviewer: "Arjun K.", mode: "Video Call", duration: "60 min", status: "Confirmed" },
  { candidate: "Marco Greco",    initials: "MG", color: "#2563eb", candidateEmail: "marco.greco@email.com",    interviewerEmail: "sneha.m@recruitai.app",  role: "DevOps Engineer",         type: "Technical",    date: "Tomorrow",    time: "10:00 AM", interviewer: "Sneha M.", mode: "In-person",  duration: "60 min", status: "Pending" },
  { candidate: "Aisha Levi",     initials: "AL", color: "#ef4444", candidateEmail: "aisha.levi@email.com",     interviewerEmail: "rahul.d@recruitai.app",  role: "Data Scientist",          type: "Case Study",   date: "Tomorrow",    time: "3:00 PM",  interviewer: "Rahul D.", mode: "Video Call", duration: "60 min", status: "Rescheduled" },
  { candidate: "Priya Sharma",   initials: "PS", color: "#0891b2", candidateEmail: "priya.sharma@email.com",   interviewerEmail: "ceo@recruitai.app",      role: "Product Manager",         type: "Culture Fit",  date: "22 May 2026", time: "11:30 AM", interviewer: "CEO",      mode: "In-person",  duration: "45 min", status: "Confirmed" },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  Confirmed:   { bg: "rgba(128,178,255,0.2)", text: "#2a5090" },
  Pending:     { bg: "rgba(253,255,200,0.7)", text: "#806020" },
  Rescheduled: { bg: "rgba(255,200,216,0.5)", text: "#c0506a" },
};

type Interview = typeof interviews[0];
type ReminderModal = { interview: Interview; toCandidate: boolean; toInterviewer: boolean; subject: string; body: string } | null;

export default function InterviewsPage() {
  const [reminderModal, setReminderModal] = useState<ReminderModal>(null);
  const [sent, setSent] = useState(false);

  function openReminder(i: Interview) {
    setReminderModal({
      interview: i,
      toCandidate: true,
      toInterviewer: true,
      subject: `Interview Reminder - ${i.role} | ${i.date} at ${i.time}`,
      body: `Hi,\n\nThis is a reminder for your upcoming interview scheduled at RecruitAI.\n\nInterview Details:\n- Candidate  : ${i.candidate}\n- Role       : ${i.role}\n- Round      : ${i.type}\n- Date       : ${i.date}\n- Time       : ${i.time} IST\n- Mode       : ${i.mode}\n- Duration   : ${i.duration}\n- Interviewer: ${i.interviewer}\n\n${i.mode === "Video Call" ? "A Google Meet link will be shared 15 minutes before the interview.\n" : "Please arrive 10 minutes early at the RecruitAI office.\n"}\nPlease ensure you are available on time. Reach out to priya.r@recruitai.app for any queries.\n\nBest regards,\nPriya R.\nTalent Acquisition | RecruitAI`,
    });
    setSent(false);
  }

  function handleSend() { setSent(true); setTimeout(() => setReminderModal(null), 1500); }

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

      {reminderModal && (
        <div className="modal-overlay" onClick={() => setReminderModal(null)}>
          <div className="reminder-modal" onClick={e => e.stopPropagation()}>
            <div className="reminder-header">
              <div className="reminder-title"><Bell size={16} color="#9E74D0" /><span>Send Reminder</span></div>
              <button className="close-btn" onClick={() => setReminderModal(null)}><X size={18} /></button>
            </div>

            <div className="reminder-body">
              <div className="reminder-section-label">Send to</div>
              <div className="reminder-recipients">
                <label className="recipient-check">
                  <input type="checkbox" checked={reminderModal.toCandidate}
                    onChange={() => setReminderModal({ ...reminderModal, toCandidate: !reminderModal.toCandidate })} />
                  <div className="recipient-info">
                    <span className="recipient-name">{reminderModal.interview.candidate}</span>
                    <span className="recipient-email">{reminderModal.interview.candidateEmail}</span>
                  </div>
                  <span className="recipient-role-tag">Candidate</span>
                </label>
                <label className="recipient-check">
                  <input type="checkbox" checked={reminderModal.toInterviewer}
                    onChange={() => setReminderModal({ ...reminderModal, toInterviewer: !reminderModal.toInterviewer })} />
                  <div className="recipient-info">
                    <span className="recipient-name">{reminderModal.interview.interviewer}</span>
                    <span className="recipient-email">{reminderModal.interview.interviewerEmail}</span>
                  </div>
                  <span className="recipient-role-tag interviewer">Interviewer</span>
                </label>
              </div>

              <div className="reminder-section-label">Interview Details</div>
              <div className="reminder-details-grid">
                <div className="rd-item"><span className="rd-label">Date</span><span className="rd-val">{reminderModal.interview.date}</span></div>
                <div className="rd-item"><span className="rd-label">Time</span><span className="rd-val">{reminderModal.interview.time}</span></div>
                <div className="rd-item"><span className="rd-label">Mode</span><span className="rd-val">{reminderModal.interview.mode}</span></div>
                <div className="rd-item"><span className="rd-label">Duration</span><span className="rd-val">{reminderModal.interview.duration}</span></div>
              </div>

              <div className="email-form-group">
                <label className="reminder-section-label">Subject</label>
                <input className="email-input" value={reminderModal.subject}
                  onChange={e => setReminderModal({ ...reminderModal, subject: e.target.value })} />
              </div>

              <div className="email-form-group">
                <label className="reminder-section-label">Message</label>
                <textarea className="email-textarea" rows={10} value={reminderModal.body}
                  onChange={e => setReminderModal({ ...reminderModal, body: e.target.value })} />
              </div>
            </div>

            <div className="reminder-footer">
              <button className="btn-outline" onClick={() => setReminderModal(null)}>Cancel</button>
              <button className={`btn-send ${sent ? "sent" : ""}`} onClick={handleSend}
                disabled={!reminderModal.toCandidate && !reminderModal.toInterviewer}>
                {sent ? "✓ Reminder Sent!" : <><Send size={14} /> Send Reminder</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
