"use client";
import "./ContactPage.css";
import Link from "next/link";
import { useState } from "react";
import {
  Bot, Mail, Phone, MapPin, Send, CheckCircle,
  Clock, MessageSquare, ArrowLeft, Linkedin, Twitter,
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    color: "#9B7485",
    bg: "rgba(155,116,133,0.1)",
    title: "Email us",
    detail: "hello@sprintpark.ai",
    sub: "We respond within 4 business hours",
  },
  {
    icon: Phone,
    color: "#E8806A",
    bg: "rgba(232,128,106,0.1)",
    title: "Call us",
    detail: "+91 98765 43210",
    sub: "Mon – Fri, 9 AM – 6 PM IST",
  },
  {
    icon: MapPin,
    color: "#8DB89A",
    bg: "rgba(141,184,154,0.1)",
    title: "Visit us",
    detail: "Bangalore, India",
    sub: "HSR Layout · by appointment",
  },
  {
    icon: Clock,
    color: "#7D5568",
    bg: "rgba(125,85,104,0.08)",
    title: "Support hours",
    detail: "9 AM – 6 PM IST",
    sub: "Monday through Friday",
  },
];

const reasons = [
  "Book a product demo",
  "Enterprise pricing",
  "Technical support",
  "Partnership enquiry",
  "Media / press",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", reason: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 1200);
  }

  return (
    <div className="cp-root">
      {/* Blobs */}
      <div className="cp-blob cp-blob-1" />
      <div className="cp-blob cp-blob-2" />

      {/* Nav */}
      <header className="cp-nav">
        <Link href="/landing" className="cp-logo">
          <div className="cp-logo-icon"><Bot size={18} color="white" /></div>
          <span className="cp-logo-text">SprintPark AI HR</span>
        </Link>
        <Link href="/landing" className="cp-back">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </header>

      <main className="cp-main">
        {/* Header */}
        <div className="cp-header">
          <div className="cp-header-badge">
            <MessageSquare size={13} color="#9B7485" />
            <span>Get in touch</span>
          </div>
          <h1 className="cp-h1">We'd love to hear from you</h1>
          <p className="cp-sub">
            Whether you want a product demo, have a question about pricing, or just want to say hello — our team is here and happy to help.
          </p>
        </div>

        {/* Contact method cards */}
        <div className="cp-methods">
          {contactMethods.map(m => (
            <div key={m.title} className="cp-method-card">
              <div className="cp-method-icon" style={{ background: m.bg }}>
                <m.icon size={18} color={m.color} />
              </div>
              <div className="cp-method-title">{m.title}</div>
              <div className="cp-method-detail" style={{ color: m.color }}>{m.detail}</div>
              <div className="cp-method-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Form + info */}
        <div className="cp-body">
          {/* Form */}
          <div className="cp-form-card">
            <h2 className="cp-form-title">Send us a message</h2>
            <p className="cp-form-sub">Fill in the form and we'll get back to you within one business day.</p>

            {sent ? (
              <div className="cp-success">
                <CheckCircle size={32} color="#8DB89A" />
                <div className="cp-success-title">Message sent!</div>
                <div className="cp-success-text">Thanks for reaching out. A member of our team will reply to {form.email} within one business day.</div>
                <button className="cp-btn-primary" onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", reason: "", message: "" }); }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="cp-form" onSubmit={handleSubmit} noValidate>
                <div className="cp-form-row">
                  <div className="cp-form-group">
                    <label className="cp-label">Your name *</label>
                    <input className="cp-input" placeholder="Priya Rajan" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="cp-form-group">
                    <label className="cp-label">Work email *</label>
                    <input className="cp-input" type="email" placeholder="priya@company.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="cp-form-row">
                  <div className="cp-form-group">
                    <label className="cp-label">Company</label>
                    <input className="cp-input" placeholder="Acme Inc." value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div className="cp-form-group">
                    <label className="cp-label">How can we help? *</label>
                    <select className="cp-input" required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
                      <option value="">Select a reason…</option>
                      {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="cp-form-group">
                  <label className="cp-label">Message *</label>
                  <textarea className="cp-textarea" rows={5} placeholder="Tell us a bit about your team, what you're looking for, and any questions you have…" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className={`cp-btn-primary ${loading ? "cp-btn-loading" : ""}`} disabled={loading}>
                  {loading ? <span className="cp-spinner" /> : <><Send size={14} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className="cp-side">
            <div className="cp-info-card">
              <h3 className="cp-info-title">Book a live demo</h3>
              <p className="cp-info-text">
                See SprintPark AI HR in action with a 30-minute personalised walkthrough. We'll show you how it fits your team's workflow.
              </p>
              <Link href="/login" className="cp-btn-outline">Book a demo →</Link>
            </div>

            <div className="cp-info-card">
              <h3 className="cp-info-title">Enterprise plans</h3>
              <p className="cp-info-text">
                Need custom integrations, SSO, dedicated support, or volume pricing? Our enterprise team will design a plan around your needs.
              </p>
              <a href="mailto:enterprise@sprintpark.ai" className="cp-btn-outline">Talk to sales →</a>
            </div>

            <div className="cp-social-card">
              <div className="cp-social-title">Follow us</div>
              <div className="cp-social-links">
                <a href="#" className="cp-social-link">
                  <Linkedin size={16} color="#9B7485" />
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="cp-social-link">
                  <Twitter size={16} color="#9B7485" />
                  <span>Twitter / X</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="cp-footer">
        <span>© 2026 SprintPark Technologies · <Link href="/landing" style={{ color: "#9B7485" }}>Home</Link> · <Link href="/login" style={{ color: "#9B7485" }}>Sign in</Link></span>
      </footer>
    </div>
  );
}
