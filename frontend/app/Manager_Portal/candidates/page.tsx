"use client";
import { useState, useEffect, useCallback } from "react";
import { useInterviewStore } from "@/lib/interviewStore";
import {
  Search, RefreshCw, Users, ChevronDown, ChevronUp,
  Star, Mail, Calendar, TrendingUp,
} from "lucide-react";

const MANAGER_API = process.env.NEXT_PUBLIC_MANAGER_API_BASE_URL || "http://localhost:8001";
const AUTO_REFRESH_MS = 30_000;

const STATUS_FILTERS = ["All", "Screening", "Technical", "Managerial", "HR Round", "Offer"] as const;
type SF = typeof STATUS_FILTERS[number];

function stage(rounds: { status: string; type: string }[]) {
  if (!rounds?.length) return "Screening";
  const active = rounds.find(r => r.status === "active");
  if (active) return active.type;
  if (rounds.every(r => r.status === "passed")) return "Offer";
  return "Screening";
}

function statusPill(hasFail: boolean, allDone: boolean, active: boolean) {
  if (hasFail)  return { bg: "rgba(239,68,68,0.1)",    color: "#dc2626", label: "Not Cleared" };
  if (allDone)  return { bg: "rgba(16,185,129,0.1)",   color: "#065f46", label: "All Passed"  };
  if (active)   return { bg: "rgba(245,158,11,0.1)",   color: "#92400e", label: "In Progress" };
  return           { bg: "rgba(156,163,175,0.15)",  color: "#6b7280", label: "Pending"     };
}

/* Also pull manager-approved candidates from backend to enrich the table */
type ApprovedCandidate = {
  candidate_id:    string;
  candidate_name:  string;
  candidate_email: string;
  initials:        string;
  color:           string;
  role:            string;
  rounds:          { roundNo: number; type: string; status: string }[];
  overall_rating:  number | null;
  recommendation:  string;
  hr_approved_at:  string;
  status:          "pending_manager" | "approved" | "rejected";
};

