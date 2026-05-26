"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type FunnelRow = { stage: string; value: number; prev: number; color: string; conv: string | null };

function CustomTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    const d = payload[0].payload as FunnelRow;
    return (
      <div style={{ background: "#fff", border: "1px solid #e8eef4", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12 }}>
        <div style={{ fontWeight: 700, color: "#1a2a40", marginBottom: 4 }}>{d.stage}</div>
        <div style={{ color: "#4a6070" }}>This month: <strong>{d.value.toLocaleString()}</strong></div>
        <div style={{ color: "#8aaabb" }}>Last month: {d.prev.toLocaleString()}</div>
        {d.conv && <div style={{ color: "#9E74D0", marginTop: 4 }}>Conv. rate: <strong>{d.conv}</strong></div>}
      </div>
    );
  }
  return null;
}

export default function FunnelChart({ data }: { data: FunnelRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#8aaabb" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#c8d8e8" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(128,178,255,0.06)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52} name="This month">
          {data.map((d) => <Cell key={d.stage} fill={d.color} />)}
        </Bar>
        <Bar dataKey="prev" radius={[4, 4, 0, 0]} maxBarSize={52} fill="#f0f4f8" name="Last month" />
      </BarChart>
    </ResponsiveContainer>
  );
}
