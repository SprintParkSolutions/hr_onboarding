"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, Phone, Bell, LogOut, Upload, CheckCircle, FileText, X, AlertCircle, Plus, Trash2, Loader2 } from "lucide-react";

// ── Backend base URL — point this at your FastAPI server ─────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const PROFILES: Record<string, { name:string; title:string; initials:string; color:string }> = {
  "laxman.k@candidate.app":    { name:"Laxman Kosana",    title:"Salesforce Developer", initials:"LK", color:"#8b5cf6" },
  "naresh.p@candidate.app":    { name:"Naresh Punagani",  title:"Full Stack Developer", initials:"NP", color:"#f59e0b" },
  "edurupaka.b@candidate.app": { name:"Edurupaka Bhavana",title:"AI Engineer",          initials:"EB", color:"#10b981" },
};

const NOTIFICATIONS = [
  { id:1, text:"Joining date confirmed: 21 Jul 2026. Please upload your documents.", time:"2h ago",  read:false },
  { id:2, text:"IT Admin will set up your system on Day 1.",                         time:"1d ago",  read:false },
  { id:3, text:"Offer letter sent to your email. Please sign and return.",           time:"2d ago",  read:true  },
];

const POC = [
  { id:"hr", num:1, gradient:"linear-gradient(135deg,#6366f1,#818cf8)", bg:"rgba(99,102,241,0.05)",  border:"rgba(99,102,241,0.18)",  accent:"#4f46e5", badge:"HR", badgeColor:"#B875A0",
    title:"HR — Human Resources", sub:"Primary contact for people, documents & benefits",
    name:"Priya R.", role:"HR Manager · Talent Acquisition", email:"priya.r@recruitai.app", phone:"+91 98765 43210",
    items:[{e:"🖥️",l:"Office Email"},{e:"🪪",l:"ID & Access Card"},{e:"📄",l:"Offer Letter"},{e:"📋",l:"Appointment Letter"},{e:"✍️",l:"NDA Signing"},{e:"🏥",l:"Medical Insurance"},{e:"💰",l:"ESI Registration"},{e:"🏦",l:"PF / UAN Setup"}],
  },
  { id:"it", num:2, gradient:"linear-gradient(135deg,#0891b2,#38bdf8)", bg:"rgba(8,145,178,0.05)",   border:"rgba(8,145,178,0.18)",   accent:"#0369a1", badge:"IT", badgeColor:"#0891b2",
    title:"IT Admin", sub:"Hardware, software and system access",
    name:"Ravi Kumar", role:"IT Administrator", email:"it.admin@recruitai.app", phone:"+91 91234 56789",
    items:[{e:"💻",l:"Asset Receiving"},{e:"🔑",l:"System Login"},{e:"🔒",l:"VPN Access"}],
  },
  { id:"tl", num:3, gradient:"linear-gradient(135deg,#10b981,#34d399)", bg:"rgba(16,185,129,0.05)",  border:"rgba(16,185,129,0.18)",  accent:"#065f46", badge:"TL", badgeColor:"#10b981",
    title:"Team Lead", sub:"Day-to-day technical and project contact",
    name:"Arjun K.", role:"Engineering Lead", email:"arjun.k@recruitai.app", phone:"+91 99887 76655",
    items:[{e:"👥",l:"Team Introduction"},{e:"📌",l:"Work Assignment"}],
  },
];

/* ── Static docs ── */
type DocKey = "grad_marksheets" | "pc" | "cmm" | "pgrad_certs" | "exp_letters" | "relieving_letter" | "payslip_1" | "payslip_2" | "payslip_3";

