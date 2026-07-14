"use client";
import ManagerSummaryModal from "@/components/ManagerSummaryModal";
import { useInterviewStore } from "@/lib/interviewStore";
import type { Candidate } from "@/lib/interviewStore";
import {
  buildCombinedSummary,
  completedPill,
  getCandidatesAwaitingApproval,
  getRoundStatusLabel,
  isRoundCompleted,
  pendingPill,
} from "@/lib/managerFeedback";
import { CheckCircle, Eye, ThumbsUp, XCircle } from "lucide-react";
import { useState } from "react";

function RoundCell({ candidate, roundNo }: { candidate: Candidate; roundNo: number }) {
  const label     = getRoundStatusLabel(candidate, roundNo);
  const completed = isRoundCompleted(candidate, roundNo);
  const round     = candidate.rounds.find(r => r.roundNo === roundNo);
  if (!round) return <span style={{ fontSize: 12, color: "#d1d5db" }}>—</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={completed ? completedPill : pendingPill}>{label}</span>
      {round.type && (
        <span style={{ fontSize: 10, color: "#9ca3af" }}>{round.type}</span>
      )}
    </div>
  );
}

export default function ManagerFeedback() {
  const { candidates, managerDecisions, approveManagerFeedback, rejectManagerFeedback } = useInterviewStore();
  const awaiting = getCandidatesAwaitingApproval(candidates);
  const [summaryCandidate, setSummaryCandidate] = useState<Candidate | null>(null);

  const maxRounds = Math.max(...awaiting.map(c => c.rounds.length), 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Interview Feedback</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
          Candidates who have completed all interview rounds · {awaiting.length} awaiting approval
        </p>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(221,208,232,0.4)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f8f7ff" }}>
                <th style={thStyle}>Candidate</th>
                {Array.from({ length: maxRounds }, (_, i) => (
                  <th key={i} style={thStyle}>R{i + 1}</th>
                ))}
                <th style={{ ...thStyle, minWidth: 220 }}>Summary</th>
                <th style={thStyle}>Approval</th>
              </tr>
            </thead>
            <tbody>
              {awaiting.map(c => {
                const decision = managerDecisions[c.id];
                const summary  = buildCombinedSummary(c);
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: "1px solid rgba(221,208,232,0.2)",
                      background:
                        decision === "approved" ? "rgba(240,253,244,0.6)"
                        : decision === "rejected" ? "rgba(254,242,242,0.4)"
                        : "#fff",
                    }}
                  >
                    {/* Candidate */}
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {c.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Round columns */}
                    {Array.from({ length: maxRounds }, (_, i) => (
                      <td key={i} style={tdStyle}>
                        <RoundCell candidate={c} roundNo={i + 1} />
                      </td>
                    ))}

                    {/* Summary */}
                    <td style={{ ...tdStyle, maxWidth: 260 }}>
                      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.55, marginBottom: 6 }}>
                        {summary.length > 140 ? summary.slice(0, 140) + "…" : summary}
                      </div>
                      <button
                        onClick={() => setSummaryCandidate(c)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "#0369a1", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        <Eye size={11} /> View Full
                      </button>
                    </td>

                    {/* Approval */}
                    <td style={tdStyle}>
                      {decision === "approved" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#065f46" }}>
                          <CheckCircle size={13} /> Approved
                        </span>
                      ) : decision === "rejected" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#dc2626" }}>
                          <XCircle size={13} /> Rejected
                        </span>
                      ) : (
                        <button
                          onClick={() => approveManagerFeedback(c.id)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#065f46", cursor: "pointer", fontFamily: "inherit" }}
                        >
                          <ThumbsUp size={12} /> Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {awaiting.length === 0 && (
                <tr>
                  <td colSpan={maxRounds + 3} style={{ padding: 28, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                    No candidates have completed all interview rounds yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {summaryCandidate && (
        <ManagerSummaryModal candidate={summaryCandidate} onClose={() => setSummaryCandidate(null)} />
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "11px 14px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid rgba(221,208,232,0.3)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 14px",
  verticalAlign: "top",
};
