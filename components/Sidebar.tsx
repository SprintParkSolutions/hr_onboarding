"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, Calendar, FileText, BarChart2, Bot } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/interviews", label: "Interviews", icon: Calendar },
  { href: "/offers", label: "Offers", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/copilot", label: "HR Copilot", icon: Bot },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{ width: 224, minHeight: "100vh", flexShrink: 0, background: "#ffffff", borderRight: "1px solid #e8eef4", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #e8eef4", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #9E74D0, #80B2FF)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(158,116,208,0.4)" }}>
          <Bot size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2a40" }}>SprintPark AI HR</div>
          <div style={{ fontSize: 11, color: "#8aaabb" }}>Acme Inc · Recruiting workspace</div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, marginBottom: 2, background: active ? "#f0eeff" : "transparent", color: active ? "#7a52b0" : "#4a6070", fontWeight: active ? 700 : 500, fontSize: 13.5, transition: "all 0.15s" }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
