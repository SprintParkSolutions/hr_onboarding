"use client";
import "./JobsPage.css";
import { useEffect, useState } from "react";
import {
  MapPin, Users, Clock, X, ChevronDown, ChevronUp,
  Briefcase, FileText, ChevronRight, Search, Trophy, AlertCircle,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
type Candidate = {
  initials: string; color: string; name: string; score: number;
  stage: string; yoe: string; tags: string[];
  linkedin: string;
};

type Job = {
  title: string; dept: string; location: string; candidates: number;
  posted: string; status: string; urgent: boolean; experience: string;
  description: string; pipeline: Candidate[];
  source: "salesforce" | "linkedin";
  job_offer_id?: string;
};

/* ── LinkedIn sourcing result types ────────────────────── */
type LICandidate = {
  Name: string; Source?: string; Title?: string;
  Snippet?: string; URL?: string;
  Score?: number; Reasoning?: string; Shortlisted?: boolean;
  "Profile URL"?: string;
};

type SourceResult = {
  jd_info: {
    role: string; role_alt: string; seniority: string;
    keywords: string; exp_min: number; exp_max: number; location: string;
  };
  linkedin: {
    all_candidates: LICandidate[];
    ranked_candidates: LICandidate[];
    shortlisted: LICandidate[];
    stats: {
      profiles_found: number; profiles_ranked: number;
      profiles_shortlisted: number; queries_run: number;
    };
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function initialsOf(name: string) {
  const parts = (name || "Candidate").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.slice(0, 2).toUpperCase() || "CA";
}

function avatarColor(name: string) {
  const palette = ["#8b5cf6", "#2563eb", "#0891b2", "#10b981", "#f59e0b", "#ef4444"];
  let hash = 0;
  for (let i = 0; i < (name || "Candidate").length; i += 1) {
    hash = (hash * 31 + (name || "Candidate").charCodeAt(i)) % palette.length;
  }
  return palette[hash];
}

function normalizePipelineCandidate(raw: any): Candidate {
  const name = raw.name || raw.Name || "Unknown Candidate";
  const score = Math.max(0, Math.min(100, Number(raw.score ?? raw.ai_score ?? raw.Score ?? 0) || 0));
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter(Boolean).map(String)
    : (typeof raw.skills === "string"
        ? raw.skills.split(",").map((item: string) => item.trim()).filter(Boolean)
        : []);

  return {
    initials: (raw.initials || initialsOf(name)).toUpperCase(),
    color: raw.color || avatarColor(name),
    name,
    score,
    stage: raw.stage || (score >= 90 ? "Shortlisted" : score >= 80 ? "Interview" : "Screening"),
    yoe: raw.yoe || "N/A",
    tags: tags.slice(0, 5),
    linkedin:
      raw.linkedin ||
      raw.profile_url ||
      raw["Profile URL"] ||
      `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`,
  };
}

function normalizeBackendJobs(rawJobs: any[]): Job[] {
  return rawJobs.map((job: any) => ({
    title: job.title || job.job_offer_name || "Untitled Role",
    dept: job.dept || job.position_name || "Recruitment",
    location: job.location || "Remote",
    candidates: Number(job.candidates ?? job.total_applicants ?? 0) || 0,
    posted: job.posted || "Recently",
    status: job.status || "Active",
    urgent: Boolean(job.urgent),
    experience: job.experience || "N/A",
    description: job.description || job.jd_text || "",
    source: (job.source === "linkedin" ? "linkedin" : "salesforce"),
    pipeline: Array.isArray(job.pipeline) ? job.pipeline.map(normalizePipelineCandidate) : [],
    job_offer_id: job.job_offer_id,
  }));
}

/* ── Seed jobs ──────────────────────────────────────────── */
const jobCandidates: Record<string, Candidate[]> = {
  "Senior Backend Engineer": [
    { initials:"SM", color:"#8b5cf6", name:"Sarah Mitchell",  score:94, stage:"Shortlisted", yoe:"8 yrs", tags:["Python","Kafka","AWS"],    linkedin:"https://linkedin.com/in/sarah-mitchell" },
    { initials:"MG", color:"#2563eb", name:"Marco Greco",     score:91, stage:"Shortlisted", yoe:"6 yrs", tags:["Go","PostgreSQL","AWS"],   linkedin:"https://linkedin.com/in/marco-greco" },
    { initials:"AR", color:"#0891b2", name:"Arjun Rao",       score:83, stage:"Interview",   yoe:"5 yrs", tags:["Python","Redis","GCP"],    linkedin:"https://linkedin.com/in/arjun-rao" },
  ],
  "Product Designer": [
    { initials:"RK", color:"#f59e0b", name:"Rohan Kapoor",    score:88, stage:"Offer Sent",  yoe:"5 yrs", tags:["Figma","UX Research"],    linkedin:"https://linkedin.com/in/rohan-kapoor" },
    { initials:"DS", color:"#8b5cf6", name:"Divya Sharma",    score:82, stage:"Interview",   yoe:"4 yrs", tags:["Figma","Prototyping"],    linkedin:"https://linkedin.com/in/divya-sharma" },
  ],
  "DevOps Engineer": [
    { initials:"MG", color:"#2563eb", name:"Marco Greco",     score:91, stage:"Shortlisted", yoe:"6 yrs", tags:["Kubernetes","Terraform"], linkedin:"https://linkedin.com/in/marco-greco" },
    { initials:"SJ", color:"#10b981", name:"Suresh Joshi",    score:84, stage:"Interview",   yoe:"5 yrs", tags:["Docker","AWS","CI/CD"],   linkedin:"https://linkedin.com/in/suresh-joshi" },
  ],
  "Frontend Engineer": [
    { initials:"YT", color:"#10b981", name:"Yuki Tanaka",     score:81, stage:"Interview",   yoe:"4 yrs", tags:["React","TypeScript"],     linkedin:"https://linkedin.com/in/yuki-tanaka" },
    { initials:"KP", color:"#2563eb", name:"Karan Patel",     score:79, stage:"Screening",   yoe:"3 yrs", tags:["React","Next.js"],        linkedin:"https://linkedin.com/in/karan-patel" },
  ],
  "Data Scientist": [
    { initials:"AL", color:"#ef4444", name:"Aisha Levi",      score:76, stage:"Screening",   yoe:"3 yrs", tags:["Python","ML","SQL"],      linkedin:"https://linkedin.com/in/aisha-levi" },
  ],
  "Product Manager": [
    { initials:"PS", color:"#0891b2", name:"Priya Sharma",    score:85, stage:"Interview",   yoe:"7 yrs", tags:["Roadmapping","Agile"],    linkedin:"https://linkedin.com/in/priya-sharma" },
    { initials:"RV", color:"#8b5cf6", name:"Rohit Verma",     score:80, stage:"Screening",   yoe:"5 yrs", tags:["Product Strategy","SQL"], linkedin:"https://linkedin.com/in/rohit-verma" },
  ],
};

const initialJobs: Job[] = [
  { source:"salesforce", title:"Senior Backend Engineer", dept:"Engineering",   location:"Bangalore / Remote", candidates:142, posted:"3 days ago",  status:"Active", urgent:true,  experience:"5–8 years", description:"We are looking for a Senior Backend Engineer to design and build scalable, high-performance services.\n\nResponsibilities:\n• Design and implement RESTful and event-driven APIs\n• Optimize database queries and system performance\n• Lead code reviews and mentor junior engineers\n\nRequirements:\n• 5+ years of backend development experience\n• Strong proficiency in Python or Go\n• Experience with Kafka, Redis, and PostgreSQL", pipeline: jobCandidates["Senior Backend Engineer"] },
  { source:"salesforce", title:"Product Designer",        dept:"Design",        location:"Mumbai",             candidates:87,  posted:"1 week ago",  status:"Active", urgent:false, experience:"3–6 years", description:"Join our design team to craft intuitive product experiences for our B2B SaaS platform.", pipeline: jobCandidates["Product Designer"] },
  { source:"salesforce", title:"DevOps Engineer",         dept:"Infrastructure",location:"Bangalore",           candidates:34,  posted:"1 day ago",   status:"Active", urgent:true,  experience:"4–7 years", description:"We are hiring a DevOps Engineer to own our cloud infrastructure and deployment pipelines.", pipeline: jobCandidates["DevOps Engineer"] },
  { source:"linkedin",   title:"Frontend Engineer",       dept:"Engineering",   location:"Remote",             candidates:203, posted:"5 days ago",  status:"Active", urgent:false, experience:"2–5 years", description:"We need a Frontend Engineer passionate about performance.", pipeline: jobCandidates["Frontend Engineer"] },
  { source:"linkedin",   title:"Data Scientist",          dept:"Analytics",     location:"Hyderabad",           candidates:56,  posted:"2 weeks ago", status:"Paused", urgent:false, experience:"2–4 years", description:"We are seeking a Data Scientist to build and improve our AI resume screening models.", pipeline: jobCandidates["Data Scientist"] },
  { source:"linkedin",   title:"Product Manager",         dept:"Product",       location:"Delhi / Remote",      candidates:119, posted:"4 days ago",  status:"Active", urgent:false, experience:"5–9 years", description:"We are looking for a strategic Product Manager to own the roadmap for our AI orchestration layer.", pipeline: jobCandidates["Product Manager"] },
];

const stageColor: Record<string, string> = {
  Shortlisted:"rgba(128,178,255,0.2)", "Offer Sent":"rgba(186,159,231,0.25)",
  Interview:"rgba(156,224,255,0.25)", Screening:"rgba(189,242,255,0.3)",
};
const stageText: Record<string, string> = {
  Shortlisted:"#2a5090","Offer Sent":"#6a3a90",Interview:"#2a6080",Screening:"#1a4060",
};

const emptySearch = { role: "", department: "", description: "", experience: "", location: "" };
type SearchForm = typeof emptySearch;

/* ── Search step type ───────────────────────────────────── */
type SearchStep =
  | { phase: "idle" }
  | { phase: "analyzing" }
  | { phase: "searching"; queriesRun: number }
  | { phase: "ranking"; found: number }
  | { phase: "saving" }
  | { phase: "done"; result: SourceResult; jobOfferId: string }
  | { phase: "error"; message: string };

/* ── Job Card ───────────────────────────────────────────── */
function JobCard({ j, source }: { j: Job; source: "salesforce" | "linkedin" }) {
  const [descOpen,     setDescOpen]     = useState(false);
  const [pipelineOpen, setPipelineOpen] = useState(false);

  return (
    <div className={`job-card job-card-${source}`}>
      <div className="job-card-top">
        <div style={{ flex:1 }}>
          <div className="job-title">
            {j.title}
            {j.urgent && <span className="urgent-badge">Urgent</span>}
          </div>
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

      {descOpen && (
        <div className="job-desc-block">
          <div className="job-desc-label"><FileText size={12} /> Job Description</div>
          <pre className="job-desc-text">{j.description}</pre>
        </div>
      )}

      <div className="job-actions">
        <button className="btn-ghost" onClick={() => setDescOpen(p => !p)}>
          {descOpen ? <><ChevronUp size={13} /> Hide desc</> : <><ChevronDown size={13} /> View desc</>}
        </button>
        <button className={`btn-pipeline ${pipelineOpen ? "active" : ""}`} onClick={() => setPipelineOpen(p => !p)}>
          <Users size={13} /> Pipeline {pipelineOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {pipelineOpen && (
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
                <tr><th>Candidate</th><th>AI Score</th><th>Stage</th><th>Skills</th><th>LinkedIn</th></tr>
              </thead>
              <tbody>
                {[...j.pipeline].sort((a, b) => b.score - a.score).map((c, idx) => (
                  <tr key={`${c.name}-${idx}`} className={idx === 0 ? "top-row" : ""}>
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
                        <div className="pipe-score-bar-wrap">
                          <div className="pipe-score-bar" style={{ width:`${c.score}%` }} />
                        </div>
                        <span className="pipe-score-val">{c.score}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="stage-badge" style={{ background:stageColor[c.stage]||"rgba(189,242,255,0.3)", color:stageText[c.stage]||"#1a4060" }}>
                        {c.stage}
                      </span>
                    </td>
                    <td><div className="tags">{c.tags.map(t => <span key={t} className="tag">{t}</span>)}</div></td>
                    <td>
                      <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="pipe-li-link">
                        <span className="pipe-li-logo">in</span>
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Section header ─────────────────────────────────────── */
function SourceSection({ source, jobs }: { source: "salesforce" | "linkedin"; jobs: Job[] }) {
  const isSF = source === "salesforce";
  return (
    <div className="source-section">
      <div className={`source-header source-header-${source}`}>
        <div className="source-header-left">
          {isSF ? (
            <span className="source-logo source-logo-sf">
              <svg width="22" height="16" viewBox="0 0 52 38" fill="none">
                <path d="M21.6 6.4a10.4 10.4 0 0 1 7.4-3.1c3.8 0 7.1 2 9 5a8.3 8.3 0 0 1 3.5-.8c4.6 0 8.4 3.7 8.4 8.4 0 4.6-3.8 8.4-8.4 8.4H12.4C7.2 24.3 3 20.1 3 14.9 3 9.9 6.8 5.9 11.7 5.5a12 12 0 0 1 9.9.9z" fill="white" fillOpacity="0.9"/>
              </svg>
            </span>
          ) : (
            <span className="source-logo source-logo-li">in</span>
          )}
          <div>
            <div className="source-title">
              {isSF ? "Salesforce" : "LinkedIn"} <span className="source-subtitle">— Job Openings</span>
            </div>
            <div className="source-desc">
              {isSF
                ? "Jobs and candidate pipeline synced from Salesforce CRM"
                : "Job postings and applicants sourced from LinkedIn Recruiter"}
            </div>
          </div>
        </div>
        <div className="source-stats">
          <span className="source-stat"><strong>{jobs.length}</strong> jobs</span>
          <span className="source-stat"><strong>{jobs.filter(j => j.status === "Active").length}</strong> active</span>
          <span className="source-stat"><strong>{jobs.reduce((s, j) => s + j.candidates, 0)}</strong> candidates</span>
        </div>
      </div>
      <div className="jobs-grid">
        {jobs.map((j, i) => <JobCard key={j.job_offer_id || `${j.title}-${i}`} j={j} source={source} />)}
      </div>
    </div>
  );
}

/* ── Progress step row ──────────────────────────────────── */
function StepRow({ done, active, label }: { done: boolean; active: boolean; label: string }) {
  return (
    <div className="li-step-row">
      <span className={`li-step-dot ${done ? "done" : active ? "active" : ""}`}>
        {done ? "✓" : active ? <span className="li-mini-spinner" /> : "·"}
      </span>
      <span className={`li-step-label ${active ? "active-label" : done ? "done-label" : ""}`}>{label}</span>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function JobsPage() {
  const [jobs,       setJobs]       = useState<Job[]>(initialJobs);
  const [showModal,  setShowModal]  = useState(false);
  const [searchForm, setSearchForm] = useState<SearchForm>(emptySearch);
  const [step,       setStep]       = useState<SearchStep>({ phase: "idle" });
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const sfJobs = jobs.filter(j => j.source === "salesforce");
  const liJobs = jobs.filter(j => j.source === "linkedin");

  /* ── Load jobs from backend on mount ── */
  useEffect(() => {
    let active = true;
    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`${API_BASE_URL}/jobs-page`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Backend error");
        if (!active) return;
        const next = normalizeBackendJobs(data.jobs || []);
        setJobs(next.length ? next : initialJobs);
      } catch (err) {
        if (!active) return;
        setError("Could not load backend jobs. Showing sample data instead.");
        setJobs(initialJobs);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadJobs();
    return () => { active = false; };
  }, []);

  /* ── Real LinkedIn search + save + add job ── */
  async function handleLinkedInSearch() {
    if (!searchForm.role.trim()) return;

    try {
      /* ── Step 1: Analyze JD + search + rank ── */
      setStep({ phase: "analyzing" });

      const sourceRes = await fetch(`${API_BASE_URL}/source-candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title:   searchForm.role,
          department:  searchForm.department || "General",
          location:    searchForm.location   || "",
          experience:  searchForm.experience || "",
          description: searchForm.description || searchForm.role,
        }),
      });

      if (!sourceRes.ok) {
        const errData = await sourceRes.json().catch(() => ({}));
        throw new Error(errData.detail || "Sourcing failed — check OPENAI_API_KEY and SERPER_API_KEY.");
      }

      const sourceData: SourceResult = await sourceRes.json();
      setStep({ phase: "ranking", found: sourceData.linkedin.stats.profiles_found });

      /* ── Step 2: Save all profiles to MongoDB ── */
      setStep({ phase: "saving" });

      await fetch(`${API_BASE_URL}/save-linkedin-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title:   searchForm.role,
          location:    searchForm.location || "",
          candidates:  sourceData.linkedin.all_candidates,
          shortlisted: sourceData.linkedin.shortlisted,
        }),
      });

      /* ── Step 3: Build pipeline from shortlisted ── */
      const pipeline = sourceData.linkedin.shortlisted.map((c: LICandidate) =>
        normalizePipelineCandidate({
          name:        c.Name,
          score:       c.Score ?? 0,
          profile_url: c["Profile URL"] || c.URL || "",
          tags:        [],
        })
      );

      /* ── Step 4: Persist job to MongoDB via POST /jobs ── */
      const jobRes = await fetch(`${API_BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       searchForm.role,
          dept:        searchForm.department || "Recruitment",
          location:    searchForm.location   || "Remote",
          experience:  searchForm.experience || "N/A",
          description: searchForm.description || searchForm.role,
          status:      "Active",
          urgent:      false,
          posted:      "Just now",
          candidates:  sourceData.linkedin.stats.profiles_found,
          pipeline,
        }),
      });

      const jobData = await jobRes.json();
      const jobOfferId: string = jobData.job_offer_id || `li-${Date.now()}`;

      /* ── Step 5: Add new job to UI immediately ── */
      const newJob: Job = {
        title:       searchForm.role,
        dept:        searchForm.department || "Recruitment",
        location:    searchForm.location   || "Remote",
        candidates:  sourceData.linkedin.stats.profiles_found,
        posted:      "Just now",
        status:      "Active",
        urgent:      false,
        experience:  searchForm.experience || "N/A",
        description: searchForm.description || searchForm.role,
        source:      "linkedin",
        pipeline,
        job_offer_id: jobOfferId,
      };

      setJobs(prev => [newJob, ...prev]);
      setStep({ phase: "done", result: sourceData, jobOfferId });

    } catch (err: any) {
      setStep({ phase: "error", message: err.message || "Something went wrong." });
    }
  }

  function handleClose() {
    setShowModal(false);
    setSearchForm(emptySearch);
    setStep({ phase: "idle" });
  }

  const isSearching = ["analyzing","searching","ranking","saving"].includes(step.phase);
  const isDone      = step.phase === "done";
  const isError     = step.phase === "error";

  return (
    <div className="jobs">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Jobs</h1>
          <p className="page-sub">
            {jobs.filter(j => j.status === "Active").length} open roles ·{" "}
            {new Set(jobs.map(j => j.dept)).size} departments ·{" "}
            <span className="source-pill sf-pill">Salesforce {sfJobs.length}</span>{" "}
            <span className="source-pill li-pill">LinkedIn {liJobs.length}</span>
            {loading ? " · loading…" : ""}
          </p>
        </div>
        <button className="btn-linkedin" onClick={() => setShowModal(true)}>
          <span className="li-btn-logo">in</span>
          Search on LinkedIn
        </button>
      </div>

      {error && (
        <p className="page-sub" style={{ color:"#ef4444", marginTop:"-6px" }}>{error}</p>
      )}

      <SourceSection source="salesforce" jobs={sfJobs} />
      <SourceSection source="linkedin"   jobs={liJobs} />

      {/* ── LinkedIn Search Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={!isSearching ? handleClose : undefined}>
          <div className="li-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="li-modal-header">
              <div className="li-modal-header-left">
                <span className="li-modal-logo">in</span>
                <div>
                  <div className="li-modal-title">Search Jobs on LinkedIn</div>
                  <div className="li-modal-sub">Find candidates from LinkedIn's talent network</div>
                </div>
              </div>
              {!isSearching && (
                <button className="close-btn" onClick={handleClose}><X size={18} /></button>
              )}
            </div>

            <div className="li-modal-body">

              {/* ── Error state ── */}
              {isError && (
                <div className="li-error-screen">
                  <AlertCircle size={36} color="#ef4444" />
                  <div className="li-error-title">Search Failed</div>
                  <div className="li-error-msg">{(step as any).message}</div>
                  <button className="li-new-search-btn" onClick={() => setStep({ phase: "idle" })}>
                    Try Again
                  </button>
                </div>
              )}

              {/* ── Searching progress ── */}
              {isSearching && (
                <div className="li-progress-screen">
                  <div className="li-progress-title">Sourcing candidates for <strong>{searchForm.role}</strong>…</div>
                  <div className="li-steps">
                    <StepRow done={["ranking","saving"].includes(step.phase)} active={step.phase==="analyzing"} label="Analyzing job description with AI" />
                    <StepRow done={["saving"].includes(step.phase)}           active={step.phase==="ranking"}   label={`Searching LinkedIn profiles${step.phase==="ranking" ? ` — ${(step as any).found ?? "…"} found` : ""}`} />
                    <StepRow done={false}                                     active={step.phase==="saving"}    label="Scoring & shortlisting candidates" />
                    <StepRow done={false}                                     active={false}                    label="Saving to database" />
                  </div>
                </div>
              )}

              {/* ── Done state ── */}
              {isDone && (() => {
                const s = step as Extract<SearchStep, { phase: "done" }>;
                const stats = s.result.linkedin.stats;
                return (
                  <div className="li-results-screen">
                    <div className="li-results-icon-big">✓</div>
                    <div className="li-results-title">Search Complete!</div>
                    <div className="li-results-sub">
                      Found <strong>{stats.profiles_found} profiles</strong> matching &ldquo;{searchForm.role}&rdquo;
                      {searchForm.location ? ` in ${searchForm.location}` : ""}.{" "}
                      <strong>{stats.profiles_shortlisted} shortlisted</strong> by AI and added to the LinkedIn section below.
                    </div>
                    <div className="li-stats-row">
                      <div className="li-stat-pill"><span>{stats.profiles_found}</span><label>Found</label></div>
                      <div className="li-stat-pill"><span>{stats.profiles_ranked}</span><label>Ranked</label></div>
                      <div className="li-stat-pill highlight"><span>{stats.profiles_shortlisted}</span><label>Shortlisted</label></div>
                    </div>
                    <button className="li-new-search-btn" onClick={() => { setStep({ phase: "idle" }); setSearchForm(emptySearch); }}>
                      <Search size={13} /> New Search
                    </button>
                  </div>
                );
              })()}

              {/* ── Search form (idle) ── */}
              {step.phase === "idle" && (
                <>
                  <div className="li-field-group">
                    <label className="li-label"><Briefcase size={12} /> Job Role / Title *</label>
                    <input
                      className="li-input"
                      placeholder="e.g. Senior Backend Engineer, ML Engineer…"
                      value={searchForm.role}
                      onChange={e => setSearchForm({ ...searchForm, role: e.target.value })}
                    />
                  </div>

                  <div className="li-field-group">
                    <label className="li-label"><Briefcase size={12} /> Department</label>
                    <input
                      className="li-input"
                      placeholder="e.g. Engineering, Product, Design…"
                      value={searchForm.department}
                      onChange={e => setSearchForm({ ...searchForm, department: e.target.value })}
                    />
                  </div>

                  <div className="li-field-group">
                    <label className="li-label"><FileText size={12} /> Job Description / Keywords</label>
                    <textarea
                      className="li-textarea"
                      rows={3}
                      placeholder="e.g. React, distributed systems, team leadership…"
                      value={searchForm.description}
                      onChange={e => setSearchForm({ ...searchForm, description: e.target.value })}
                    />
                  </div>

                  <div className="li-filters-row">
                    <div className="li-field-group">
                      <label className="li-label"><Clock size={12} /> Experience Level</label>
                      <select
                        className="li-select"
                        value={searchForm.experience}
                        onChange={e => setSearchForm({ ...searchForm, experience: e.target.value })}
                      >
                        <option value="">Any experience</option>
                        <option value="0-2 years">Entry level (0–2 yrs)</option>
                        <option value="2-4 years">Associate (2–4 yrs)</option>
                        <option value="4-8 years">Mid-Senior (4–8 yrs)</option>
                        <option value="8+ years">Senior / Lead (8+ yrs)</option>
                        <option value="10+ years">Director / Executive</option>
                      </select>
                    </div>

                    <div className="li-field-group">
                      <label className="li-label"><MapPin size={12} /> Location</label>
                      <input
                        className="li-input"
                        placeholder="e.g. Bangalore, Hyderabad, Remote…"
                        value={searchForm.location}
                        onChange={e => setSearchForm({ ...searchForm, location: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="li-modal-footer">
              {!isSearching && !isDone && (
                <button className="li-cancel-btn" onClick={handleClose}>Cancel</button>
              )}
              {isDone && (
                <button className="li-cancel-btn" onClick={handleClose}>Close</button>
              )}
              {step.phase === "idle" && (
                <button
                  className="li-search-btn"
                  onClick={handleLinkedInSearch}
                  disabled={!searchForm.role.trim()}
                >
                  <Search size={14} /> Search LinkedIn
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}