const STATIC_DOCS: { key:DocKey; icon:string; label:string; desc:string; required:boolean }[] = [
  { key:"grad_marksheets", icon:"📚", label:"Graduation Marksheets",           desc:"Semester-wise marksheets — provided by college",              required:true  },
  { key:"pc",              icon:"📜", label:"Provisional Certificate (PC)",    desc:"Provisional degree certificate — issued by your college",     required:true  },
  { key:"cmm",             icon:"🏛️", label:"CMM (College Migration/Marks)",   desc:"Consolidated marks memo / migration cert — from college",     required:true  },
  { key:"pgrad_certs",     icon:"🎓", label:"PG / Other Certificates",         desc:"Post-grad, diplomas, professional certifications",            required:false },
  { key:"exp_letters",     icon:"💼", label:"Experience Letters",              desc:"Experience letters from all previous employers",              required:false },
  { key:"relieving_letter",icon:"📩", label:"Relieving Letter",               desc:"Relieving letter from your last employer",                    required:false },
  { key:"payslip_1",       icon:"💰", label:"Pay Slip — Month 1 (Latest)",     desc:"Most recent month's pay slip from previous company",         required:false },
  { key:"payslip_2",       icon:"💰", label:"Pay Slip — Month 2",              desc:"Second most recent month's pay slip",                        required:false },
  { key:"payslip_3",       icon:"💰", label:"Pay Slip — Month 3",              desc:"Third most recent month's pay slip",                         required:false },
];

const DEGREE_TYPES = ["B.Tech","B.E","BCA","BBA","B.Sc","MBA","M.Tech","MCA","M.Sc","Ph.D","Diploma","Other"];
const DEGREE_DOC_KEY = "degree_certificate";

// Shape returned by the backend for every uploaded document (static or degree)
type UploadedDoc = {
  id: string;
  doc_key: string;
  degree_label: string | null;
  filename: string;
  size_bytes: number;
  uploaded_at: string;
};

// A degree "row" in the UI — either freshly added (no server doc yet) or
// backed by an already-uploaded document.
type DegreeEntry = { rowId: string; label: string; doc: UploadedDoc | null; uploading: boolean };

