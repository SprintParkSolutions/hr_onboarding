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
  bg:          "rgba(255,255,255,0.85)",
  border:      "rgba(221,208,200,0.6)",
  logo:        "linear-gradient(135deg, #8B6474, #E8806A)",
  logoShadow:  "0 2px 10px rgba(139,100,116,0.35)",
  textMain:    "#3D2B32",
  textSub:     "#A08890",
  navActive:   "rgba(139,100,116,0.12)",
  navText:     "#7A5A64",
  navTextAct:  "#6B4A58",
  navBorder:   "#8B6474",
};

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
        <Bot size={18} color="white" />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.textMain }}>SprintPark AI HR</div>
        <div style={{ fontSize: 11, color: C.textSub }}>Acme Inc · Recruiting</div>
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
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(61,43,50,0.35)", backdropFilter: "blur(3px)" }} />}

      {/* Mobile drawer */}
      <aside style={{ position: "fixed", top: 0, left: mobileOpen ? 0 : -260, bottom: 0, width: 240, zIndex: 400, background: "rgba(255,255,255,0.97)", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "left 0.25s ease", boxShadow: mobileOpen ? "4px 0 30px rgba(139,100,116,0.18)" : "none" }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: C.logo, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Bot size={18} color="white" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.textMain }}>SprintPark AI HR</div>
            <div style={{ fontSize: 11, color: C.textSub }}>Acme Inc · Recruiting</div>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSub }}><X size={20} /></button>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>{navItems}</nav>
      </aside>

      <style>{`@media(max-width:768px){.sidebar-desktop{display:none!important}.sidebar-hamburger{display:flex!important}}`}</style>
    </>
  );
}
