"use client";
import "./CopilotPage.css";
import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

const initialMessages = [
  { role: "assistant", text: "Hi Priya! I'm your HR Copilot. I can help you with candidate insights, policy questions, interview feedback, and more. What do you need?" },
  { role: "user", text: "What's the status of Sarah Mitchell's application?" },
  { role: "assistant", text: "Sarah Mitchell is currently shortlisted for Senior Backend Engineer. AI match score: 94%. She has 8 years of experience in Python, Kafka, and AWS. Her system design interview is scheduled for today at 2:30 PM with Arjun K. Feedback from the first round was very positive — communication score 9/10, technical depth 8/10." },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", text: input }, { role: "assistant", text: "I'm processing your request. In a live environment, I'd query the candidate corpus and live agent logs to give you a precise answer." }]);
    setInput("");
  }

  return (
    <div className="copilot">
      <div className="page-header">
        <div>
          <h1 className="page-title">HR Copilot</h1>
          <p className="page-sub">Conversational AI grounded on your policy knowledge base and candidate corpus</p>
        </div>
        <span className="copilot-badge">● Live</span>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role}`}>
              <div className="msg-avatar">
                {m.role === "assistant" ? <Bot size={16} color="white" /> : <User size={16} color="white" />}
              </div>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask about candidates, policies, schedules..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="send-btn" onClick={send}><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}

