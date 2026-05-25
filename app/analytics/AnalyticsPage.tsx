"use client";
import "./AnalyticsPage.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const funnelData = [
  { stage: "Sourced", count: 1284 },
  { stage: "Screened", count: 796 },
  { stage: "Interviewed", count: 358 },
  { stage: "Offered", count: 142 },
  { stage: "Hired", count: 89 },
];

const trendData = [
  { month: "Jan", hired: 12, sourced: 180 },
  { month: "Feb", hired: 18, sourced: 210 },
  { month: "Mar", hired: 22, sourced: 260 },
  { month: "Apr", hired: 15, sourced: 190 },
  { month: "May", hired: 28, sourced: 310 },
];

const kpis = [
  { label: "Avg time to hire", value: "18 days", delta: "↓ 4d vs Q4", good: true },
  { label: "Offer acceptance rate", value: "62%", delta: "↑ 8% vs Q4", good: true },
  { label: "AI shortlist accuracy", value: "91%", delta: "↑ 3% vs Q4", good: true },
  { label: "Cost per hire", value: "₹42,000", delta: "↓ ₹6k vs Q4", good: true },
];

export default function AnalyticsPage() {
  return (
    <div className="analytics">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Recruitment performance · Last 30 days</p>
        </div>
        <button className="btn-outline">↓ Export report</button>
      </div>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.good ? "good" : "bad"}`}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Hiring Funnel</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#9CE0FF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">Hiring Trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef8ff" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="hired" stroke="#7ec8a0" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="sourced" stroke="#ffc8d8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}



