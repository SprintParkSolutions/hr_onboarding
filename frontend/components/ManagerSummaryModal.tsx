"use client";
import type { Candidate } from "@/lib/interviewStore";
import { getRoundSummaryItems } from "@/lib/managerFeedback";
import { X } from "lucide-react";

export default function ManagerSummaryModal({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const items = getRoundSummaryItems(candidate);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(42,26,56,0.35)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 14,
          border: "1px solid rgba(221,208,232,0.5)",
          boxShadow: "0 20px 60px rgba(30,27,75,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid rgba(221,208,232,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: candidate.color,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {candidate.initials}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b" }}>{candidate.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                {candidate.role} · All rounds summary
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "rgba(156,163,175,0.12)",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.roundNo}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(221,208,232,0.4)",
                  background: "#f8f7ff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>
                    R{item.roundNo} · {item.type}
                  </span>
                  {item.rating != null && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6366F1" }}>
                      Rating {item.rating}/5
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.55 }}>
                  {item.summary}
                </p>
                {item.recommendation && !["—", "\u2014", "\u2013"].includes(item.recommendation) && (
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(168,152,216,0.15)",
                      color: "#5A4878",
                    }}
                  >
                    {item.recommendation}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              {candidate.name} has completed all interview rounds. Detailed feedback summaries are not
              available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
