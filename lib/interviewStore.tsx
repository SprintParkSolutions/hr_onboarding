"use client";
import React, { createContext, useContext, useState } from "react";

/* ── Types ─────────────────────────────────────────────── */
export type RoundStatus = "pending" | "active" | "passed" | "failed" | "on-hold";

export type Round = {
  roundNo: number;
  type: string;
  date: string;
  time: string;
  interviewer: string;
  interviewerEmail: string;
  mode: "Video Call" | "In-person";
  duration: string;
  status: RoundStatus;
  mailSent: boolean;
};

export type Candidate = {
  id: number;
  name: string;
  initials: string;
  color: string;
  email: string;
  role: string;
  rounds: Round[];
};

/* ── Seed data ──────────────────────────────────────────── */
const seed: Candidate[] = [
  { id:1,  name:"Yuki Tanaka",    initials:"YT", color:"#B875A0", email:"yuki.tanaka@email.com",    role:"Frontend Engineer",
    rounds:[
      {roundNo:1,type:"Technical",   date:"Today",      time:"11:00 AM",interviewer:"Priya R.", interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},
      {roundNo:2,type:"System Design",date:"Tomorrow",  time:"2:00 PM", interviewer:"Arjun K.",interviewerEmail:"arjun.k@recruitai.app", mode:"Video Call",duration:"60 min",status:"pending",mailSent:false},
      {roundNo:3,type:"Managerial",  date:"28 May 2026",time:"11:00 AM",interviewer:"CEO",     interviewerEmail:"ceo@recruitai.app",     mode:"In-person",duration:"45 min",status:"pending",mailSent:false},
    ]},
  { id:2,  name:"Sarah Mitchell", initials:"SM", color:"#8A6AAE", email:"sarah.mitchell@email.com", role:"Senior Backend Engineer",
    rounds:[
      {roundNo:1,type:"Technical",   date:"20 May 2026",time:"10:00 AM",interviewer:"Arjun K.",interviewerEmail:"arjun.k@recruitai.app", mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },
      {roundNo:2,type:"System Design",date:"Today",     time:"2:30 PM", interviewer:"Priya R.",interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},
      {roundNo:3,type:"Managerial",  date:"25 May 2026",time:"10:00 AM",interviewer:"Rahul D.",interviewerEmail:"rahul.d@recruitai.app", mode:"In-person",duration:"60 min",status:"pending",mailSent:false},
      {roundNo:4,type:"HR Round",    date:"26 May 2026",time:"3:00 PM", interviewer:"Sneha M.",interviewerEmail:"sneha.m@recruitai.app", mode:"Video Call",duration:"30 min",status:"pending",mailSent:false},
    ]},
  { id:3,  name:"Marco Greco",    initials:"MG", color:"#7AB8D8", email:"marco.greco@email.com",   role:"DevOps Engineer",
    rounds:[
      {roundNo:1,type:"Technical",   date:"Tomorrow",   time:"10:00 AM",interviewer:"Sneha M.",interviewerEmail:"sneha.m@recruitai.app", mode:"In-person",duration:"60 min",status:"active", mailSent:false},
      {roundNo:2,type:"Practical",   date:"27 May 2026",time:"11:00 AM",interviewer:"Rahul D.",interviewerEmail:"rahul.d@recruitai.app", mode:"Video Call",duration:"60 min",status:"pending",mailSent:false},
    ]},
  { id:4,  name:"Aisha Levi",     initials:"AL", color:"#C078B0", email:"aisha.levi@email.com",    role:"Data Scientist",
    rounds:[
      {roundNo:1,type:"Case Study",  date:"20 May 2026",time:"3:00 PM", interviewer:"Rahul D.",interviewerEmail:"rahul.d@recruitai.app", mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },
      {roundNo:2,type:"Technical",   date:"22 May 2026",time:"10:00 AM",interviewer:"Arjun K.",interviewerEmail:"arjun.k@recruitai.app", mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },
      {roundNo:3,type:"Managerial",  date:"Tomorrow",   time:"2:00 PM", interviewer:"Priya R.",interviewerEmail:"priya.r@recruitai.app", mode:"In-person",duration:"45 min",status:"active", mailSent:false},
      {roundNo:4,type:"HR Round",    date:"29 May 2026",time:"11:00 AM",interviewer:"Sneha M.",interviewerEmail:"sneha.m@recruitai.app", mode:"Video Call",duration:"30 min",status:"pending",mailSent:false},
    ]},
  { id:5,  name:"Priya Sharma",   initials:"PS", color:"#A898D8", email:"priya.sharma@email.com",  role:"Product Manager",
    rounds:[
      {roundNo:1,type:"Product",     date:"19 May 2026",time:"11:30 AM",interviewer:"Sneha M.",interviewerEmail:"sneha.m@recruitai.app", mode:"In-person",duration:"45 min",status:"passed", mailSent:true },
      {roundNo:2,type:"Culture Fit", date:"Today",      time:"3:00 PM", interviewer:"CEO",     interviewerEmail:"ceo@recruitai.app",     mode:"In-person",duration:"45 min",status:"active", mailSent:false},
    ]},
  { id:6,  name:"Ravi Kumar",     initials:"RK", color:"#B875A0", email:"ravi.kumar@email.com",    role:"Frontend Engineer",
    rounds:[
      {roundNo:1,type:"Technical",   date:"23 May 2026",time:"10:00 AM",interviewer:"Priya R.",interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},
      {roundNo:2,type:"System Design",date:"25 May 2026",time:"11:00 AM",interviewer:"Arjun K.",interviewerEmail:"arjun.k@recruitai.app",mode:"Video Call",duration:"60 min",status:"pending",mailSent:false},
    ]},
  { id:7,  name:"Neha Joshi",     initials:"NJ", color:"#8A6AAE", email:"neha.joshi@email.com",    role:"UX Designer",
    rounds:[
      {roundNo:1,type:"Portfolio",   date:"22 May 2026",time:"2:00 PM", interviewer:"Priya R.",interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"45 min",status:"passed", mailSent:true },
      {roundNo:2,type:"Culture Fit", date:"24 May 2026",time:"3:00 PM", interviewer:"CEO",     interviewerEmail:"ceo@recruitai.app",     mode:"In-person",duration:"45 min",status:"active", mailSent:false},
    ]},
  { id:8,  name:"Amit Singh",     initials:"AS", color:"#7AB8D8", email:"amit.singh@email.com",    role:"Backend Engineer",
    rounds:[
      {roundNo:1,type:"Technical",   date:"Today",      time:"9:00 AM", interviewer:"Arjun K.",interviewerEmail:"arjun.k@recruitai.app", mode:"Video Call",duration:"60 min",status:"active", mailSent:false},
      {roundNo:2,type:"System Design",date:"26 May 2026",time:"10:00 AM",interviewer:"Priya R.",interviewerEmail:"priya.r@recruitai.app",mode:"Video Call",duration:"60 min",status:"pending",mailSent:false},
      {roundNo:3,type:"HR Round",    date:"27 May 2026",time:"3:00 PM", interviewer:"Sneha M.",interviewerEmail:"sneha.m@recruitai.app", mode:"Video Call",duration:"30 min",status:"pending",mailSent:false},
    ]},
  { id:9,  name:"Divya Menon",    initials:"DM", color:"#C078B0", email:"divya.menon@email.com",   role:"Data Analyst",
    rounds:[
      {roundNo:1,type:"Technical",   date:"21 May 2026",time:"11:00 AM",interviewer:"Rahul D.",interviewerEmail:"rahul.d@recruitai.app", mode:"Video Call",duration:"60 min",status:"failed", mailSent:true },
    ]},
  { id:10, name:"Karan Mehta",    initials:"KM", color:"#A898D8", email:"karan.mehta@email.com",   role:"Product Manager",
    rounds:[
      {roundNo:1,type:"Product",     date:"22 May 2026",time:"10:00 AM",interviewer:"Priya R.",interviewerEmail:"priya.r@recruitai.app", mode:"Video Call",duration:"60 min",status:"passed", mailSent:true },
      {roundNo:2,type:"Managerial",  date:"24 May 2026",time:"2:00 PM", interviewer:"CEO",     interviewerEmail:"ceo@recruitai.app",     mode:"In-person",duration:"45 min",status:"passed", mailSent:true },
      {roundNo:3,type:"HR Round",    date:"Today",      time:"4:00 PM", interviewer:"Sneha M.",interviewerEmail:"sneha.m@recruitai.app", mode:"Video Call",duration:"30 min",status:"active", mailSent:false},
    ]},
];

