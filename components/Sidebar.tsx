"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, Calendar, FileText, BarChart2, Bot, MessageSquare } from "lucide-react";

const nav = [
  { href: "/",            label: "Dashboard",  icon: LayoutDashboard },
  { href: "/candidates",  label: "Candidates", icon: Users },
  { href: "/jobs",        label: "Jobs",        icon: Briefcase },
  { href: "/interviews",  label: "Interviews",  icon: Calendar },
  { href: "/feedback",    label: "Feedback",    icon: MessageSquare },
  { href: "/offers",      label: "Offers",      icon: FileText },
  { href: "/analytics",   label: "Analytics",   icon: BarChart2 },
  { href: "/copilot",     label: "HR Copilot",  icon: Bot },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{
      width: 224, minHeight: "100vh", flexShrink: 0,
      background: "rgba(255,255,255,0.6)",
      borderRight: "1px solid rgba(224,200,240,0.6)",
      display: "flex", flexDirection: "column",
      backdropFilter: "blur(12px)",
    }}>
      {/* Logo */}
      <div style={{
        padding: "18px 16px",
        borderBottom: "1px solid rgba(224,200,240,0.5)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #c080d0, #e8a0c8)",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(192,128,208,0.4)",
        }}>
          <Bot size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#3a1a58" }}>SprintPark AI HR</div>
          <div style={{ fontSize: 11, color: "#9a80b0" }}>Acme Inc · Recruiting workspace</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, marginBottom: 2,
                background: active
                  ? "linear-gradient(135deg, rgba(192,128,208,0.18), rgba(232,160,200,0.14))"
                  : "transparent",
                color: active ? "#9a50b0" : "#7a5a90",
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
                transition: "all 0.15s",
                borderLeft: active ? "3px solid #c080d0" : "3px solid transparent",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
