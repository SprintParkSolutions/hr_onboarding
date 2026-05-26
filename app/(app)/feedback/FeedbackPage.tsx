"use client";
import "./FeedbackPage.css";
import { useState } from "react";
import { Star, User, Calendar, Briefcase, ChevronDown, ChevronUp, MessageSquare, TrendingUp, Award, X } from "lucide-react";

type SkillRating = { skill: string; score: number; comment: string };

type Feedback = {
  id: number;
  candidate: string;
  initials: string;
  color: string;
  role: string;
  round: string;
  date: string;
  interviewer: string;
  interviewerInitials: string;
  overallRating: number;
  recommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire";
  summary: string;
  strengths: string[];
  improvements: string[];
  skills: SkillRating[];
};

const feedbacks: Feedback[] = [
  {
    id: 1,
    candidate: "Yuki Tanaka",
    initials: "YT",
    color: "#10b981",
    role: "Frontend Engineer",
    round: "Technical",
    date: "24 May 2026",
    interviewer: "Priya R.",
    interviewerInitials: "PR",
    overallRating: 4.5,
    recommendation: "Strong Hire",
    summary:
      "Yuki demonstrated exceptional proficiency in React and modern frontend tooling. She tackled the live coding challenge with confidence, writing clean, well-structured code. Her understanding of performance optimisation and accessibility best practices stood out. Communication was clear and she asked thoughtful clarifying questions throughout.",
    strengths: [
      "Deep knowledge of React hooks and state management",
      "Strong CSS architecture and responsive design skills",
      "Proactive in discussing trade-offs and edge cases",
    ],
    improvements: [
      "Could improve familiarity with backend integration patterns",
      "Testing coverage awareness needs some depth",
    ],
    skills: [
      { skill: "React / JavaScript", score: 5, comment: "Excellent — solved all problems efficiently with clean code." },
      { skill: "CSS & Responsive Design", score: 5, comment: "Impressive knowledge of layout systems and accessibility." },
      { skill: "Problem Solving", score: 4, comment: "Approached problems methodically; minor hesitation on complex recursion." },
      { skill: "System Design", score: 4, comment: "Good understanding of component architecture at scale." },
      { skill: "Communication", score: 5, comment: "Articulate, concise, and collaborative throughout." },
      { skill: "Testing", score: 3, comment: "Knows the basics but lacks depth in integration testing strategies." },
    ],
  },
  {
    id: 2,
    candidate: "Sarah Mitchell",
    initials: "SM",
    color: "#8b5cf6",
    role: "Senior Backend Engineer",
    round: "System Design",
    date: "24 May 2026",
    interviewer: "Arjun K.",
    interviewerInitials: "AK",
    overallRating: 4.0,
    recommendation: "Hire",
    summary:
      "Sarah showed solid system design fundamentals and a good grasp of distributed systems. She designed a scalable notification service with reasonable trade-off discussions. Her experience with microservices and event-driven architecture was evident. Some gaps in database sharding strategies but overall a strong candidate for the senior role.",
    strengths: [
      "Strong distributed systems and microservices knowledge",
      "Clear and structured approach to system design",
      "Good understanding of CAP theorem and consistency models",
    ],
    improvements: [
      "Database sharding and partitioning strategies need more depth",
      "Could elaborate more on monitoring and observability",
    ],
    skills: [
      { skill: "System Design", score: 4, comment: "Designed a solid scalable architecture with good trade-off analysis." },
      { skill: "Distributed Systems", score: 5, comment: "Excellent grasp of consistency, availability, and partition tolerance." },
      { skill: "Databases", score: 3, comment: "Comfortable with SQL/NoSQL but sharding strategies were vague." },
      { skill: "API Design", score: 4, comment: "RESTful design was clean; mentioned gRPC as an alternative." },
      { skill: "Communication", score: 4, comment: "Well-structured explanations; occasionally verbose." },
      { skill: "Problem Solving", score: 4, comment: "Methodical and thorough; handled ambiguity well." },
    ],
  },
  {
    id: 3,
    candidate: "Marco Greco",
    initials: "MG",
    color: "#2563eb",
    role: "DevOps Engineer",
    round: "Technical",
    date: "23 May 2026",
    interviewer: "Sneha M.",
    interviewerInitials: "SM",
    overallRating: 3.0,
    recommendation: "Hold",
    summary:
      "Marco has a decent foundation in CI/CD pipelines and containerisation but struggled with Kubernetes orchestration questions and infrastructure-as-code depth. He was enthusiastic and showed good learning agility. With some upskilling in cloud-native tooling, he could be a strong fit. Recommend holding for a junior-to-mid level opening.",
    strengths: [
      "Solid Docker and containerisation fundamentals",
      "Good understanding of CI/CD pipeline design",
      "Enthusiastic and eager to learn",
    ],
    improvements: [
      "Kubernetes orchestration knowledge needs significant improvement",
      "Terraform and IaC practices are surface-level",
      "Needs more hands-on cloud (AWS/GCP) experience",
    ],
    skills: [
      { skill: "Docker & Containers", score: 4, comment: "Comfortable with Docker; understands multi-stage builds." },
      { skill: "Kubernetes", score: 2, comment: "Struggled with pod scheduling, HPA, and networking concepts." },
      { skill: "CI/CD Pipelines", score: 4, comment: "Good knowledge of GitHub Actions and Jenkins." },
      { skill: "Infrastructure as Code", score: 2, comment: "Basic Terraform knowledge; no experience with modules or state management." },
      { skill: "Cloud Platforms", score: 3, comment: "Familiar with AWS basics but lacks depth in managed services." },
      { skill: "Communication", score: 4, comment: "Clear communicator; honest about knowledge gaps." },
    ],
  },
  {
    id: 4,
    candidate: "Aisha Levi",
    initials: "AL",
    color: "#ef4444",
    role: "Data Scientist",
    round: "Case Study",
    date: "22 May 2026",
    interviewer: "Rahul D.",
    interviewerInitials: "RD",
    overallRating: 4.8,
    recommendation: "Strong Hire",
    summary:
      "Aisha delivered an outstanding case study presentation. Her end-to-end ML pipeline design was thorough, covering data ingestion, feature engineering, model selection, and deployment monitoring. She demonstrated strong statistical intuition and communicated complex concepts clearly to a non-technical audience. One of the strongest data science candidates we have seen this quarter.",
    strengths: [
      "Exceptional ML pipeline design and MLOps awareness",
      "Strong statistical foundations and model evaluation skills",
      "Excellent ability to communicate technical concepts to stakeholders",
    ],
    improvements: [
      "Could deepen knowledge of real-time inference optimisation",
    ],
    skills: [
      { skill: "Machine Learning", score: 5, comment: "Outstanding — covered model selection, regularisation, and evaluation rigorously." },
      { skill: "Statistics & Probability", score: 5, comment: "Strong intuition; handled Bayesian vs frequentist discussion confidently." },
      { skill: "Data Engineering", score: 4, comment: "Good pipeline design; some gaps in streaming data handling." },
      { skill: "Python / SQL", score: 5, comment: "Fluent in both; wrote clean, efficient code during the exercise." },
      { skill: "Communication", score: 5, comment: "Exceptional — made complex ideas accessible and engaging." },
      { skill: "MLOps", score: 4, comment: "Good awareness of model monitoring and drift detection." },
    ],
  },
  {
    id: 5,
    candidate: "Priya Sharma",
    initials: "PS",
    color: "#0891b2",
    role: "Product Manager",
    round: "Culture Fit",
    date: "21 May 2026",
    interviewer: "CEO",
    interviewerInitials: "CE",
    overallRating: 3.5,
    recommendation: "Hire",
    summary:
      "Priya demonstrated a good product mindset and strong stakeholder management experience. She articulated her product philosophy clearly and gave concrete examples of driving cross-functional alignment. Her answers around data-driven decision making were solid. Some hesitation around ambiguous prioritisation scenarios, but overall a good cultural and functional fit.",
    strengths: [
      "Strong stakeholder management and cross-functional collaboration",
      "Clear product vision and user-centric thinking",
      "Good examples of data-informed decision making",
    ],
    improvements: [
      "Needs more confidence in ambiguous prioritisation trade-offs",
      "Could strengthen knowledge of technical constraints",
    ],
    skills: [
      { skill: "Product Strategy", score: 4, comment: "Clear vision; good examples of roadmap ownership." },
      { skill: "Stakeholder Management", score: 4, comment: "Strong — demonstrated alignment across engineering and design." },
      { skill: "Data & Analytics", score: 3, comment: "Comfortable with metrics but lacked depth in experimentation design." },
      { skill: "Prioritisation", score: 3, comment: "Struggled slightly with ambiguous trade-off scenarios." },
      { skill: "Communication", score: 4, comment: "Articulate and confident; good storytelling." },
      { skill: "Technical Acumen", score: 3, comment: "Understands basics but could improve on technical constraint discussions." },
    ],
  },
];

