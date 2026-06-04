"use client";
import { Search, Bell, X, CheckCircle, Calendar, Users, Briefcase, AlertCircle, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const notifications = [
  { id: 1, icon: "check",     title: "Sarah Mitchell shortlisted",  desc: "AI match score 94% · Resume Screener Agent",      time: "2 min ago",  unread: true  },
  { id: 2, icon: "calendar",  title: "Interview rescheduled",       desc: "Yuki Tanaka · Tomorrow 11am · Conflict resolved", time: "15 min ago", unread: true  },
  { id: 3, icon: "alert",     title: "Offer approval pending",      desc: "Rohan Kapoor · Product Designer · ₹28L–32L",      time: "1 hr ago",   unread: true  },
  { id: 4, icon: "users",     title: "12 new applications",         desc: "Senior Backend Engineer · Last 24 hours",         time: "3 hrs ago",  unread: false },
  { id: 5, icon: "check",     title: "Background check complete",   desc: "Marco Greco · All checks passed",                 time: "5 hrs ago",  unread: false },
  { id: 6, icon: "briefcase", title: "New job posted",              desc: "DevOps Engineer · Bangalore · Urgent",            time: "1 day ago",  unread: false },
];

const iconMap: Record<string, React.ReactNode> = {
  check:     <CheckCircle size={15} color="#8DB89A" />,
  calendar:  <Calendar    size={15} color="#8B6474" />,
  alert:     <AlertCircle size={15} color="#E8806A" />,
  users:     <Users       size={15} color="#8B6474" />,
  briefcase: <Briefcase   size={15} color="#6B4A58" />,
};

export default function Topbar() {
  const [notifOpen, setNotifOpen]       = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifs, setNotifs]             = useState(notifications);
  const unreadCount = notifs.filter(n => n.unread).length;
  const router = useRouter();

  function handleLogout() {
    setProfileOpen(false);
    router.push("/login");
  }

  return (
    <header style={{ height: 56, flexShrink: 0, background: "rgba(255,255,255,0.85)", borderBottom: "1px solid rgba(221,208,200,0.6)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 20px", position: "relative", zIndex: 50 }}>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(245,240,235,0.8)", borderRadius: 10, padding: "7px 12px", width: "min(280px,45vw)", border: "1px solid rgba(221,208,200,0.7)" }}>
        <Search size={14} color="#A08890" style={{ flexShrink: 0 }} />
        <input placeholder="Search candidates, jobs..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#3D2B32", width: "100%" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
            <Bell size={20} color={notifOpen ? "#8B6474" : "#A08890"} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, background: "linear-gradient(135deg, #8B6474, #E8806A)", borderRadius: "50%", fontSize: 10, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div style={{ position: "fixed", top: 56, right: 12, width: "min(360px,calc(100vw - 24px))", background: "rgba(255,255,255,0.97)", border: "1px solid rgba(221,208,200,0.6)", borderRadius: 14, boxShadow: "0 8px 32px rgba(139,100,116,0.15)", zIndex: 100 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 10px", borderBottom: "1px solid rgba(221,208,200,0.4)", background: "linear-gradient(90deg, rgba(216,217,176,0.3), rgba(244,169,153,0.25))", borderRadius: "14px 14px 0 0" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#3D2B32" }}>Notifications</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {unreadCount > 0 && <button onClick={() => setNotifs(notifs.map(n => ({ ...n, unread: false })))} style={{ fontSize: 11, color: "#8B6474", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>}
                  <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A08890" }}><X size={15} /></button>
                </div>
              </div>
              <div style={{ maxHeight: "min(380px,60vh)", overflowY: "auto" }}>
                {notifs.map(n => (
                  <div key={n.id} onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, unread: false } : x))} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(216,217,176,0.4)", background: n.unread ? "rgba(139,100,116,0.05)" : "transparent", cursor: "pointer" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(216,217,176,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{iconMap[n.icon]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500, color: "#3D2B32" }}>{n.title}</span>
                        {n.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B6474", flexShrink: 0, marginTop: 4 }} />}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#A08890", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: "#C0A8A0", marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(221,208,200,0.4)", textAlign: "center" }}>
                <button style={{ fontSize: 12, color: "#8B6474", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <div
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            style={{ width: 34, height: 34, background: "linear-gradient(135deg, #8B6474, #E8806A)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 8px rgba(139,100,116,0.35)", flexShrink: 0 }}
          >PR</div>

          {profileOpen && (
            <div style={{ position: "fixed", top: 56, right: 12, width: 200, background: "rgba(255,255,255,0.97)", border: "1px solid rgba(221,208,200,0.6)", borderRadius: 14, boxShadow: "0 8px 32px rgba(139,100,116,0.15)", zIndex: 100, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(221,208,200,0.4)", background: "linear-gradient(90deg, rgba(216,217,176,0.3), rgba(244,169,153,0.25))" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#3D2B32" }}>Priya Rao</div>
                <div style={{ fontSize: 11.5, color: "#A08890", marginTop: 2 }}>HR Manager</div>
              </div>
              <div style={{ padding: "6px 0" }}>
                <button
                  onClick={() => setProfileOpen(false)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#3D2B32", textAlign: "left" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(216,217,176,0.3)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <User size={15} color="#8B6474" /> My Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#C0392B", textAlign: "left" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,128,106,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <LogOut size={15} color="#C0392B" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(notifOpen || profileOpen) && <div onClick={() => { setNotifOpen(false); setProfileOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 49 }} />}
    </header>
  );
}