export default function CandidateDashboard() {
  const [profile,      setProfile]      = useState<typeof PROFILES[string]|null>(null);
  const [candidateId,  setCandidateId]  = useState<string | null>(null);
  const [notifOpen,    setNotifOpen]    = useState(false);

  // static doc_key -> uploaded doc (or undefined if not uploaded yet)
  const [uploads,      setUploads]      = useState<Partial<Record<DocKey, UploadedDoc>>>({});
  const [uploadingKey, setUploadingKey] = useState<DocKey | null>(null);

  const [degrees,      setDegrees]      = useState<DegreeEntry[]>([{ rowId:"d1", label:"B.Tech", doc:null, uploading:false }]);

  const [msg,           setMsg]          = useState<{type:"success"|"error";text:string}|null>(null);
  const [loadingInitial,setLoadingInitial] = useState(true);
  const [submitting,    setSubmitting]   = useState(false);

  const staticRefs  = useRef<Partial<Record<DocKey,HTMLInputElement>>>({});
  const degreeRefs  = useRef<Record<string,HTMLInputElement>>({});

  // ── Resolve who's logged in ─────────────────────────────────────────────
  useEffect(() => {
    const email = (typeof window!=="undefined" && localStorage.getItem("candidateEmail")) || "laxman.k@candidate.app";
    setProfile(PROFILES[email] ?? PROFILES["laxman.k@candidate.app"]);

    const id = typeof window!=="undefined" ? localStorage.getItem("candidateId") : null;
    setCandidateId(id);
  }, []);

  // ── Load whatever's already been uploaded ──────────────────────────────
  const loadExistingDocuments = useCallback(async () => {
    if (!candidateId) { setLoadingInitial(false); return; }
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/documents`);
      if (!res.ok) throw new Error(await res.text());
      const data: { documents: UploadedDoc[] } = await res.json();

      const staticMap: Partial<Record<DocKey, UploadedDoc>> = {};
      const degreeDocs: UploadedDoc[] = [];
      for (const d of data.documents) {
        if (d.doc_key === DEGREE_DOC_KEY) degreeDocs.push(d);
        else staticMap[d.doc_key as DocKey] = d;
      }
      setUploads(staticMap);
      if (degreeDocs.length) {
        setDegrees(degreeDocs.map(d => ({
          rowId: d.id, label: d.degree_label || "B.Tech", doc: d, uploading: false,
        })));
      }
    } catch (e) {
      console.error("Failed to load existing documents:", e);
      setMsg({ type:"error", text:"Couldn't load your previously uploaded documents. You can still upload." });
    } finally {
      setLoadingInitial(false);
    }
  }, [candidateId]);

  useEffect(() => { loadExistingDocuments(); }, [loadExistingDocuments]);

  // ── Client-side pre-checks ───────────────────────────────────────────────
  function validatePDF(file: File): string | null {
    if (file.type !== "application/pdf") return "Only PDF files accepted.";
    if (file.size > 10 * 1024 * 1024)    return "File must be under 10 MB.";
    return null;
  }

  // ── Upload a static doc immediately on selection ─────────────────────────
  async function setStaticFile(key: DocKey, file: File | null) {
    if (!file) return;
    const err = validatePDF(file);
    if (err) { setMsg({ type:"error", text: err }); return; }
    if (!candidateId) { setMsg({ type:"error", text:"You're not signed in properly — no candidate id found." }); return; }

    setMsg(null);
    setUploadingKey(key);
    try {
      const form = new FormData();
      form.append("doc_key", key);
      form.append("file", file);

      const res = await fetch(`${API_BASE}/candidates/${candidateId}/documents/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error((detail as any).detail || "Upload failed.");
      }
      const uploaded: UploadedDoc = await res.json();
      setUploads(p => ({ ...p, [key]: uploaded }));
    } catch (e: any) {
      setMsg({ type:"error", text: e.message || "Upload failed. Please try again." });
    } finally {
      setUploadingKey(null);
    }
  }

  async function removeStatic(key: DocKey) {
    const existing = uploads[key];
    if (!existing || !candidateId) return;
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/documents/${existing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setUploads(p => { const n = { ...p }; delete n[key]; return n; });
    } catch {
      setMsg({ type:"error", text:"Couldn't remove that file. Please try again." });
    }
  }

  // ── Degree rows ──────────────────────────────────────────────────────────
  function addDegree() {
    setDegrees(p => [...p, { rowId:`d${Date.now()}`, label:"B.Tech", doc:null, uploading:false }]);
  }

  async function removeDegree(rowId: string) {
    const row = degrees.find(d => d.rowId === rowId);
    if (row?.doc && candidateId) {
      try {
        await fetch(`${API_BASE}/candidates/${candidateId}/documents/${row.doc.id}`, { method: "DELETE" });
      } catch {
        setMsg({ type:"error", text:"Couldn't remove that document on the server, but it's been cleared here." });
      }
    }
    setDegrees(p => p.filter(d => d.rowId !== rowId));
  }

  function setDegLabel(rowId: string, label: string) {
    setDegrees(p => p.map(d => d.rowId === rowId ? { ...d, label } : d));
  }

  async function setDegFile(rowId: string, file: File | null) {
    if (!file) return;
    const err = validatePDF(file);
    if (err) { setMsg({ type:"error", text: err }); return; }
    if (!candidateId) { setMsg({ type:"error", text:"You're not signed in properly — no candidate id found." }); return; }

    const row = degrees.find(d => d.rowId === rowId);
    if (!row) return;

    setMsg(null);
    setDegrees(p => p.map(d => d.rowId === rowId ? { ...d, uploading:true } : d));
    try {
      const form = new FormData();
      form.append("doc_key", DEGREE_DOC_KEY);
      form.append("degree_label", row.label);
      form.append("file", file);

      const res = await fetch(`${API_BASE}/candidates/${candidateId}/documents/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error((detail as any).detail || "Upload failed.");
      }
      const uploaded: UploadedDoc = await res.json();
      setDegrees(p => p.map(d => d.rowId === rowId ? { ...d, doc: uploaded, uploading:false } : d));
    } catch (e: any) {
      setMsg({ type:"error", text: e.message || "Upload failed. Please try again." });
      setDegrees(p => p.map(d => d.rowId === rowId ? { ...d, uploading:false } : d));
    }
  }

  async function clearDegFile(rowId: string) {
    const row = degrees.find(d => d.rowId === rowId);
    if (!row?.doc || !candidateId) return;
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/documents/${row.doc.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setDegrees(p => p.map(d => d.rowId === rowId ? { ...d, doc:null } : d));
    } catch {
      setMsg({ type:"error", text:"Couldn't remove that file. Please try again." });
    }
  }

  // ── Final submit ─────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!candidateId) { setMsg({ type:"error", text:"You're not signed in properly — no candidate id found." }); return; }
    if (degrees.length === 0) { setMsg({type:"error",text:"Add at least one degree certificate."}); return; }
    const noFile = degrees.filter(d => !d.doc);
    if (noFile.length) { setMsg({type:"error",text:`Upload PDF for degree: ${noFile.map(d=>d.label).join(", ")}`}); return; }
    const missingReq = STATIC_DOCS.filter(d => d.required && !uploads[d.key]).map(d => d.label);
    if (missingReq.length) { setMsg({type:"error",text:`Required: ${missingReq.join(", ")}`}); return; }

    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/documents/submit`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submit failed.");
      setMsg({ type:"success", text: data.message || `${data.total_documents} document(s) submitted! HR will review and confirm within 2 business days.` });
    } catch (e: any) {
      setMsg({ type:"error", text: e.message || "Something went wrong submitting your documents. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!profile) return null;

  const totalUploaded = Object.keys(uploads).length + degrees.filter(d=>d.doc).length;
  const reqCount = STATIC_DOCS.filter(d=>d.required).length + 1;
  const reqDone  = STATIC_DOCS.filter(d=>d.required&&uploads[d.key]).length + (degrees.length>0&&degrees.every(d=>d.doc)?1:0);

  const C = {
    card:  (extra?:React.CSSProperties):React.CSSProperties => ({background:"#fff",border:"1px solid rgba(221,208,232,0.4)",borderRadius:14,...extra}),
    label: ():React.CSSProperties => ({fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase" as const,letterSpacing:"0.06em"}),
    req:   ():React.CSSProperties => ({fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:20,background:"rgba(239,68,68,0.1)",color:"#dc2626"}),
    opt:   ():React.CSSProperties => ({fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:20,background:"rgba(221,208,232,0.3)",color:"#9090B0"}),
  };

  return (
    <div style={{minHeight:"100vh",background:"#f4f3ff",fontFamily:"inherit"}}>
      {/* NAV */}
      <header style={{background:"#fff",borderBottom:"1px solid rgba(221,208,232,0.4)",padding:"0 28px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,boxShadow:"0 1px 6px rgba(99,102,241,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#B875A0,#7AB8D8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" fill="white" opacity="0.95"/><path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.95"/><circle cx="19" cy="9" r="2" fill="white" opacity="0.85"/></svg>
          </div>
          <span style={{fontWeight:800,fontSize:14,color:"#1e1b4b"}}>Recruit<span style={{color:"#0EA5E9"}}>AI</span></span>
          <span style={{fontSize:10,color:"#b0a8c0",marginLeft:3,background:"rgba(99,102,241,0.08)",padding:"2px 8px",borderRadius:20,fontWeight:600}}>Candidate</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{position:"relative"}}>
            <button onClick={()=>setNotifOpen(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,color:"#6b7280",position:"relative"}}>
              <Bell size={17}/>
              {NOTIFICATIONS.filter(n=>!n.read).length>0&&<span style={{position:"absolute",top:1,right:1,width:13,height:13,borderRadius:"50%",background:"#ef4444",color:"#fff",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{NOTIFICATIONS.filter(n=>!n.read).length}</span>}
            </button>
            {notifOpen&&(
              <div style={{position:"absolute",right:0,top:40,width:330,background:"#fff",border:"1px solid rgba(221,208,232,0.4)",borderRadius:12,boxShadow:"0 10px 32px rgba(99,102,241,0.13)",zIndex:200}}>
                <div style={{padding:"11px 15px",borderBottom:"1px solid rgba(221,208,232,0.3)",fontWeight:700,fontSize:12,color:"#1e1b4b",display:"flex",justifyContent:"space-between"}}>Notifications<button onClick={()=>setNotifOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af"}}><X size={13}/></button></div>
                {NOTIFICATIONS.map(n=>(
                  <div key={n.id} style={{padding:"11px 15px",borderBottom:"1px solid rgba(221,208,232,0.1)",background:n.read?"#fff":"rgba(99,102,241,0.03)"}}>
                    <p style={{margin:"0 0 2px",fontSize:12,color:"#374151",lineHeight:1.5}}>{n.text}</p>
                    <span style={{fontSize:10,color:"#9ca3af"}}>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:profile.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{profile.initials}</div>
            <div><div style={{fontSize:12,fontWeight:700,color:"#1e1b4b"}}>{profile.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>{profile.title}</div></div>
          </div>
          <button onClick={()=>{localStorage.removeItem("candidateEmail");localStorage.removeItem("candidateId");window.location.href="/login";}} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 11px",background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.14)",borderRadius:7,fontSize:11,fontWeight:600,color:"#dc2626",cursor:"pointer",fontFamily:"inherit"}}>
            <LogOut size={12}/> Sign out
          </button>
        </div>
      </header>

      <main style={{maxWidth:980,margin:"0 auto",padding:"28px 20px 56px",display:"flex",flexDirection:"column",gap:32}}>
        {/* WELCOME */}
        <div style={{background:"linear-gradient(135deg,#6366f1,#818cf8,#a78bfa)",borderRadius:18,padding:"26px 32px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,boxShadow:"0 8px 28px rgba(99,102,241,0.25)"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,opacity:0.8,marginBottom:5,letterSpacing:"0.05em"}}>ONBOARDING PORTAL</div>
            <h1 style={{margin:"0 0 5px",fontSize:22,fontWeight:800}}>Welcome, {profile.name.split(" ")[0]}! 🎉</h1>
            <p style={{margin:0,fontSize:13,opacity:0.85}}>Complete the steps below for a smooth Day 1 at RecruitAI.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:9,padding:"8px 16px",fontSize:12,fontWeight:600}}>Role: <strong>{profile.title}</strong></div>
            <div style={{background:"rgba(255,255,255,0.12)",borderRadius:9,padding:"8px 16px",fontSize:12,fontWeight:600}}>Docs: {reqDone}/{reqCount} required done</div>
          </div>
        </div>

        {!candidateId && (
          <div style={{display:"flex",gap:10,padding:"11px 15px",background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.18)",borderRadius:9}}>
            <AlertCircle size={15} color="#dc2626" style={{flexShrink:0,marginTop:1}}/>
            <p style={{margin:0,fontSize:12,color:"#b02030",lineHeight:1.6}}>
              No candidate account is linked to this session, so uploads can&apos;t be saved. Please sign in again.
            </p>
          </div>
        )}

        {/* SECTION 1 — POC */}
        <section>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
            <div style={{width:4,height:22,borderRadius:2,background:"linear-gradient(135deg,#6366f1,#B875A0)"}}/>
            <h2 style={{margin:0,fontSize:16,fontWeight:800,color:"#1e1b4b"}}>POC Information</h2>
            <span style={{fontSize:11,color:"#9ca3af"}}>Your Points of Contact</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {POC.map(sec=>(
              <div key={sec.id} style={{...C.card(),border:`1px solid ${sec.border}`,overflow:"hidden"}}>
                <div style={{background:sec.gradient,padding:"13px 22px",display:"flex",alignItems:"center",gap:11}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>{sec.num}</div>
                  <div><div style={{fontWeight:800,fontSize:14,color:"#fff"}}>{sec.title}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{sec.sub}</div></div>
                </div>
                <div style={{padding:"16px 22px",display:"flex",gap:18,flexWrap:"wrap"}}>
                  <div style={{display:"flex",gap:11,padding:"13px 15px",background:sec.bg,borderRadius:10,border:`1px solid ${sec.border}`,flex:"0 0 auto",minWidth:250,alignItems:"flex-start"}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:sec.badgeColor,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{sec.badge}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#1e1b4b",marginBottom:1}}>{sec.name}</div>
                      <div style={{fontSize:11,color:"#6b7280",marginBottom:9}}>{sec.role}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:5}}>
                        <a href={`mailto:${sec.email}`} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",background:"#fff",border:`1px solid ${sec.border}`,borderRadius:7,fontSize:11,fontWeight:600,color:sec.accent,textDecoration:"none"}}><Mail size={11}/>{sec.email}</a>
                        <a href={`tel:${sec.phone}`}  style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",background:"#fff",border:`1px solid ${sec.border}`,borderRadius:7,fontSize:11,fontWeight:600,color:sec.accent,textDecoration:"none"}}><Phone size={11}/>{sec.phone}</a>
                      </div>
                    </div>
                  </div>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{...C.label(),marginBottom:9}}>Contact for</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {sec.items.map(it=>(
                        <span key={it.l} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 11px",background:sec.bg,border:`1px solid ${sec.border}`,borderRadius:20,fontSize:11,fontWeight:600,color:sec.accent}}>{it.e} {it.l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,padding:"11px 15px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:9,marginTop:12}}>
            <span style={{fontSize:15,flexShrink:0}}>💡</span>
            <p style={{margin:0,fontSize:11,color:"#92400e",lineHeight:1.7}}><strong>Tip:</strong> Contact HR at least <strong>3 business days</strong> before joining. IT setup is on Day 1. Connect with Team Lead for your first sprint.</p>
          </div>
        </section>

        {/* SECTION 2 — DOCUMENT UPLOAD */}
        <section>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
            <div style={{width:4,height:22,borderRadius:2,background:"linear-gradient(135deg,#f59e0b,#ef4444)"}}/>
            <h2 style={{margin:0,fontSize:16,fontWeight:800,color:"#1e1b4b"}}>Upload Documents</h2>
            <span style={{fontSize:11,color:"#9ca3af"}}>PDF only · Max 10 MB per file</span>
            <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:totalUploaded>0?"rgba(16,185,129,0.1)":"rgba(221,208,232,0.3)",color:totalUploaded>0?"#065f46":"#9090B0"}}>{totalUploaded} uploaded</span>
          </div>

          {/* Alert */}
          {msg&&(
            <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 16px",borderRadius:10,marginBottom:16,background:msg.type==="success"?"rgba(16,185,129,0.08)":"rgba(220,53,69,0.07)",border:`1px solid ${msg.type==="success"?"rgba(16,185,129,0.25)":"rgba(220,53,69,0.2)"}`}}>
              {msg.type==="success"?<CheckCircle size={15} color="#10b981" style={{flexShrink:0,marginTop:1}}/>:<AlertCircle size={15} color="#dc2626" style={{flexShrink:0,marginTop:1}}/>}
              <p style={{margin:0,fontSize:12,color:msg.type==="success"?"#065f46":"#b02030",lineHeight:1.5,flex:1}}>{msg.text}</p>
              <button onClick={()=>setMsg(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",flexShrink:0}}><X size={13}/></button>
            </div>
          )}

          {loadingInitial ? (
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"20px 0",color:"#9ca3af",fontSize:12}}>
              <Loader2 size={14} className="animate-spin" /> Loading your documents…
            </div>
          ) : (
          <>
          {/* ── Degree Certificates (dynamic) ── */}
          <div style={{...C.card(),padding:"18px 20px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:22,lineHeight:1}}>🎓</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#1e1b4b"}}>Degree Certificates</span>
                  <span style={C.req()}>Required</span>
                </div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>Select how many degrees you completed — add each and upload its PDF</div>
              </div>
              <button onClick={addDegree} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.22)",borderRadius:8,fontSize:12,fontWeight:600,color:"#4f46e5",cursor:"pointer",fontFamily:"inherit"}}><Plus size={13}/> Add Degree</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {degrees.map((deg,idx)=>(
                <div key={deg.rowId} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:deg.doc?"rgba(240,253,244,0.6)":"rgba(248,247,255,0.7)",border:deg.doc?"1px solid rgba(16,185,129,0.3)":"1px solid rgba(221,208,232,0.4)",borderRadius:10,flexWrap:"wrap"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{idx+1}</div>
                  <select value={deg.label} disabled={!!deg.doc} onChange={e=>setDegLabel(deg.rowId,e.target.value)} style={{padding:"6px 10px",border:"1px solid rgba(221,208,232,0.6)",borderRadius:8,fontSize:12,fontWeight:600,color:"#1e1b4b",background:"#fff",cursor:deg.doc?"not-allowed":"pointer",outline:"none",fontFamily:"inherit"}}>
                    {DEGREE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  {deg.uploading ? (
                    <div style={{flex:1,minWidth:180,padding:"7px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:12,color:"#6366f1"}}>
                      <Loader2 size={13} className="animate-spin" /> Uploading…
                    </div>
                  ) : deg.doc ? (
                    <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",background:"rgba(16,185,129,0.1)",borderRadius:8,border:"1px solid rgba(16,185,129,0.25)",flex:1,minWidth:180}}>
                      <FileText size={12} color="#10b981" style={{flexShrink:0}}/>
                      <span style={{fontSize:12,color:"#065f46",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{deg.doc.filename}</span>
                      <button onClick={()=>clearDegFile(deg.rowId)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:0}}><X size={12}/></button>
                    </div>
                  ):(
                    <button onClick={()=>degreeRefs.current[deg.rowId]?.click()} style={{flex:1,minWidth:180,padding:"7px 0",border:"1.5px dashed rgba(99,102,241,0.3)",borderRadius:8,background:"rgba(99,102,241,0.03)",fontSize:12,fontWeight:600,color:"#6366f1",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontFamily:"inherit"}}>
                      <Upload size={12}/> Upload {deg.label} PDF
                    </button>
                  )}
                  <input ref={el=>{if(el)degreeRefs.current[deg.rowId]=el;}} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>setDegFile(deg.rowId,e.target.files?.[0]??null)}/>
                  {degrees.length>1&&<button onClick={()=>removeDegree(deg.rowId)} style={{background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.15)",borderRadius:7,padding:"5px 7px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center"}}><Trash2 size={12}/></button>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Static documents grid ── */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:11}}>
            {STATIC_DOCS.map(doc=>{
              const file = uploads[doc.key];
              const isUploading = uploadingKey === doc.key;
              return(
                <div key={doc.key} style={{...C.card(),padding:"15px 17px",border:file?"1px solid rgba(16,185,129,0.3)":"1px solid rgba(221,208,232,0.4)",background:file?"rgba(240,253,244,0.5)":"#fff",transition:"all .15s"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:11}}>
                    <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>{doc.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#1e1b4b"}}>{doc.label}</span>
                        <span style={doc.required?C.req():C.opt()}>{doc.required?"Required":"Optional"}</span>
                      </div>
                      <div style={{fontSize:11,color:"#9ca3af",marginTop:2,lineHeight:1.4}}>{doc.desc}</div>
                    </div>
                  </div>
                  {isUploading ? (
                    <div style={{width:"100%",padding:"8px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:11,color:"#6366f1"}}>
                      <Loader2 size={12} className="animate-spin" /> Uploading…
                    </div>
                  ) : file ? (
                    <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 11px",background:"rgba(16,185,129,0.1)",borderRadius:8,border:"1px solid rgba(16,185,129,0.25)"}}>
                      <FileText size={12} color="#10b981" style={{flexShrink:0}}/>
                      <span style={{fontSize:11,color:"#065f46",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file.filename}</span>
                      <button onClick={()=>removeStatic(doc.key)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:0,flexShrink:0}}><X size={12}/></button>
                    </div>
                  ):(
                    <button onClick={()=>staticRefs.current[doc.key]?.click()} style={{width:"100%",padding:"8px 0",border:"1.5px dashed rgba(99,102,241,0.32)",borderRadius:8,background:"rgba(99,102,241,0.03)",fontSize:11,fontWeight:600,color:"#6366f1",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontFamily:"inherit"}}>
                      <Upload size={12}/> Choose PDF
                    </button>
                  )}
                  <input ref={el=>{if(el)staticRefs.current[doc.key]=el;}} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>setStaticFile(doc.key,e.target.files?.[0]??null)}/>
                </div>
              );
            })}
          </div>
          </>
          )}

          {/* Submit */}
          <div style={{marginTop:20,display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
            <span style={{fontSize:12,color:"#9ca3af"}}>{reqDone}/{reqCount} required · {totalUploaded} total uploaded</span>
            <button onClick={handleSubmit} disabled={reqDone<reqCount || submitting || !candidateId} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"11px 26px",background:(reqDone>=reqCount && candidateId)?"linear-gradient(135deg,#6366f1,#818cf8)":"rgba(221,208,232,0.5)",border:"none",borderRadius:10,fontSize:13,fontWeight:700,color:(reqDone>=reqCount && candidateId)?"#fff":"#9ca3af",cursor:(reqDone>=reqCount && candidateId && !submitting)?"pointer":"not-allowed",fontFamily:"inherit",boxShadow:(reqDone>=reqCount && candidateId)?"0 4px 14px rgba(99,102,241,0.3)":"none",transition:"all .15s"}}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14}/>}
              {submitting ? "Submitting…" : "Submit Documents to HR"}
            </button>
          </div>
        </section>

        <p style={{fontSize:11,color:"#c4bdd0",textAlign:"center",margin:0}}>RecruitAI Candidate Portal · {new Date().getFullYear()}</p>
      </main>
    </div>
  );
}