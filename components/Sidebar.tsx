"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, Calendar, FileText, BarChart2, Bot, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/jobs",       label: "Jobs",        icon: Briefcase },
  { href: "/interviews", label: "Interviews",  icon: Calendar },
  { href: "/feedback",   label: "Feedback",    icon: MessageSquare },
  { href: "/offers",     label: "Offers",      icon: FileText },
  { href: "/analytics",  label: "Analytics",   icon: BarChart2 },
  { href: "/copilot",    label: "HR Copilot",  icon: Bot },
];

export default function Sidebar() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
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
          boxShadow: "0 2px 10px rgba(192,128,208,0.4)", flexShrink: 0,
        }}>
          <Bot size={18} color="white" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#3a1a58", whiteSpace: "nowrap" }}>SprintPark AI HR</div>
          <div style={{ fontSize: 11, color: "#9a80b0", whiteSpace: "nowrap" }}>Acme Inc · Recruiting</div>
        </div>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9a80b0", display: "none" }}
          className="sidebar-close-btn"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
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
                textDecoration: "none",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{
        width: 220, minHeight: "100vh", flexShrink: 0,
        background: "rgba(255,255,255,0.6)",
        borderRight: "1px solid rgba(224,200,240,0.6)",
        display: "flex", flexDirection: "column",
        backdropFilter: "blur(12px)",
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 200,
          width: 38, height: 38,
          background: "linear-gradient(135deg, #c080d0, #e8a0c8)",
          border: "none", borderRadius: 10,
          display: "none", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(192,128,208,0.4)", cursor: "pointer",
        }}
      >
        <Menu size={18} color="white" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(58,26,88,0.35)",
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className="sidebar-mobile"
        style={{
          position: "fixed", top: 0, left: mobileOpen ? 0 : -260, bottom: 0,
          width: 240, zIndex: 400,
          background: "rgba(255,255,255,0.95)",
          borderRight: "1px solid rgba(224,200,240,0.6)",
          display: "flex", flexDirection: "column",
          backdropFilter: "blur(20px)",
          transition: "left 0.25s ease",
          boxShadow: mobileOpen ? "4px 0 30px rgba(192,128,208,0.2)" : "none",
        }}
      >
        {/* Close button inside drawer */}
        <div style={{
          padding: "18px 16px",
          borderBottom: "1px solid rgba(224,200,240,0.5)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #c080d0, #e8a0c8)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(192,128,208,0.4)", flexShrink: 0,
          }}>
            <Bot size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#3a1a58" }}>SprintPark AI HR</div>
            <div style={{ fontSize: 11, color: "#9a80b0" }}>Acme Inc · Recruiting</div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9a80b0" }}
          >
            <X size={20} />
          </button>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                  background: active
                    ? "linear-gradient(135deg, rgba(192,128,208,0.18), rgba(232,160,200,0.14))"
                    : "transparent",
                  color: active ? "#9a50b0" : "#7a5a90",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  transition: "all 0.15s",
                  borderLeft: active ? "3px solid #c080d0" : "3px solid transparent",
                  textDecoration: "none",
                }}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
