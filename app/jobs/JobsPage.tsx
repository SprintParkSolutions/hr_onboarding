"use client";
import "./JobsPage.css";
import { useState } from "react";
import { MapPin, Users, Clock, X, ChevronDown, ChevronUp, Plus, Briefcase, FileText, AlertCircle, Star, Trophy, ChevronRight } from "lucide-react";

type Candidate = {
  initials: string; color: string; name: string; score: number;
  stage: string; yoe: string; tags: string[];
};

type Job = {
  title: string; dept: string; location: string; candidates: number;
  posted: string; status: string; urgent: boolean; experience: string;
  description: string; pipeline: Candidate[];
};

const jobCandidates: Record<string, Candidate[]> = {
  "Senior Backend Engineer": [
    { initials: "SM", color: "#8b5cf6", name: "Sarah Mitchell",  score: 94, stage: "Shortlisted", yoe: "8 yrs", tags: ["Python","Kafka","AWS"] },
    { initials: "MG", color: "#2563eb", name: "Marco Greco",     score: 91, stage: "Shortlisted", yoe: "6 yrs", tags: ["Go","PostgreSQL","AWS"] },
    { initials: "AR", color: "#0891b2", name: "Arjun Rao",       score: 83, stage: "Interview",   yoe: "5 yrs", tags: ["Python","Redis","GCP"] },
    { initials: "NK", color: "#10b981", name: "Neha Kulkarni",   score: 78, stage: "Screening",   yoe: "4 yrs", tags: ["Java","Kafka","Docker"] },
    { initials: "VB", color: "#f59e0b", name: "Vikram Bose",     score: 71, stage: "Screening",   yoe: "3 yrs", tags: ["Python","MySQL"] },
  ],
  "Product Designer": [
    { initials: "RK", color: "#f59e0b", name: "Rohan Kapoor",    score: 88, stage: "Offer Sent",  yoe: "5 yrs", tags: ["Figma","UX Research"] },
    { initials: "DS", color: "#8b5cf6", name: "Divya Sharma",    score: 82, stage: "Interview",   yoe: "4 yrs", tags: ["Figma","Prototyping"] },
    { initials: "PN", color: "#ef4444", name: "Pooja Nair",      score: 75, stage: "Screening",   yoe: "3 yrs", tags: ["Sketch","User Testing"] },
  ],
  "Frontend Engineer": [
    { initials: "YT", color: "#10b981", name: "Yuki Tanaka",     score: 81, stage: "Interview",   yoe: "4 yrs", tags: ["React","TypeScript"] },
    { initials: "KP", color: "#2563eb", name: "Karan Patel",     score: 79, stage: "Screening",   yoe: "3 yrs", tags: ["React","Next.js"] },
    { initials: "SR", color: "#8b5cf6", name: "Sneha Reddy",     score: 76, stage: "Screening",   yoe: "2 yrs", tags: ["Vue","TypeScript"] },
    { initials: "AM", color: "#0891b2", name: "Aditya Mehta",    score: 73, stage: "Screening",   yoe: "2 yrs", tags: ["React","CSS"] },
  ],
  "Data Scientist": [
    { initials: "AL", color: "#ef4444", name: "Aisha Levi",      score: 76, stage: "Screening",   yoe: "3 yrs", tags: ["Python","ML","SQL"] },
    { initials: "RP", color: "#f59e0b", name: "Rahul Pillai",    score: 72, stage: "Screening",   yoe: "2 yrs", tags: ["Python","TensorFlow"] },
  ],
  "DevOps Engineer": [
    { initials: "MG", color: "#2563eb", name: "Marco Greco",     score: 91, stage: "Shortlisted", yoe: "6 yrs", tags: ["Kubernetes","Terraform"] },
    { initials: "SJ", color: "#10b981", name: "Suresh Joshi",    score: 84, stage: "Interview",   yoe: "5 yrs", tags: ["Docker","AWS","CI/CD"] },
    { initials: "TK", color: "#8b5cf6", name: "Tanvi Kapoor",    score: 77, stage: "Screening",   yoe: "4 yrs", tags: ["Kubernetes","GCP"] },
  ],
  "Product Manager": [
    { initials: "PS", color: "#0891b2", name: "Priya Sharma",    score: 85, stage: "Interview",   yoe: "7 yrs", tags: ["Roadmapping","Agile"] },
    { initials: "RV", color: "#8b5cf6", name: "Rohit Verma",     score: 80, stage: "Screening",   yoe: "5 yrs", tags: ["Product Strategy","SQL"] },
    { initials: "MN", color: "#f59e0b", name: "Meera Nambiar",   score: 74, stage: "Screening",   yoe: "4 yrs", tags: ["Agile","User Research"] },
  ],
};