/* ── Context ────────────────────────────────────────────── */
type StoreCtx = {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  updateCandidate: (id: number, updater: (c: Candidate) => Candidate) => void;
  addRound: (candidateId: number) => void;
  removeRound: (candidateId: number, roundNo: number) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

export function InterviewStoreProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>(seed);

  function updateCandidate(id: number, updater: (c: Candidate) => Candidate) {
    setCandidates(prev => prev.map(c => c.id === id ? updater(c) : c));
  }

  function addRound(candidateId: number) {
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const next = c.rounds.length + 1;
      const newRound: Round = {
        roundNo: next,
        type: "New Round",
        date: "TBD",
        time: "TBD",
        interviewer: "TBD",
        interviewerEmail: "",
        mode: "Video Call",
        duration: "60 min",
        status: "pending",
        mailSent: false,
      };
      return { ...c, rounds: [...c.rounds, newRound] };
    }));
  }

  function removeRound(candidateId: number, roundNo: number) {
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      // Don't remove active/passed rounds — only pending ones
      const filtered = c.rounds.filter(r => r.roundNo !== roundNo);
      // Re-number sequentially
      const renumbered = filtered.map((r, i) => ({ ...r, roundNo: i + 1 }));
      return { ...c, rounds: renumbered };
    }));
  }

  return (
    <Ctx.Provider value={{ candidates, setCandidates, updateCandidate, addRound, removeRound }}>
      {children}
    </Ctx.Provider>
  );
}

export function useInterviewStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useInterviewStore must be used within InterviewStoreProvider");
  return ctx;
}
