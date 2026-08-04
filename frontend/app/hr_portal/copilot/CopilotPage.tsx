"use client";
import "./CopilotPage.css";
import CopilotChat from "./CopilotChat";

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
