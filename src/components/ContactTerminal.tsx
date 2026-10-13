import { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Download, MessageSquare, Send, MapPin, Clock, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { content } from '../data/content';
import { TiltCard3D } from './TiltCard3D';

const playTactileClick = (freq = 900) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // audio context muted or restricted
  }
};

const TEMPLATES = [
  {
    id: 'interview',
    label: 'AI Engineer Role',
    subject: 'Interview Invitation: AI Engineer Role',
    message: 'Hi Mohit,\n\nWe were impressed by your production work on autonomous multi-agent pipelines and real-time LLM telemetry at Ubuy Technologies. We would love to schedule an introductory call to discuss our engineering roadmap and an AI Engineer role on our team.\n\nBest regards,'
  },
  {
    id: 'deepdive',
    label: 'Technical Discussion',
    subject: 'Technical Architecture Inquiry: Agent Systems',
    message: 'Hi Mohit,\n\nI reviewed your architecture case study on the Inventory Intel Agent with LangGraph and MCP protocol. I had a quick question regarding how you handled token throttling and recovery under high concurrency.\n\nBest,'
  },
  {
    id: 'collab',
    label: 'Open Collaboration',
    subject: 'Collaboration / Open Source Project',
    message: 'Hi Mohit,\n\nI noticed your work on Forge AI and automated code synthesis. We are working on related agentic tooling and wanted to explore a potential collaboration or knowledge exchange.\n\nCheers,'
  }
];

export const ContactTerminal = () => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [message, setMessage] = useState(TEMPLATES[0].message);
  const [activeTemplate, setActiveTemplate] = useState('interview');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const triggerSound = (freq = 900) => {
    if (soundEnabled) playTactileClick(freq);
  };

  const handleCopyEmail = () => {
    triggerSound(1100);
    navigator.clipboard.writeText(content.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectTemplate = (t: typeof TEMPLATES[0]) => {
    triggerSound(800);
    setActiveTemplate(t.id);
    setSubject(t.subject);
    setMessage(t.message);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSound(1200);
    const mailtoUrl = `mailto:${content.personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" style={{ 
      paddingTop: 'var(--space-16)', 
      paddingBottom: 'var(--space-20)',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div style={{ marginBottom: 'var(--space-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ 
            fontSize: '0.8125rem', 
            fontWeight: 600, 
            letterSpacing: '0.04em', 
            color: 'var(--accent-primary)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)'
          }}>
            04. Connect & Opportunities
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', margin: 0 }}>
            Let's engineer impactful systems together.
          </h2>
        </div>

        {/* Tactile Audio Switch */}
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playTactileClick(1000);
          }}
          className="filter-tab-button"
          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Toggle acoustic tactile feedback"
        >
          {soundEnabled ? <Volume2 size={14} color="var(--accent-primary)" /> : <VolumeX size={14} />}
          <span>{soundEnabled ? 'Acoustic Feedback: ON' : 'Acoustic Feedback: OFF'}</span>
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
        gap: 'var(--space-8)',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Direct Recruiter Actions & Availability */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TiltCard3D
            maxTilt={5}
            style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}
          >
            {/* Availability Status Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: 'var(--space-6)',
              transform: 'translateZ(20px)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-glow)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Actively Interviewing
                  </span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Targeting AI Engineer & Agentic Systems roles
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Clock size={13} />
                  <span>Notice Period</span>
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {content.personal.noticePeriod}
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', transform: 'translateZ(15px)' }}>
              {/* Copy Email Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {content.personal.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="filter-tab-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: copied ? 'var(--accent-soft)' : 'var(--bg-surface)',
                    color: copied ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                  aria-label="Copy email address"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Resume Download Action */}
              <a
                href={content.personal.resumeUrl}
                download="Mohit_Sharma_Resume.pdf"
                onClick={() => triggerSound(1000)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '0.875rem 1.25rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={18} />
                  <span>Download Updated Resume (PDF)</span>
                </span>
                <span style={{ fontSize: '0.8125rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>
                  PDF · Ready
                </span>
              </a>
            </div>

            {/* Verification & Footprint */}
            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)', transform: 'translateZ(10px)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
                Verified Profiles & Networks
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <a
                  href={content.personal.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => triggerSound(950)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
                >
                  <span>GitHub (@mohitvenom)</span>
                  <ExternalLink size={13} />
                </a>
                <a
                  href={content.personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => triggerSound(950)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                <MapPin size={14} />
                <span>Location: {content.personal.location} (Open to Remote & Relocation)</span>
              </div>
            </div>
          </TiltCard3D>
        </div>

        {/* Right Column: Pre-Configured Message Composer */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TiltCard3D
            maxTilt={5}
            style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)', transform: 'translateZ(20px)' }}>
              <MessageSquare size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Direct Outreach Console
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', transform: 'translateZ(15px)' }}>
              Select a quick prompt below or customize your message. Clicking "Launch Mail Client" opens your email client with pre-filled content.
            </p>

            {/* Quick Template Selector (Tactile Hardware Channel Buttons) */}
            <div style={{ marginBottom: 'var(--space-5)', transform: 'translateZ(18px)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="var(--accent-primary)" />
                <span>Preset Communication Templates</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`filter-tab-button ${activeTemplate === tmpl.id ? 'active' : ''}`}
                    style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flexGrow: 1, transform: 'translateZ(12px)' }}>
              <div>
                <label htmlFor="inquiry-subject" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Subject / Role Title
                </label>
                <input
                  id="inquiry-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="inquiry-message" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Message or Meeting Request
                </label>
                <textarea
                  id="inquiry-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.6,
                    minHeight: '140px',
                    flexGrow: 1,
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: 'var(--space-2)' }}
              >
                <Send size={16} />
                <span>Launch Email Client</span>
              </button>
            </form>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
};
