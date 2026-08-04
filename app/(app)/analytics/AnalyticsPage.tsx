"use client";
import "./AnalyticsPage.css";
import dynamic from "next/dynamic";

// Lazy-load the heavy recharts bundle — only fetched when Analytics is visited
const AnalyticsCharts = dynamic(() => import("./AnalyticsCharts"), {
  ssr: false,
  loading: () => <div className="charts-skeleton" />,
});

const kpis = [
  { label: "Avg time to hire",      value: "18 days",  delta: "↓ 4d vs Q4",   good: true },
  { label: "Offer acceptance rate", value: "62%",       delta: "↑ 8% vs Q4",   good: true },
  { label: "AI shortlist accuracy", value: "91%",       delta: "↑ 3% vs Q4",   good: true },
  { label: "Cost per hire",         value: "₹42,000",  delta: "↓ ₹6k vs Q4",  good: true },
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

      {/* KPI cards are static — rendered on the server, no JS needed */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.good ? "good" : "bad"}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts are client-only and lazy — don't block initial render */}
      <AnalyticsCharts />
    </div>
  );
}