export default function ManagerCandidates() {
  const { candidates } = useInterviewStore();

  /* ── live approved-candidates from manager backend ── */
  const [approved,        setApproved]        = useState<ApprovedCandidate[]>([]);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [lastRefreshed,   setLastRefreshed]   = useState<Date | null>(null);

  const fetchApproved = useCallback(async () => {
    setApprovedLoading(true);
    try {
      const res  = await fetch(`${MANAGER_API}/manager/approved-candidates`);
      if (res.ok) {
        const data = await res.json();
        setApproved(data.candidates || []);
      }
    } catch { /* backend offline — keep previous data */ }
    finally {
      setApprovedLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  /* mount + interval */
  useEffect(() => {
    fetchApproved();
    const id = setInterval(fetchApproved, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchApproved]);

  /* ── merge store candidates + approved candidates into one list ── */
  const mergedRows = (() => {
    /* start with store candidates */
    const rows = candidates.map(c => ({
      backendId:  c.backendId ?? "",
      initials:   c.initials,
      color:      c.color,
      name:       c.name,
      email:      c.email,
      role:       c.role,
      rounds:     c.rounds as { status: string; type: string; roundNo?: number }[],
      aiScore:    null as number | null,
      hrApproved: null as string | null,
      managerStatus: null as "pending_manager" | "approved" | "rejected" | null,
      rating:     null as number | null,
      recommendation: "",
    }));

    /* overlay data from approved-candidates */
    approved.forEach(ac => {
      const idx = rows.findIndex(
        r => r.backendId === ac.candidate_id ||
             r.name.toLowerCase() === ac.candidate_name.toLowerCase()
      );
      if (idx >= 0) {
        rows[idx].hrApproved     = ac.hr_approved_at;
        rows[idx].managerStatus  = ac.status;
        rows[idx].rating         = ac.overall_rating;
        rows[idx].recommendation = ac.recommendation;
        if (!rows[idx].rounds.length && ac.rounds?.length) {
          rows[idx].rounds = ac.rounds;
        }
      } else {
        /* candidate came from backend but not in local store — add it */
        rows.push({
          backendId:     ac.candidate_id,
          initials:      ac.initials,
          color:         ac.color || "#6366f1",
          name:          ac.candidate_name,
          email:         ac.candidate_email,
          role:          ac.role,
          rounds:        ac.rounds || [],
          aiScore:       null,
          hrApproved:    ac.hr_approved_at,
          managerStatus: ac.status,
          rating:        ac.overall_rating,
          recommendation: ac.recommendation,
        });
      }
    });
    return rows;
  })();

  /* ── filter + search ── */
  const [sf,  setSf]  = useState<SF>("All");
  const [q,   setQ]   = useState("");
  const [exp, setExp] = useState<string | null>(null);

  const filtered = mergedRows.filter(c => {
    const matchQ = !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.role.toLowerCase().includes(q.toLowerCase());
    const matchF =
      sf === "All" ? true :
      sf === "Offer" ? c.rounds.every(r => r.status === "passed") :
      stage(c.rounds) === sf;
    return matchQ && matchF;
  });

  const pill = (bg: string, color: string, label: string) => (
    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:bg, color }}>{label}</span>
  );

  const managerBadge = (s: "pending_manager" | "approved" | "rejected" | null) => {
    if (!s) return null;
    const map = {
      pending_manager: { bg:"rgba(245,158,11,0.12)",  color:"#92400e", label:"Pending Review" },
      approved:        { bg:"rgba(16,185,129,0.12)",  color:"#065f46", label:"✓ Approved"      },
      rejected:        { bg:"rgba(220,38,38,0.1)",    color:"#b91c1c", label:"✗ Rejected"      },
    };
    const m = map[s];
    return <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:m.bg, color:m.color, marginTop:3, display:"inline-block" }}>{m.label}</span>;
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:1100 }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e1b4b", margin:0 }}>Candidates Hiring Status</h1>
          <p style={{ fontSize:13, color:"#9ca3af", marginTop:4 }}>
            {filtered.length} candidate{filtered.length !== 1 ? "s" : ""} ·{" "}
            {lastRefreshed ? `Updated ${lastRefreshed.toLocaleTimeString()}` : "Loading…"}
          </p>
        </div>
        <button
          onClick={fetchApproved}
          disabled={approvedLoading}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.22)", borderRadius:9, fontSize:12, fontWeight:600, color:"#4f46e5", cursor:"pointer", fontFamily:"inherit", opacity: approvedLoading ? 0.6 : 1 }}
        >
          <RefreshCw size={12} style={{ animation: approvedLoading ? "spin 1s linear infinite" : "none" }}/>
          {approvedLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid rgba(221,208,232,0.5)", borderRadius:10, padding:"8px 14px", flex:"1 1 220px", maxWidth:320 }}>
          <Search size={14} color="#9ca3af"/>
          <input
            placeholder="Search candidate or role…"
            value={q} onChange={e => setQ(e.target.value)}
            style={{ border:"none", outline:"none", fontSize:13, color:"#1e1b4b", background:"transparent", width:"100%", fontFamily:"inherit" }}
          />
        </div>
        {/* Stage filter pills */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setSf(f)} style={{
              padding:"5px 14px", borderRadius:20, border:"1px solid", fontSize:12, fontWeight:600,
              cursor:"pointer", fontFamily:"inherit",
              borderColor: sf===f ? "#6366F1" : "rgba(221,208,232,0.6)",
              background:  sf===f ? "rgba(99,102,241,0.1)" : "transparent",
              color:       sf===f ? "#4f46e5" : "#9ca3af",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background:"#fff", border:"1px solid rgba(221,208,232,0.4)", borderRadius:14, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8f7ff" }}>
              {["Candidate", "Role", "Stage", "Progress", "Next Step", "Manager Status", "Rating"].map(h => (
                <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid rgba(221,208,232,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding:32, textAlign:"center", fontSize:13, color:"#9ca3af" }}>
                No candidates match this filter.
              </td></tr>
            )}
            {filtered.map(c => {
              const activeRound = c.rounds.find(r => r.status === "active");
              const passed      = c.rounds.filter(r => r.status === "passed").length;
              const allDone     = c.rounds.length > 0 && c.rounds.every(r => r.status === "passed");
              const hasFail     = c.rounds.some(r => r.status === "failed");
              const sp          = statusPill(hasFail, allDone, !!activeRound);
              const isExpanded  = exp === c.name;

              return (
                <>
                  <tr
                    key={c.name}
                    onClick={() => setExp(isExpanded ? null : c.name)}
                    style={{
                      borderBottom: isExpanded ? "none" : "1px solid rgba(221,208,232,0.2)",
                      cursor: "pointer",
                      background: c.managerStatus === "approved" ? "rgba(240,253,244,0.5)"
                                : c.managerStatus === "rejected" ? "rgba(254,242,242,0.4)"
                                : "#fff",
                      transition: "background .12s",
                    }}
                  >
                    {/* Candidate */}
                    <td style={{ padding:"13px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%", background:c.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{c.initials}</div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:13, fontWeight:700, color:"#1e1b4b" }}>{c.name}</span>
                            {isExpanded ? <ChevronUp size={12} color="#9ca3af"/> : <ChevronDown size={12} color="#9ca3af"/>}
                          </div>
                          <div style={{ fontSize:11, color:"#9ca3af" }}>{c.email}</div>
                          {c.hrApproved && <span style={{ fontSize:10, color:"#6366f1", fontWeight:600 }}>✓ HR Approved</span>}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding:"13px 14px", fontSize:13, color:"#6b7280" }}>{c.role}</td>

                    {/* Stage */}
                    <td style={{ padding:"13px 14px", fontSize:13, color:"#6b7280" }}>{stage(c.rounds)}</td>

                    {/* Progress — per-round completion pills */}
                    <td style={{ padding:"13px 14px" }}>
                      {c.rounds.length === 0 ? (
                        <span style={{ fontSize:11, color:"#d1d5db" }}>No rounds</span>
                      ) : (
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                          {c.rounds.map((r, i) => {
                            const no = (r as any).roundNo ?? i + 1;
                            const done   = r.status === "passed";
                            const failed = r.status === "failed";
                            const active = r.status === "active";
                            const bg    = done   ? "rgba(16,185,129,0.12)"
                                        : failed ? "rgba(220,38,38,0.1)"
                                        : active ? "rgba(245,158,11,0.12)"
                                        :          "rgba(221,208,232,0.35)";
                            const color = done   ? "#065f46"
                                        : failed ? "#b91c1c"
                                        : active ? "#92400e"
                                        :          "#9ca3af";
                            const icon  = done ? "✓" : failed ? "✗" : active ? "●" : "○";
                            return (
                              <span key={i} title={r.type} style={{
                                padding:"2px 7px", borderRadius:20, fontSize:10,
                                fontWeight:700, background:bg, color,
                                border:`1px solid ${done ? "rgba(16,185,129,0.25)" : failed ? "rgba(220,38,38,0.2)" : "transparent"}`,
                                whiteSpace:"nowrap",
                              }}>
                                R{no} {icon}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    {/* Next Step */}
                    <td style={{ padding:"13px 14px", fontSize:12, color:"#9ca3af" }}>
                      {activeRound
                        ? `R${(activeRound as any).roundNo ?? ""} · ${activeRound.type}`
                        : allDone ? "Offer Stage" : "—"}
                    </td>

                    {/* Manager Status */}
                    <td style={{ padding:"13px 14px" }}>
                      {managerBadge(c.managerStatus) ?? pill(sp.bg, sp.color, sp.label)}
                    </td>

                    {/* Rating */}
                    <td style={{ padding:"13px 14px" }}>
                      {c.rating != null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <Star size={12} color="#f59e0b" fill="#f59e0b"/>
                          <span style={{ fontSize:13, fontWeight:700, color:"#1e1b4b" }}>{c.rating}/5</span>
                        </div>
                      ) : (
                        <span style={{ fontSize:12, color:"#d1d5db" }}>—</span>
                      )}
                    </td>
                  </tr>

                  {/* ── Expanded detail row ── */}
                  {isExpanded && (
                    <tr key={`${c.name}-exp`} style={{ borderBottom:"1px solid rgba(221,208,232,0.2)" }}>
                      <td colSpan={7} style={{ padding:"0 14px 14px", background:"rgba(248,247,255,0.55)" }}>
                        <div style={{ padding:"14px 18px", background:"#fff", borderRadius:10, border:"1px solid rgba(221,208,232,0.3)", display:"flex", gap:28, flexWrap:"wrap" }}>
                          {/* Email */}
                          <div style={{ minWidth:180 }}>
                            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4, display:"flex", alignItems:"center", gap:4 }}><Mail size={10}/> Email</div>
                            <div style={{ fontSize:13, color:"#1e1b4b" }}>{c.email}</div>
                          </div>
                          {/* Rounds */}
                          <div>
                            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4, display:"flex", alignItems:"center", gap:4 }}><Calendar size={10}/> Rounds</div>
                            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                              {c.rounds.length ? c.rounds.map((r, i) => {
                                const rb = r.status === "passed"   ? { bg:"rgba(16,185,129,0.1)", color:"#065f46" }
                                         : r.status === "failed"   ? { bg:"rgba(239,68,68,0.1)",  color:"#dc2626" }
                                         : r.status === "active"   ? { bg:"rgba(245,158,11,0.1)", color:"#92400e" }
                                         :                           { bg:"rgba(221,208,232,0.3)", color:"#9ca3af" };
                                return (
                                  <span key={i} style={{ padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:rb.bg, color:rb.color }}>
                                    R{(r as any).roundNo ?? i+1} · {r.type}
                                  </span>
                                );
                              }) : <span style={{ fontSize:12, color:"#9ca3af" }}>No rounds yet</span>}
                            </div>
                          </div>
                          {/* Recommendation */}
                          {c.recommendation && (
                            <div>
                              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4, display:"flex", alignItems:"center", gap:4 }}><TrendingUp size={10}/> Recommendation</div>
                              <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:"rgba(168,152,216,0.15)", color:"#5A4878" }}>{c.recommendation}</span>
                            </div>
                          )}
                          {/* HR Approved date */}
                          {c.hrApproved && (
                            <div>
                              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>HR Approved</div>
                              <div style={{ fontSize:13, color:"#4f46e5", fontWeight:600 }}>{new Date(c.hrApproved).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}</div>
                            </div>
                          )}
                          {/* Manager status */}
                          <div>
                            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>Manager Decision</div>
                            {managerBadge(c.managerStatus) ?? <span style={{ fontSize:12, color:"#9ca3af" }}>—</span>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* auto-refresh note */}
      <p style={{ fontSize:11, color:"#c4bdd0", textAlign:"right", margin:0 }}>
        Auto-refreshes every 30 seconds · <button onClick={fetchApproved} style={{ background:"none", border:"none", color:"#6366f1", fontSize:11, cursor:"pointer", fontFamily:"inherit", padding:0 }}>Refresh now</button>
      </p>

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
