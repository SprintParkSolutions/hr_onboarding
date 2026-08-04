"use client";

import { useState, useEffect, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface SkillRow {
  id: string;
  name: string;
  rating: number | null;
}

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
  error?: boolean;
}

interface RatingBarProps {
  value: number;
  onChange: (v: number) => void;
  error?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const DEFAULT_SKILLS = [
  "Communication",
  "Problem Solving",
  "Adaptability",
  "Teamwork",
  "Cultural Fit",
  "Learning Agility",
  "Ownership & Accountability",
  "Leadership Potential",
  "Emotional Intelligence",
  "Professionalism",
];

let _rowId = 0;
const nextId = () => `sk_${++_rowId}`;

function getUrlParams() {
  const p = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  return {
    candidateId: p.get("candidate_id") || "",
    roundNo: parseInt(p.get("round_no") || "0", 10),
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange, error }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        outline: error ? "1px solid #c0392b" : "none",
        borderRadius: 4,
        width: "fit-content",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{
            fontSize: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: i <= (hover || value) ? "#f0a500" : "#ddd",
            padding: 0,
            lineHeight: 1,
            transition: "color 0.1s",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function RatingBar({ value, onChange, error }: RatingBarProps) {
  return (
    <div
      style={{
        display: "flex",
        border: error ? "1px solid #c0392b" : "1px solid #ddd",
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 6,
        width: "fit-content",
      }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            width: 56,
            padding: "8px 0",
            fontSize: 14,
            border: "none",
            borderRight: n < 5 ? "1px solid #ddd" : "none",
            background: n <= value ? "#6264A7" : "#fff",
            color: n <= value ? "#fff" : "#555",
            fontWeight: n <= value ? 600 : 400,
            cursor: "pointer",
            textAlign: "center",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({
  message,
  color,
  visible,
}: {
  message: string;
  color: string;
  visible: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(60px)",
        opacity: visible ? 1 : 0,
        background: color,
        color: "#fff",
        padding: "10px 24px",
        borderRadius: 6,
        fontSize: 14,
        transition: "all 0.3s",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 999,
      }}
    >
      {message}
    </div>
  );
}

// ── Card wrapper ───────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: "1.5rem",
        marginBottom: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  num,
  required,
  children,
}: {
  num: number;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        fontSize: 14,
        color: "#1f1f1f",
        marginBottom: 8,
        lineHeight: 1.4,
      }}
    >
      <span style={{ marginRight: 4 }}>{num}.</span>
      {children}
      {required && (
        <span style={{ color: "#c0392b", marginLeft: 2 }}>*</span>
      )}
    </div>
  );
}

const inputStyle = (err?: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "8px 0",
  fontSize: 14,
  border: "none",
  borderBottom: `1px solid ${err ? "#c0392b" : "#bbb"}`,
  background: "transparent",
  color: "#1f1f1f",
  outline: "none",
});