const stageColor: Record<string, string> = {
  Shortlisted: "rgba(128,178,255,0.2)", "Offer Sent": "rgba(186,159,231,0.25)",
  Interview: "rgba(156,224,255,0.25)", Screening: "rgba(189,242,255,0.3)",
};
const stageText: Record<string, string> = {
  Shortlisted: "#2a5090", "Offer Sent": "#6a3a90", Interview: "#2a6080", Screening: "#1a4060",
};

const initialJobs: Job[] = [
  { title: "Senior Backend Engineer", dept: "Engineering", location: "Bangalore / Remote", candidates: 142, posted: "3 days ago", status: "Active", urgent: true, experience: "5–8 years", description: "We are looking for a Senior Backend Engineer to design and build scalable, high-performance services.\n\nResponsibilities:\n• Design and implement RESTful and event-driven APIs\n• Optimize database queries and system performance\n• Lead code reviews and mentor junior engineers\n\nRequirements:\n• 5+ years of backend development experience\n• Strong proficiency in Python or Go\n• Experience with Kafka, Redis, and PostgreSQL", pipeline: jobCandidates["Senior Backend Engineer"] },
  { title: "Product Designer", dept: "Design", location: "Mumbai", candidates: 87, posted: "1 week ago", status: "Active", urgent: false, experience: "3–6 years", description: "Join our design team to craft intuitive product experiences for our B2B SaaS platform.\n\nResponsibilities:\n• Conduct user research and usability testing\n• Create wireframes, prototypes, and design specs\n\nRequirements:\n• 3+ years of product design experience\n• Expert-level Figma skills", pipeline: jobCandidates["Product Designer"] },
  { title: "Frontend Engineer", dept: "Engineering", location: "Remote", candidates: 203, posted: "5 days ago", status: "Active", urgent: false, experience: "2–5 years", description: "We need a Frontend Engineer passionate about performance to build our next-generation recruiter dashboard.\n\nResponsibilities:\n• Build reusable React components\n• Implement responsive, accessible UI\n\nRequirements:\n• 2+ years of React and TypeScript experience\n• Familiarity with Next.js and Tailwind CSS", pipeline: jobCandidates["Frontend Engineer"] },
  { title: "Data Scientist", dept: "Analytics", location: "Hyderabad", candidates: 56, posted: "2 weeks ago", status: "Paused", urgent: false, experience: "2–4 years", description: "We are seeking a Data Scientist to build and improve our AI resume screening models.\n\nRequirements:\n• 2+ years of data science experience\n• Proficiency in Python, scikit-learn, and TensorFlow", pipeline: jobCandidates["Data Scientist"] },
  { title: "DevOps Engineer", dept: "Infrastructure", location: "Bangalore", candidates: 34, posted: "1 day ago", status: "Active", urgent: true, experience: "4–7 years", description: "We are hiring a DevOps Engineer to own our cloud infrastructure and deployment pipelines.\n\nRequirements:\n• 4+ years of DevOps or SRE experience\n• Expert knowledge of Kubernetes and Docker", pipeline: jobCandidates["DevOps Engineer"] },
  { title: "Product Manager", dept: "Product", location: "Delhi / Remote", candidates: 119, posted: "4 days ago", status: "Active", urgent: false, experience: "5–9 years", description: "We are looking for a strategic Product Manager to own the roadmap for our AI orchestration layer.\n\nRequirements:\n• 5+ years of product management experience\n• Experience with B2B SaaS or HR tech products", pipeline: jobCandidates["Product Manager"] },
];

