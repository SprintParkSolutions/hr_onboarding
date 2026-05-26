"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";

const funnelData = [
  { stage: "Sourced",     count: 1284 },
  { stage: "Screened",    count: 796  },
  { stage: "Interviewed", count: 358  },
  { stage: "Offered",     count: 142  },
  { stage: "Hired",       count: 89   },
];

const trendData = [
  { month: "Jan", hired: 12, sourced: 180 },
  { month: "Feb", hired: 18, sourced: 210 },
  { month: "Mar", hired: 22, sourced: 260 },
  { month: "Apr", hired: 15, sourced: 190 },
  { month: "May", hired: 28, sourced: 310 },
];

export default function AnalyticsCharts() {
  return (
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
            <Line type="monotone" dataKey="hired"   stroke="#7ec8a0" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="sourced" stroke="#ffc8d8" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
