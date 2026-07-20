"use client";
import "./DashboardPage.css";
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Filter, RefreshCw } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Backend connections — this page merges data from BOTH services
// ─────────────────────────────────────────────────────────────────────────────
// HR backend (hr_agent.py) — candidates, interview rounds, stage. Defaults to
// uvicorn's default port 8000. Override with NEXT_PUBLIC_HR_API_BASE_URL.
const HR_API_BASE = process.env.NEXT_PUBLIC_HR_API_BASE_URL || "http://localhost:8000";

// Only needed if you've set API_KEY in the HR backend's .env — /interviews is
// guarded by require_api_key, which accepts this header.
const HR_API_KEY = process.env.NEXT_PUBLIC_HR_API_KEY || "";

// Manager backend (manager_api.py) — HR→manager approval status. Defaults to
// MANAGER_API_PORT's default of 8001. Override with NEXT_PUBLIC_MANAGER_API_BASE_URL.
const MANAGER_API_BASE = process.env.NEXT_PUBLIC_MANAGER_API_BASE_URL || "http://localhost:8001";

type Feedback = {
  rating?: number;
  summary?: string;
  interviewer_name?: string;
} | null;

type Round = {
  roundNo: number;
  type: string;
  date: string;
  time: string;
  interviewer: string;
  status: "active" | "passed" | "failed" | "on-hold" | "pending" | string;
  mailSent: boolean;
  feedback: Feedback;
};

type Candidate = {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: string;
  stage: string; // "Screening" | "Interview" | "Shortlisted" (from candidates_col / interview_details)
  rounds: Round[];
  skills: string;
  tags: string[];
  yoe: string;
  summary: string;
  // populated from the manager backend after merge
  managerStatus: "not_sent" | "pending_manager" | "approved" | "rejected";
  managerDecidedAt: string | null;
  // ASSUMPTION: these aren't in the schema you've shared yet. See
  // offer_letter_backend_patch.py for the exact interview_details fields +
  // /interviews/{id}/offer-letter/send endpoint this reads from and posts to.
  offerLetterSent: boolean;
  offerLetterSentAt: string | null;
  joiningDate: string | null; // no backend for this yet — always shows "—"
};

type ManagerStatusRow = {
  candidate_id: string;
  status: "pending_manager" | "approved" | "rejected";
  manager_decision: string | null;
  manager_decided_at: string | null;
};

const STAGE_STYLE: Record<string, { color: string; bg: string }> = {
  Screening:   { color: "#5A7EC9", bg: "#EEF3FF" },
  Interview:   { color: "#8B5FC9", bg: "#F2ECFB" },
  Shortlisted: { color: "#2F9E5C", bg: "#E7F8EE" },
};

const ROUND_STATUS_STYLE: Record<string, { color: string; label: string }> = {
  passed:   { color: "#2F9E5C", label: "Passed" },
  failed:   { color: "#C24545", label: "Failed" },
  active:   { color: "#4A78C4", label: "In progress" },
  "on-hold":{ color: "#C98A2E", label: "On hold" },
  pending:  { color: "#9AA8B8", label: "Pending" },
};

const MANAGER_STATUS_STYLE: Record<Candidate["managerStatus"], { color: string; bg: string; label: string }> = {
  not_sent:        { color: "#9AA8B8", bg: "#F1F4F7", label: "Not sent to manager" },
  pending_manager: { color: "#C98A2E", bg: "#FBF1E1", label: "Pending manager review" },
  approved:        { color: "#2F9E5C", bg: "#E7F8EE", label: "Approved" },
  rejected:        { color: "#C24545", bg: "#FBEAEA", label: "Rejected" },
};

const OFFER_LETTER_STYLE = {
  sent:    { color: "#2F9E5C", bg: "#E7F8EE", label: "Sent" },
  not_sent:{ color: "#9AA8B8", bg: "#F1F4F7", label: "Not sent" },
};

function hrHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (HR_API_KEY) headers["x-api-key"] = HR_API_KEY;
  return headers;
}

export default function CandidatesPipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function loadCandidates() {
    setLoading(true);
    setError(null);
    try {
      // 1) GET /interviews (HR backend) — every candidate merged with their
      //    full interview_details doc (rounds, stage, feedback...).
      const hrRes = await fetch(`${HR_API_BASE}/interviews/`, { headers: hrHeaders() });
      if (!hrRes.ok) throw new Error(`HR backend returned ${hrRes.status}`);
      const hrData = await hrRes.json();
      const hrCandidates: any[] = hrData.candidates || [];

      // 2) GET /manager/candidates-status (Manager backend) — bulk lookup of
      //    HR→manager approval status for every candidate id we just got.
      let statusMap = new Map<string, ManagerStatusRow>();
      if (hrCandidates.length > 0) {
        try {
          const ids = hrCandidates.map((c) => c.id).join(",");
          const mgrRes = await fetch(
            `${MANAGER_API_BASE}/manager/candidates-status?ids=${encodeURIComponent(ids)}`
          );
          if (mgrRes.ok) {
            const mgrData = await mgrRes.json();
            statusMap = new Map((mgrData.statuses || []).map((s: ManagerStatusRow) => [s.candidate_id, s]));
          } else {
            console.warn(`Manager backend returned ${mgrRes.status}; showing HR data only`);
          }
        } catch {
          // Manager backend unreachable — don't block the HR data from showing,
          // just fall back to "not_sent" for everyone.
          console.warn(`Can't reach manager backend at ${MANAGER_API_BASE}; showing HR data only`);
        }
      }

      // 3) Merge
      const merged: Candidate[] = hrCandidates.map((c) => {
        const mgr: any = statusMap.get(c.id) || {};
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          initials: c.initials,
          color: c.color,
          role: c.role,
          stage: c.stage,
          rounds: c.rounds || [],
          skills: c.skills,
          tags: c.tags || [],
          yoe: c.yoe,
          summary: c.summary,
          managerStatus: (mgr?.status as Candidate["managerStatus"]) || "not_sent",
          managerDecidedAt: mgr?.manager_decided_at || null,
          offerLetterSent: Boolean(c.offer_letter_sent),
          offerLetterSentAt: c.offer_letter_sent_at || null,
          joiningDate: null, // no backend field for this yet
        };
      });

      setCandidates(merged);
    } catch (err: any) {
      setError(
        err.message === "Failed to fetch"
          ? `Can't reach the HR backend at ${HR_API_BASE}. Is hr_agent.py running on that port?`
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  const stageOptions = useMemo(() => {
    const set = new Set(candidates.map((c) => c.stage).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [candidates]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (stageFilter !== "All" && c.stage !== stageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [candidates, search, stageFilter]);

  const summary = useMemo(() => {
    const byStage: Record<string, number> = {};
    let managerApproved = 0;
    let managerPending = 0;
    candidates.forEach((c) => {
      byStage[c.stage] = (byStage[c.stage] || 0) + 1;
      if (c.managerStatus === "approved") managerApproved++;
      if (c.managerStatus === "pending_manager") managerPending++;
    });
    return { byStage, managerApproved, managerPending };
  }, [candidates]);

  return (
    <div className="pipeline-page">
      <div className="pipeline-header">
        <div>
          <h1 className="pipeline-title">Candidate Pipeline</h1>
          <p className="pipeline-sub">
            {candidates.length} candidates · {summary.byStage["Interview"] || 0} in interviews ·{" "}
            {summary.managerPending} pending manager review · {summary.managerApproved} manager-approved
          </p>
        </div>
        <button className="pipeline-refresh-btn" onClick={loadCandidates} disabled={loading}>
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      <div className="pipeline-toolbar">
        <div className="pipeline-search">
          <Search size={15} color="#9aa8b8" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button className="pipeline-filter-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Filter size={13} /> {stageFilter} <ChevronDown size={13} />
          </button>
          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
              <div className="pipeline-dropdown">
                {stageOptions.map((s) => (
                  <div
                    key={s}
                    className={`pipeline-dropdown-item ${s === stageFilter ? "active" : ""}`}
                    onClick={() => {
                      setStageFilter(s);
                      setDropdownOpen(false);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pipeline-card">
        {error && <div className="pipeline-error">{error}</div>}

        {loading ? (
          <div className="pipeline-loading">Loading candidates…</div>
        ) : filtered.length === 0 ? (
          <div className="pipeline-empty">No candidates match this view.</div>
        ) : (
          <table className="pipeline-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th>HR stage</th>
                <th>Interview rounds</th>
                <th>Current round</th>
                <th>Manager status</th>
                <th>Offer letter</th>
                <th>Joining date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const stageStyle = STAGE_STYLE[c.stage] || { color: "#5A7EC9", bg: "#EEF3FF" };
                const rounds = c.rounds || [];
                const roundsDone = rounds.filter((r) => r.status === "passed" || r.status === "failed").length;
                const currentRound =
                  rounds.find((r) => r.status === "active") ||
                  rounds.find((r) => r.status === "pending") ||
                  rounds[rounds.length - 1];
                const currentStyle = currentRound
                  ? ROUND_STATUS_STYLE[currentRound.status] || ROUND_STATUS_STYLE.pending
                  : null;

                return (
                  <tr key={c.id}>
                    <td>
                      <div className="pipeline-candidate-cell">
                        <div className="pipeline-avatar" style={{ background: c.color + "22", color: c.color }}>
                          {c.initials}
                        </div>
                        <div>
                          <div className="pipeline-name">{c.name}</div>
                          <div className="pipeline-email">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.role || "—"}</td>
                    <td>
                      <span className="pipeline-stage-badge" style={{ color: stageStyle.color, background: stageStyle.bg }}>
                        {c.stage}
                      </span>
                    </td>
                    <td>
                      <div className="pipeline-rounds-dots">
                        {rounds.map((r) => {
                          const st = ROUND_STATUS_STYLE[r.status] || ROUND_STATUS_STYLE.pending;
                          return (
                            <span
                              key={r.roundNo}
                              className="pipeline-round-dot"
                              style={{ background: st.color }}
                              title={`Round ${r.roundNo} · ${r.type} · ${st.label}`}
                            />
                          );
                        })}
                        <span className="pipeline-rounds-text">
                          {roundsDone} / {rounds.length} completed
                        </span>
                      </div>
                    </td>
                    <td>
                      {currentRound ? (
                        <span className="pipeline-round-badge" style={{ color: currentStyle!.color }}>
                          R{currentRound.roundNo} · {currentRound.type} · {currentStyle!.label}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span
                        className="pipeline-stage-badge"
                        style={{
                          color: MANAGER_STATUS_STYLE[c.managerStatus].color,
                          background: MANAGER_STATUS_STYLE[c.managerStatus].bg,
                        }}
                      >
                        {MANAGER_STATUS_STYLE[c.managerStatus].label}
                      </span>
                    </td>
                    <td>
                      <span
                        className="pipeline-stage-badge"
                        style={{
                          color: (c.offerLetterSent ? OFFER_LETTER_STYLE.sent : OFFER_LETTER_STYLE.not_sent).color,
                          background: (c.offerLetterSent ? OFFER_LETTER_STYLE.sent : OFFER_LETTER_STYLE.not_sent).bg,
                        }}
                        title={c.offerLetterSentAt ? `Sent ${new Date(c.offerLetterSentAt).toLocaleString()}` : undefined}
                      >
                        {(c.offerLetterSent ? OFFER_LETTER_STYLE.sent : OFFER_LETTER_STYLE.not_sent).label}
                      </span>
                    </td>
                    <td>{c.joiningDate ? new Date(c.joiningDate).toLocaleDateString() : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}