const textareaStyle: React.CSSProperties = {
  ...inputStyle(),
  resize: "vertical",
  minHeight: 56,
  fontFamily: "inherit",
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InterviewerFeedbackForm() {
  const { candidateId: urlCandId, roundNo: urlRoundNo } = getUrlParams();

  // Fields
  const [candId, setCandId] = useState(urlCandId);
  const [candName, setCandName] = useState("");
  const [role, setRole] = useState("");
  const [roundType, setRoundType] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [commRating, setCommRating] = useState(0);
  const [cultRating, setCultRating] = useState(0);
  const [adaptRating, setAdaptRating] = useState(0);

  // Skills table
  const [skills, setSkills] = useState<SkillRow[]>(() =>
    DEFAULT_SKILLS.map((name) => ({ id: nextId(), name, rating: null }))
  );

  // Errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Toast
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    color: "#1D9E75",
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill from API on mount
  useEffect(() => {
    if (!urlCandId) return;

    // Auto-select round radio
    if (urlRoundNo >= 1 && urlRoundNo <= 2)
      setRoundType(`Round ${urlRoundNo}`);

    const apiBase = (
      (window as any).FEEDBACK_API_BASE_URL || "http://localhost:8000"
    ).replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if ((window as any).FEEDBACK_API_KEY)
      headers["x-api-key"] = (window as any).FEEDBACK_API_KEY;

    fetch(`${apiBase}/interviews/${urlCandId}`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.name) setCandName((v) => v || data.name);
        if (data.role) setRole((v) => v || data.role);
      })
      .catch(() => {});
  }, []);

  function showToast(message: string, color = "#1D9E75") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message, color });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      4000
    );
  }

  // Skills helpers
  function addSkillRow(name = "") {
    setSkills((prev) => [...prev, { id: nextId(), name, rating: null }]);
  }

  function removeSkillRow(id: string) {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  function updateSkillName(id: string, name: string) {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }

  function updateSkillRating(id: string, rating: number) {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rating } : s))
    );
  }

  function collectSkills() {
    return skills
      .filter((s) => s.name.trim() && s.rating !== null)
      .map((s) => `${s.name.trim()}: ${s.rating}/5`)
      .join(", ");
  }

  // Validation + submit
  async function handleSubmit() {
    const newErrors: Record<string, boolean> = {};

    if (!candId.trim()) newErrors.candId = true;
    if (!candName.trim()) newErrors.candName = true;
    if (!role.trim()) newErrors.role = true;
    if (!roundType) newErrors.roundType = true;
    if (!overallRating) newErrors.overallRating = true;
    if (!commRating) newErrors.commRating = true;
    if (!cultRating) newErrors.cultRating = true;
    if (!adaptRating) newErrors.adaptRating = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const payload = {
      candidate_id: candId.trim(),
      round_no: urlRoundNo || 1,
      candidate_name: candName.trim(),
      role: role.trim(),
      round_type: roundType,
      rating: overallRating,
      summary: summary.trim(),
      skills: collectSkills(),
      strengths: strengths.trim(),
      communication: commRating ? `${commRating}/5` : "",
      cultural_fit: cultRating ? `${cultRating}/5` : "",
      adaptability: adaptRating ? `${adaptRating}/5` : "",
      interviewer_name: "",
      interviewer_email: "",
    };

    const apiBase = (
      (window as any).FEEDBACK_API_BASE_URL || "http://localhost:8000"
    ).replace(/\/$/, "");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if ((window as any).FEEDBACK_API_KEY)
      headers["x-api-key"] = (window as any).FEEDBACK_API_KEY;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/interviews/feedback`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        showToast("✅ Feedback submitted — thank you!", "#1D9E75");
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(`❌ ${err.detail || `Error ${res.status}`}`, "#c0392b");
        setSubmitting(false);
      }
    } catch {
      showToast("❌ Network error — please try again.", "#c0392b");
      setSubmitting(false);
    }
  }

  const ROUND_OPTIONS = ["Round 1", "Round 2", "Managerial", "HR"];

  return (
    <>
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#e8f0f7",
          minHeight: "100vh",
          padding: "2rem 1rem",
          color: "#1f1f1f",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "1.5rem",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderTop: "6px solid #6264A7",
            }}
          >
            <h1
              style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}
            >
              Feedback Form from Interviewer
            </h1>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
              When you submit this form, it will not automatically collect your
              details like name and email address unless you provide it yourself.
            </p>
          </div>

          {/* 1. Candidate ID */}
          <Card>
            <FieldLabel num={1} required>
              Candidate ID
            </FieldLabel>
            <input
              type="text"
              value={candId}
              readOnly={!!urlCandId}
              onChange={(e) => setCandId(e.target.value)}
              placeholder="Enter your answer"
              style={{
                ...inputStyle(errors.candId),
                color: urlCandId ? "#888" : "#1f1f1f",
                cursor: urlCandId ? "not-allowed" : "text",
              }}
            />
          </Card>

          {/* 2. Candidate Name */}
          <Card>
            <FieldLabel num={2} required>
              Candidate Name
            </FieldLabel>
            <input
              type="text"
              value={candName}
              onChange={(e) => setCandName(e.target.value)}
              placeholder="Enter your answer"
              style={inputStyle(errors.candName)}
            />
          </Card>

          {/* 3. Role */}
          <Card>
            <FieldLabel num={3} required>
              Role
            </FieldLabel>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter your answer"
              style={inputStyle(errors.role)}
            />
          </Card>

          {/* 4. Round Type */}
          <Card>
            <FieldLabel num={4} required>
              Round Type
            </FieldLabel>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 4,
                outline: errors.roundType ? "1px solid #c0392b" : "none",
                borderRadius: 4,
              }}
            >
              {ROUND_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="round"
                    value={opt}
                    checked={roundType === opt}
                    onChange={() => {
                      setRoundType(opt);
                      setErrors((e) => ({ ...e, roundType: false }));
                    }}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: "#6264A7",
                      cursor: "pointer",
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </Card>

          {/* 5. Rate the candidate */}
          <Card>
            <FieldLabel num={5} required>
              Rate the candidate
            </FieldLabel>
            <RatingBar
              value={overallRating}
              onChange={(v) => {
                setOverallRating(v);
                setErrors((e) => ({ ...e, overallRating: false }));
              }}
              error={errors.overallRating}
            />
          </Card>

          {/* 6. Summary */}
          <Card>
            <FieldLabel num={6}>Summary / Comment about the candidate</FieldLabel>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter your answer"
              style={textareaStyle}
            />
          </Card>

          {/* 7. Skills */}
          <Card>
            <FieldLabel num={7} required>
              Skills
            </FieldLabel>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 8,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "42%",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#555",
                      padding: "6px 4px",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    Skill
                  </th>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th
                      key={n}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#555",
                        padding: "6px 4px",
                        borderBottom: "1px solid #e0e0e0",
                        textAlign: "center",
                      }}
                    >
                      {n}
                    </th>
                  ))}
                  <th style={{ width: 24, borderBottom: "1px solid #e0e0e0" }} />
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, idx) => (
                  <tr key={skill.id}>
                    <td
                      style={{
                        padding: "7px 4px",
                        borderBottom:
                          idx < skills.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                        verticalAlign: "middle",
                      }}
                    >
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateSkillName(skill.id, e.target.value)
                        }
                        placeholder="Enter skill name"
                        style={{
                          width: "100%",
                          fontSize: 13,
                          padding: "3px 0",
                          border: "none",
                          borderBottom: "1px dashed #ccc",
                          background: "transparent",
                          color: "#1f1f1f",
                          outline: "none",
                          fontFamily: "inherit",
                        }}
                      />
                    </td>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <td
                        key={n}
                        style={{
                          padding: "7px 4px",
                          borderBottom:
                            idx < skills.length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <input
                          type="radio"
                          name={skill.id}
                          value={n}
                          checked={skill.rating === n}
                          onChange={() => updateSkillRating(skill.id, n)}
                          style={{
                            width: 16,
                            height: 16,
                            accentColor: "#6264A7",
                            cursor: "pointer",
                          }}
                        />
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "7px 4px",
                        borderBottom:
                          idx < skills.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => removeSkillRow(skill.id)}
                        title="Remove row"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ccc",
                          fontSize: 17,
                          cursor: "pointer",
                          padding: "0 2px",
                          lineHeight: 1,
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLButtonElement).style.color =
                            "#c0392b")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLButtonElement).style.color = "#ccc")
                        }
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => addSkillRow("")}
              style={{
                marginTop: 10,
                fontSize: 13,
                color: "#6264A7",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              + Add skill
            </button>
          </Card>

          {/* 8. Strengths */}
          <Card>
            <FieldLabel num={8}>Strengths of the candidate</FieldLabel>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Enter your answer"
              style={textareaStyle}
            />
          </Card>

          {/* 9. Communication Skills */}
          <Card>
            <FieldLabel num={9} required>
              Communication Skills
            </FieldLabel>
            <StarRating
              value={commRating}
              onChange={(v) => {
                setCommRating(v);
                setErrors((e) => ({ ...e, commRating: false }));
              }}
              error={errors.commRating}
            />
          </Card>

          {/* 10. Cultural Fit & Attitude */}
          <Card>
            <FieldLabel num={10} required>
              Cultural Fit &amp; Attitude
            </FieldLabel>
            <StarRating
              value={cultRating}
              onChange={(v) => {
                setCultRating(v);
                setErrors((e) => ({ ...e, cultRating: false }));
              }}
              error={errors.cultRating}
            />
          </Card>

          {/* 11. Adaptability & Flexibility */}
          <Card>
            <FieldLabel num={11} required>
              Adaptability &amp; Flexibility
            </FieldLabel>
            <StarRating
              value={adaptRating}
              onChange={(v) => {
                setAdaptRating(v);
                setErrors((e) => ({ ...e, adaptRating: false }));
              }}
              error={errors.adaptRating}
            />
          </Card>

          {/* Submit */}
          <Card>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || submitted}
              style={{
                padding: "10px 28px",
                fontSize: 14,
                fontWeight: 600,
                background: submitted ? "#1D9E75" : "#6264A7",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: submitting || submitted ? "default" : "pointer",
                transition: "background 0.15s, transform 0.1s",
                opacity: submitting ? 0.8 : 1,
              }}
            >
              {submitted
                ? "Submitted ✓"
                : submitting
                ? "Submitting…"
                : "Submit"}
            </button>
            <p
              style={{
                fontSize: 12,
                color: "#888",
                marginTop: 12,
              }}
            >
              Never submit passwords.{" "}
              <a href="#" style={{ color: "#6264A7" }}>
                Report abuse
              </a>
            </p>
          </Card>
        </div>
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        color={toast.color}
      />
    </>
  );
}