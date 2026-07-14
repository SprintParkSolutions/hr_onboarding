export type FeedbackEntry = {
  candidate: string;
  initials: string;
  color: string;
  role: string;
  round: string;
  interviewer: string;
  date: string;
  rating: number;
  recommendation: string;
  summary: string;
  skills: { name: string; score: number }[];
  status: "completed" | "pending" | "scheduled";
};

export const MANAGER_FEEDBACK_DATA: FeedbackEntry[] = [
  { candidate:"Sarah Mitchell",  initials:"SM", color:"#8b5cf6", role:"Senior Backend Engineer", round:"R1 — Technical",    interviewer:"Arjun K.",  date:"20 May 2026", rating:4.0, recommendation:"Hire",        summary:"Strong Kafka and distributed systems knowledge.",     skills:[{name:"Coding",score:4},{name:"System Design",score:4},{name:"Communication",score:4}], status:"completed" },
  { candidate:"Sarah Mitchell",  initials:"SM", color:"#8b5cf6", role:"Senior Backend Engineer", round:"R2 — System Design",interviewer:"Priya R.",  date:"22 May 2026", rating:4.5, recommendation:"Strong Hire", summary:"Best system design this quarter.",                    skills:[{name:"System Design",score:5},{name:"API Design",score:4},{name:"Scalability",score:5}], status:"completed" },
  { candidate:"Aisha Levi",      initials:"AL", color:"#ef4444", role:"Data Scientist",          round:"R1 — Case Study",   interviewer:"Rahul D.",  date:"20 May 2026", rating:5.0, recommendation:"Strong Hire", summary:"Outstanding ML pipeline presentation.",              skills:[{name:"ML Design",score:5},{name:"Statistics",score:5},{name:"Python",score:5}], status:"completed" },
  { candidate:"Yuki Tanaka",     initials:"YT", color:"#10b981", role:"Frontend Engineer",       round:"R1 — Technical",    interviewer:"Priya R.",  date:"Today",       rating:4.5, recommendation:"Strong Hire", summary:"Exceptional React proficiency.",                     skills:[{name:"React",score:5},{name:"CSS",score:5},{name:"Problem Solving",score:4}], status:"completed" },
  { candidate:"Marco Greco",     initials:"MG", color:"#2563eb", role:"DevOps Engineer",         round:"R1 — Technical",    interviewer:"Sneha M.",  date:"Tomorrow",    rating:0,   recommendation:"—",           summary:"Scheduled — pending feedback.",                      skills:[], status:"scheduled" },
  { candidate:"Priya Sharma",    initials:"PS", color:"#0891b2", role:"Product Manager",         round:"R2 — Culture Fit",  interviewer:"CEO",        date:"Today",       rating:0,   recommendation:"—",           summary:"In progress.",                                       skills:[], status:"scheduled" },
];

export const REC_COLORS: Record<string, { bg: string; color: string }> = {
  "Strong Hire": { bg:"rgba(16,185,129,0.12)",  color:"#065f46" },
  "Hire":        { bg:"rgba(99,102,241,0.12)",  color:"#4f46e5" },
  "Hold":        { bg:"rgba(245,158,11,0.12)",  color:"#92400e" },
  "No Hire":     { bg:"rgba(239,68,68,0.12)",   color:"#991b1b" },
  "—":           { bg:"rgba(221,208,232,0.3)",  color:"#9090B0" },
};

export function getPendingManagerApprovals(): FeedbackEntry[] {
  return MANAGER_FEEDBACK_DATA.filter(f => f.status === "completed");
}
