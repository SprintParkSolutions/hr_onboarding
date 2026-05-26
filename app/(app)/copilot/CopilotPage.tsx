import "./CopilotPage.css";
import dynamic from "next/dynamic";

const CopilotChat = dynamic(() => import("./CopilotChat"), { ssr: false });

export default function CopilotPage() {
  return (
    <div className="copilot">
      <div className="page-header">
        <div>
          <h1 className="page-title">HR Copilot</h1>
          <p className="page-sub">Conversational AI grounded on your policy knowledge base and candidate corpus</p>
        </div>
        <span className="copilot-badge">● Live</span>
      </div>
      <CopilotChat />
    </div>
  );
}