const recommendationStyle: Record<string, { bg: string; text: string; dot: string }> = {
  "Strong Hire": { bg: "rgba(110,200,160,0.15)", text: "#1a7a50", dot: "#6ec8a0" },
  "Hire":        { bg: "rgba(128,178,255,0.15)", text: "#2a5090", dot: "#80B2FF" },
  "Hold":        { bg: "rgba(240,192,96,0.18)",  text: "#806020", dot: "#f0c060" },
  "No Hire":     { bg: "rgba(224,112,144,0.15)", text: "#a03050", dot: "#e07090" },
};

function StarRating({ score, size = 14 }: { score: number; size?: number }) {
  return (
    <span className="star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(score) ? "star-filled" : s - 0.5 <= score ? "star-half" : "star-empty"}
        />
      ))}
    </span>
  );
}

function SkillBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4.5 ? "#6ec8a0" : score >= 3.5 ? "#80B2FF" : score >= 2.5 ? "#f0c060" : "#e07090";
  return (
    <div className="skill-bar-track">
      <div className="skill-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function FeedbackPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [detailModal, setDetailModal] = useState<Feedback | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const recommendations = ["All", "Strong Hire", "Hire", "Hold", "No Hire"];
  const filtered = filter === "All" ? feedbacks : feedbacks.filter((f) => f.recommendation === filter);

  const avgRating = (feedbacks.reduce((s, f) => s + f.overallRating, 0) / feedbacks.length).toFixed(1);
  const strongHires = feedbacks.filter((f) => f.recommendation === "Strong Hire").length;
  const hires = feedbacks.filter((f) => f.recommendation === "Hire").length;

  return (
    <div className="feedback-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Interviewer Feedback</h1>
          <p className="page-sub">{feedbacks.length} feedback reports · {strongHires} strong hires · avg rating {avgRating}/5</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="fb-stats-row">
        <div className="fb-stat-card">
          <div className="fb-stat-icon" style={{ background: "rgba(110,200,160,0.15)" }}>
            <Award size={18} color="#1a7a50" />
          </div>
          <div>
            <div className="fb-stat-val">{strongHires}</div>
            <div className="fb-stat-label">Strong Hires</div>
          </div>
        </div>
        <div className="fb-stat-card">
          <div className="fb-stat-icon" style={{ background: "rgba(128,178,255,0.15)" }}>
            <TrendingUp size={18} color="#2a5090" />
          </div>
          <div>
            <div className="fb-stat-val">{hires}</div>
            <div className="fb-stat-label">Hires</div>
          </div>
        </div>
        <div className="fb-stat-card">
          <div className="fb-stat-icon" style={{ background: "rgba(158,116,208,0.15)" }}>
            <Star size={18} color="#7a52b0" />
          </div>
          <div>
            <div className="fb-stat-val">{avgRating}</div>
            <div className="fb-stat-label">Avg Rating</div>
          </div>
        </div>
        <div className="fb-stat-card">
          <div className="fb-stat-icon" style={{ background: "rgba(240,192,96,0.18)" }}>
            <MessageSquare size={18} color="#806020" />
          </div>
          <div>
            <div className="fb-stat-val">{feedbacks.length}</div>
            <div className="fb-stat-label">Total Reports</div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="fb-filter-row">
        {recommendations.map((r) => (
          <button
            key={r}
            className={`fb-filter-pill ${filter === r ? "active" : ""}`}
            onClick={() => setFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Feedback Cards */}
      <div className="fb-list">
        {filtered.map((fb) => {
          const rec = recommendationStyle[fb.recommendation];
          const isOpen = expanded === fb.id;
          const avgSkill = (fb.skills.reduce((s, sk) => s + sk.score, 0) / fb.skills.length).toFixed(1);

          return (
            <div key={fb.id} className={`fb-card ${isOpen ? "fb-card-open" : ""}`}>
              {/* Card Top Row */}
              <div className="fb-card-top">
                {/* Candidate */}
                <div className="fb-candidate">
                  <div className="fb-avatar" style={{ background: fb.color }}>{fb.initials}</div>
                  <div>
                    <div className="fb-name">{fb.candidate}</div>
                    <div className="fb-meta">
                      <Briefcase size={11} /> {fb.role} &nbsp;·&nbsp;
                      <span className="fb-round">{fb.round}</span>
                    </div>
                  </div>
                </div>

                {/* Interview info */}
                <div className="fb-info-fields">
                  <div className="fb-info-field">
                    <span className="fb-info-label"><Calendar size={10} /> Date</span>
                    <span className="fb-info-val">{fb.date}</span>
                  </div>
                  <div className="fb-info-field">
                    <span className="fb-info-label"><User size={10} /> Interviewer</span>
                    <span className="fb-info-val">{fb.interviewer}</span>
                  </div>
                  <div className="fb-info-field">
                    <span className="fb-info-label"><Star size={10} /> Avg Skill</span>
                    <span className="fb-info-val">{avgSkill} / 5</span>
                  </div>
                </div>

                {/* Right: rating + recommendation + actions */}
                <div className="fb-card-right">
                  <div className="fb-overall-row">
                    <StarRating score={fb.overallRating} size={15} />
                    <span className="fb-overall-num">{fb.overallRating}</span>
                  </div>
                  <span className="fb-rec-badge" style={{ background: rec.bg, color: rec.text }}>
                    <span className="fb-rec-dot" style={{ background: rec.dot }} />
                    {fb.recommendation}
                  </span>
                  <div className="fb-card-actions">
                    <button className="btn-detail" onClick={() => setDetailModal(fb)}>
                      <MessageSquare size={12} /> Full Report
                    </button>
                    <button className="btn-expand" onClick={() => setExpanded(isOpen ? null : fb.id)}>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded: summary + skill bars */}
              {isOpen && (
                <div className="fb-expanded">
                  <div className="fb-expanded-inner">
                    {/* Summary */}
                    <div className="fb-section">
                      <div className="fb-section-title">Summary</div>
                      <p className="fb-summary-text">{fb.summary}</p>
                    </div>

                    {/* Skills */}
                    <div className="fb-section">
                      <div className="fb-section-title">Skill Ratings</div>
                      <div className="fb-skills-grid">
                        {fb.skills.map((sk) => (
                          <div key={sk.skill} className="fb-skill-row">
                            <div className="fb-skill-header">
                              <span className="fb-skill-name">{sk.skill}</span>
                              <span className="fb-skill-score">{sk.score}/5</span>
                            </div>
                            <SkillBar score={sk.score} />
                            <span className="fb-skill-comment">{sk.comment}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="fb-two-col">
                      <div className="fb-section">
                        <div className="fb-section-title">Strengths</div>
                        <ul className="fb-bullet-list strengths">
                          {fb.strengths.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="fb-section">
                        <div className="fb-section-title">Areas to Improve</div>
                        <ul className="fb-bullet-list improvements">
                          {fb.improvements.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Report Modal */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="fb-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="fb-modal-header">
              <div className="fb-modal-title-row">
                <div className="fb-avatar" style={{ background: detailModal.color, width: 40, height: 40, fontSize: 13 }}>
                  {detailModal.initials}
                </div>
                <div>
                  <div className="fb-modal-name">{detailModal.candidate}</div>
                  <div className="fb-modal-sub">{detailModal.role} · {detailModal.round} · {detailModal.date}</div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setDetailModal(null)}><X size={18} /></button>
            </div>

            <div className="fb-modal-body">
              {/* Overall */}
              <div className="fb-modal-overall">
                <div className="fb-modal-overall-left">
                  <div className="fb-modal-rating-num">{detailModal.overallRating}</div>
                  <StarRating score={detailModal.overallRating} size={18} />
                  <div className="fb-modal-rating-label">Overall Rating</div>
                </div>
                <div className="fb-modal-overall-right">
                  <div className="fb-modal-rec-label">Recommendation</div>
                  <span
                    className="fb-rec-badge fb-rec-badge-lg"
                    style={{
                      background: recommendationStyle[detailModal.recommendation].bg,
                      color: recommendationStyle[detailModal.recommendation].text,
                    }}
                  >
                    <span className="fb-rec-dot" style={{ background: recommendationStyle[detailModal.recommendation].dot }} />
                    {detailModal.recommendation}
                  </span>
                  <div className="fb-modal-interviewer">
                    <div className="fb-interviewer-chip">
                      <div className="fb-interviewer-avatar">{detailModal.interviewerInitials}</div>
                      <span>{detailModal.interviewer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="fb-modal-section">
                <div className="fb-modal-section-title">Interview Summary</div>
                <p className="fb-summary-text">{detailModal.summary}</p>
              </div>

              {/* Skill Ratings */}
              <div className="fb-modal-section">
                <div className="fb-modal-section-title">Skill Ratings</div>
                <div className="fb-modal-skills">
                  {detailModal.skills.map((sk) => (
                    <div key={sk.skill} className="fb-modal-skill-row">
                      <div className="fb-modal-skill-top">
                        <span className="fb-skill-name">{sk.skill}</span>
                        <div className="fb-modal-skill-right">
                          <StarRating score={sk.score} size={13} />
                          <span className="fb-skill-score">{sk.score}/5</span>
                        </div>
                      </div>
                      <SkillBar score={sk.score} />
                      <span className="fb-skill-comment">{sk.comment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="fb-modal-two-col">
                <div className="fb-modal-section">
                  <div className="fb-modal-section-title">Strengths</div>
                  <ul className="fb-bullet-list strengths">
                    {detailModal.strengths.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div className="fb-modal-section">
                  <div className="fb-modal-section-title">Areas to Improve</div>
                  <ul className="fb-bullet-list improvements">
                    {detailModal.improvements.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