const emptyForm = { title: "", dept: "", location: "", experience: "", description: "" };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [showModal, setShowModal] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [pipelineJob, setPipelineJob] = useState<string | null>(null);
  const [topMatchJob, setTopMatchJob] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  function validate() {
    const e: Partial<typeof emptyForm> = {};
    if (!form.title.trim()) e.title = "Job title is required";
    if (!form.dept.trim()) e.dept = "Department is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.experience.trim()) e.experience = "Experience is required";
    if (!form.description.trim()) e.description = "Job description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const newJob: Job = { title: form.title, dept: form.dept, location: form.location, experience: form.experience, description: form.description, candidates: 0, posted: "Just now", status: "Active", urgent: false, pipeline: [] };
    setJobs([newJob, ...jobs]);
    setForm(emptyForm); setErrors({}); setShowModal(false);
  }

  const getTopMatch = (title: string) => {
    const list = jobs.find(j => j.title === title)?.pipeline ?? [];
    return [...list].sort((a, b) => b.score - a.score)[0];
  };

  return (
    <div className="jobs">
      <div className="page-header">
        <div>
          <h1 className="page-title">Jobs</h1>
          <p className="page-sub">{jobs.filter(j => j.status === "Active").length} open roles · {new Set(jobs.map(j => j.dept)).size} departments</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> New job</button>
      </div>

      <div className="jobs-grid">
        {jobs.map((j) => {
          const top = getTopMatch(j.title);
          const isPipelineOpen = pipelineJob === j.title;
          const isDescOpen = expandedJob === j.title;
          return (
            <div key={j.title} className={`job-card ${isPipelineOpen ? "expanded" : ""}`}>
              <div className="job-card-top">
                <div style={{ flex: 1 }}>
                  <div className="job-title">{j.title}{j.urgent && <span className="urgent-badge">Urgent</span>}</div>
                  <div className="job-dept">{j.dept}</div>
                </div>
                <span className={`status-badge ${j.status === "Active" ? "active" : "paused"}`}>{j.status}</span>
              </div>

              <div className="job-meta">
                <span><MapPin size={12} /> {j.location}</span>
                <span><Briefcase size={12} /> {j.experience}</span>
                <span><Users size={12} /> {j.candidates} candidates</span>
                <span><Clock size={12} /> {j.posted}</span>
              </div>

              {/* Top Match Banner */}
              {top && (
                <div className="top-match-banner" onClick={() => setTopMatchJob(topMatchJob === j.title ? null : j.title)}>
                  <Trophy size={13} color="#f59e0b" />
                  <div className="tm-avatar" style={{ background: top.color }}>{top.initials}</div>
                  <div className="tm-info">
                    <span className="tm-name">{top.name}</span>
                    <span className="tm-label">Top match</span>
                  </div>
                  <div className="tm-score"><Star size={11} color="#f59e0b" fill="#f59e0b" />{top.score}%</div>
                  <ChevronRight size={14} color="#8aaabb" />
                </div>
              )}

              {/* Top Match Detail */}
              {topMatchJob === j.title && top && (
                <div className="top-match-detail">
                  <div className="tmd-row"><span className="tmd-label">Stage</span><span className="stage-badge" style={{ background: stageColor[top.stage], color: stageText[top.stage] }}>{top.stage}</span></div>
                  <div className="tmd-row"><span className="tmd-label">Experience</span><span className="tmd-val">{top.yoe}</span></div>
                  <div className="tmd-row"><span className="tmd-label">Skills</span><div className="tags">{top.tags.map(t => <span key={t} className="tag">{t}</span>)}</div></div>
                  <div className="tmd-score-bar">
                    <span className="tmd-label">AI Match</span>
                    <div className="tmd-bar-wrap"><div className="tmd-bar" style={{ width: `${top.score}%` }} /></div>
                    <span className="tmd-pct">{top.score}%</span>
                  </div>
                </div>
              )}

              {/* Job Desc */}
              {isDescOpen && (
                <div className="job-desc-block">
                  <div className="job-desc-label"><FileText size={12} /> Job Description</div>
                  <pre className="job-desc-text">{j.description}</pre>
                </div>
              )}

              <div className="job-actions">
                <button className="btn-ghost" onClick={() => setExpandedJob(isDescOpen ? null : j.title)}>
                  {isDescOpen ? <><ChevronUp size={13} /> Hide desc</> : <><ChevronDown size={13} /> View desc</>}
                </button>
                <button className={`btn-pipeline ${isPipelineOpen ? "active" : ""}`} onClick={() => setPipelineJob(isPipelineOpen ? null : j.title)}>
                  <Users size={13} /> Pipeline {isPipelineOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <button className="btn-primary-sm">Edit</button>
              </div>

              {/* Pipeline */}
              {isPipelineOpen && (
                <div className="pipeline-section">
                  <div className="pipeline-header">
                    <span className="pipeline-title">Candidates in Pipeline</span>
                    <span className="pipeline-count">{j.pipeline.length} candidates</span>
                  </div>
                  {j.pipeline.length === 0 ? (
                    <div className="pipeline-empty">No candidates yet</div>
                  ) : (
                    <table className="pipeline-table">
                      <thead>
                        <tr><th>Candidate</th><th>AI Score</th><th>Stage</th><th>Skills</th></tr>
                      </thead>
                      <tbody>
                        {[...j.pipeline].sort((a, b) => b.score - a.score).map((c, idx) => (
                          <tr key={c.name} className={idx === 0 ? "top-row" : ""}>
                            <td>
                              <div className="pipe-name-cell">
                                {idx === 0 && <Trophy size={12} color="#f59e0b" />}
                                <div className="pipe-avatar" style={{ background: c.color }}>{c.initials}</div>
                                <div>
                                  <div className="pipe-name">{c.name}</div>
                                  <div className="pipe-yoe">{c.yoe}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="pipe-score">
                                <div className="pipe-score-bar-wrap"><div className="pipe-score-bar" style={{ width: `${c.score}%` }} /></div>
                                <span className="pipe-score-val">{c.score}%</span>
                              </div>
                            </td>
                            <td><span className="stage-badge" style={{ background: stageColor[c.stage], color: stageText[c.stage] }}>{c.stage}</span></td>
                            <td><div className="tags">{c.tags.map(t => <span key={t} className="tag">{t}</span>)}</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Job Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Job Opening</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input className={`form-input ${errors.title ? "input-error" : ""}`} placeholder="e.g. Senior Backend Engineer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  {errors.title && <span className="error-msg"><AlertCircle size={11} /> {errors.title}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className={`form-input ${errors.dept ? "input-error" : ""}`} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                    <option value="">Select department</option>
                    {["Engineering","Design","Product","Analytics","Infrastructure","Marketing","Sales","HR"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.dept && <span className="error-msg"><AlertCircle size={11} /> {errors.dept}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className={`form-input ${errors.location ? "input-error" : ""}`} placeholder="e.g. Bangalore / Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                  {errors.location && <span className="error-msg"><AlertCircle size={11} /> {errors.location}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Required *</label>
                  <input className={`form-input ${errors.experience ? "input-error" : ""}`} placeholder="e.g. 3–5 years" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                  {errors.experience && <span className="error-msg"><AlertCircle size={11} /> {errors.experience}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea className={`form-textarea ${errors.description ? "input-error" : ""}`} placeholder="Describe responsibilities, requirements..." rows={8} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                {errors.description && <span className="error-msg"><AlertCircle size={11} /> {errors.description}</span>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => { setShowModal(false); setForm(emptyForm); setErrors({}); }}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit}>Post Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
