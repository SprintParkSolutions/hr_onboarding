"use client";
import { Search, Bell, X, CheckCircle, Calendar, Users, Briefcase, AlertCircle } from "lucide-react";
import { useState } from "react";

const notifications = [
  { id: 1, icon: "check",     title: "Sarah Mitchell shortlisted",  desc: "AI match score 94% · Resume Screener Agent",      time: "2 min ago",  unread: true  },
  { id: 2, icon: "calendar",  title: "Interview rescheduled",       desc: "Yuki Tanaka · Tomorrow 11am · Conflict resolved", time: "15 min ago", unread: true  },
  { id: 3, icon: "alert",     title: "Offer approval pending",      desc: "Rohan Kapoor · Product Designer · ₹28L–32L",      time: "1 hr ago",   unread: true  },
  { id: 4, icon: "users",     title: "12 new applications",         desc: "Senior Backend Engineer · Last 24 hours",         time: "3 hrs ago",  unread: false },
  { id: 5, icon: "check",     title: "Background check complete",   desc: "Marco Greco · All checks passed",                 time: "5 hrs ago",  unread: false },
  { id: 6, icon: "briefcase", title: "New job posted",              desc: "DevOps Engineer · Bangalore · Urgent",            time: "1 day ago",  unread: false },
];

const iconMap: Record<string, React.ReactNode> = {
  check:     <CheckCircle size={15} color="#70b890" />,
  calendar:  <Calendar    size={15} color="#c080d0" />,
  alert:     <AlertCircle size={15} color="#d8a060" />,
  users:     <Users       size={15} color="#c080d0" />,
  briefcase: <Briefcase   size={15} color="#9a50b0" />,
};

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs,    setNotifs]    = useState(notifications);
  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() {
    setNotifs(notifs.map(n => ({ ...n, unread: false })));
  }

  return (
    <header style={{
      height: 56, flexShrink: 0,
      background: "rgba(255,255,255,0.65)",
      borderBottom: "1px solid rgba(224,200,240,0.5)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px 0 20px",
      position: "relative", zIndex: 50,
    }}>
      {/* Search — hides on very small screens */}
      <div className="topbar-search" style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.6)",
        borderRadius: 10, padding: "7px 12px",
        width: "min(280px, 45vw)",
        border: "1px solid rgba(224,200,240,0.6)",
        backdropFilter: "blur(4px)",
      }}>
        <Search size={14} color="#c0a0d0" style={{ flexShrink: 0 }} />
        <input
          placeholder="Search candidates, jobs..."
          style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#3a1a58", width: "100%", minWidth: 0 }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
          >
            <Bell size={20} color={notifOpen ? "#c080d0" : "#c0a0d0"} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                width: 16, height: 16,
                background: "linear-gradient(135deg, #c080d0, #e8a0c8)",
                borderRadius: "50%", fontSize: 10, color: "white",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
              }}>{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "fixed", top: 56, right: 12,
              width: "min(360px, calc(100vw - 24px))",
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(224,200,240,0.6)",
              borderRadius: 14,
              boxShadow: "0 8px 32px rgba(192,128,208,0.2)",
              zIndex: 100,
              backdropFilter: "blur(16px)",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px 10px",
                borderBottom: "1px solid rgba(224,200,240,0.4)",
                background: "linear-gradient(90deg, rgba(237,224,255,0.5), rgba(255,214,236,0.4))",
                borderRadius: "14px 14px 0 0",
              }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#3a1a58" }}>Notifications</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ fontSize: 11, color: "#c080d0", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a80b0" }}>
                    <X size={15} />
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: "min(380px, 60vh)", overflowY: "auto" }}>
                {notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                    style={{
                      display: "flex", gap: 12, padding: "12px 16px",
                      borderBottom: "1px solid rgba(237,224,255,0.5)",
                      background: n.unread ? "rgba(192,128,208,0.06)" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(237,224,255,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {iconMap[n.icon]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500, color: "#3a1a58" }}>{n.title}</span>
                        {n.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c080d0", flexShrink: 0, marginTop: 4 }} />}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9a80b0", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: "#c0a8d0", marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(224,200,240,0.4)", textAlign: "center" }}>
                <button style={{ fontSize: 12, color: "#c080d0", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34,
          background: "linear-gradient(135deg, #c080d0, #e8a0c8)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: 12, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(192,128,208,0.4)", flexShrink: 0,
        }}>PR</div>
      </div>

      {notifOpen && <div onClick={() => setNotifOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />}
    </header>
  );
}
