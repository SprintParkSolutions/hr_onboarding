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

const C = {
  bg:         "rgba(255,255,255,0.85)",
  border:     "rgba(226,212,204,0.7)",
  logo:       "linear-gradient(135deg, #9B7485, #E8806A)",
  logoShadow: "0 2px 10px rgba(155,116,133,0.35)",
  textMain:   "#4A3040",
  textSub:    "#A8919A",
  navActive:  "rgba(155,116,133,0.12)",
  navText:    "#7E6070",
  navTextAct: "#7D5568",
  navBorder:  "#9B7485",
};

function RecruitAILogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" fill="white" opacity="0.95" />
      <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.95" />
      <circle cx="19" cy="9" r="2" fill="white" opacity="0.85" />
      <line x1="17.2" y1="8"  x2="15"   y2="7"  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <line x1="17.2" y1="10" x2="15"   y2="13" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <line x1="21"   y1="9"  x2="22.5" y2="7"  stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function Sidebar() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = nav.map(({ href, label, icon: Icon }) => {
    const active = path === href;
    return (
      <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", borderRadius: 10, marginBottom: 2,
        background: active ? C.navActive : "transparent",
        color: active ? C.navTextAct : C.navText,
        fontWeight: active ? 700 : 500, fontSize: 13.5,
        transition: "all 0.15s",
        borderLeft: active ? `3px solid ${C.navBorder}` : "3px solid transparent",
        textDecoration: "none",
      }}>
        <Icon size={16} />
        {label}
      </Link>
    );
  });

  const logoBlock = (
    <div style={{ padding: "18px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, background: C.logo, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.logoShadow, flexShrink: 0 }}>
        <RecruitAILogo size={20} />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, color: C.textMain, letterSpacing: "-0.4px" }}>
          Recruit<span style={{ color: "#E8806A" }}>AI</span>
        </div>
        <div style={{ fontSize: 11, color: C.textSub }}>AI-Powered Recruiting</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sidebar-desktop" style={{ width: 220, minHeight: "100vh", flexShrink: 0, background: C.bg, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
        {logoBlock}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>{navItems}</nav>
      </aside>

      {/* Hamburger */}
      <button className="sidebar-hamburger" onClick={() => setMobileOpen(true)} style={{ position: "fixed", top: 12, left: 12, zIndex: 200, width: 38, height: 38, background: C.logo, border: "none", borderRadius: 10, display: "none", alignItems: "center", justifyContent: "center", boxShadow: C.logoShadow, cursor: "pointer" }}>
        <Menu size={18} color="white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(74,48,64,0.35)", backdropFilter: "blur(3px)" }} />}

      {/* Mobile drawer */}
      <aside style={{ position: "fixed", top: 0, left: mobileOpen ? 0 : -260, bottom: 0, width: 240, zIndex: 400, background: "rgba(255,255,255,0.97)", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "left 0.25s ease", boxShadow: mobileOpen ? "4px 0 30px rgba(155,116,133,0.2)" : "none" }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: C.logo, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RecruitAILogo size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.textMain, letterSpacing: "-0.4px" }}>
              Recruit<span style={{ color: "#E8806A" }}>AI</span>
            </div>
            <div style={{ fontSize: 11, color: C.textSub }}>AI-Powered Recruiting</div>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSub }}><X size={20} /></button>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>{navItems}</nav>
      </aside>

      <style>{`@media(max-width:768px){.sidebar-desktop{display:none!important}.sidebar-hamburger{display:flex!important}}`}</style>
    </>
  );
}
