import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { InterviewStoreProvider } from "@/lib/interviewStore";

export default function ManagerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <InterviewStoreProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar />
          <main style={{ flex: 1, padding: "clamp(16px, 3vw, 28px) clamp(12px, 3vw, 32px)", overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </InterviewStoreProvider>
  );
}
