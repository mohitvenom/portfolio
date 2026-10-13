import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  FileText, 
  Building2, 
  GraduationCap, 
  Cpu, 
  CheckCircle2, 
  Award,
  Layers,
  MapPin,
  Mail
} from 'lucide-react';
import { content } from '../data/content';

const GithubIcon = ({ size = 14, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'projects' | 'skills' | 'education'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyPlainText = async () => {
    const plainTextResume = `
MOHIT SHARMA
AI Engineer · Autonomous Systems & LLM Pipelines
Email: ${content.personal.email}
Location: ${content.personal.location}
GitHub: ${content.personal.github}
LinkedIn: ${content.personal.linkedin}
Notice Period: ${content.personal.noticePeriod}

SUMMARY:
${content.personal.supportingDescription}
Specializing in Model Context Protocol (MCP), LangGraph orchestration, autonomous multi-agent systems, and scalable backend pipelines.

KEY METRICS & PRODUCTION IMPACT:
- Built autonomous marketplace inventory monitoring agent tracking 7 products across 3 live marketplaces with 75% test coverage.
- Designed two-stage RAG research & rewrite engine dropping latency from 4.8s to 850ms and cutting inference costs by 65%.
- Implemented ForgeAI sandboxed plan-code-test-review engine automating Git checkpointing and PR generation.

EXPERIENCE:
Ubuy Technologies - AI Engineer (Jan 2026 – Present)
Embedded in digital marketing & automation team. Built enterprise content generation systems, automated keyword auditing, and webmaster workflows.

Ubuy Technologies - AI Intern (Sept 2025 – Dec 2025)
Engineered scraping architectures, API connectors, and automation utilities.

TECHNICAL SKILLS:
- AI & Agents: LangGraph, Model Context Protocol (MCP), LLMs, OpenAI API, Prompt Engineering, Agentic Workflows
- Backend & Data: Python, FastAPI, Pydantic, PostgreSQL, SQLAlchemy, Alembic, Flask, Pandas, MySQL
- Automation: Playwright, Selenium, BeautifulSoup, Cloudscraper, Chrome Extensions
- Engineering & Infra: Docker, Docker Compose, Pytest, Git/GitHub API, Linux, Next.js

FLAGSHIP PROJECTS:
1. Inventory Intel Agent: Autonomous price & stock tracker using LangGraph, MCP Python SDK, PostgreSQL, Slack alerting.
2. ForgeAI: Autonomous software engineering agent converting natural language to validated pull requests with Docker sandboxing.
3. Content Generation Tool: Cascading two-stage retrieval and rewrite pipeline (BM25 + Cross-Encoder + GPT-4o-mini).

EDUCATION:
B.Tech in Computer Science & Engineering (2022 – 2026)
University of Engineering and Management, Jaipur
CGPA: 8.69 / 10.0
Certifications: Python for Data Science (NPTEL), Database Management Systems (NPTEL), Deep Learning (Infosys)
    `.trim();

    try {
      await navigator.clipboard.writeText(plainTextResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 7, 10, 0.8)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Slide-over Drawer Panel */}
          <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '820px',
              height: '100%',
              background: 'var(--bg-canvas)',
              borderLeft: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-overlay)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 121,
              overflow: 'hidden'
            }}
          >
            {/* Header Control Bar */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Curriculum Vitae
                    </h2>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        background: 'var(--accent-soft)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      ATS-OPTIMIZED
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Mohit Sharma · Updated 2026
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyPlainText}
                  title="Copy ATS-friendly text format"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: copied ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-muted)',
                    border: copied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                    color: copied ? '#10b981' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied ATS Text' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print resume"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>

                <a
                  href={content.personal.resumeUrl}
                  download="Mohit_Sharma_Resume.pdf"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-primary)',
                    color: '#090b10',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <Download size={14} />
                  <span>PDF Download</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume drawer"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Section Filter Bar */}
            <div
              style={{
                padding: '8px 24px',
                background: 'var(--bg-muted)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                flexShrink: 0
              }}
            >
              {[
                { id: 'all', label: 'Complete Resume' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Key Systems' },
                { id: 'skills', label: 'Skills & Stack' },
                { id: 'education', label: 'Education & Certs' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: activeTab === tab.id ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    border: activeTab === tab.id ? '1px solid var(--border-medium)' : '1px solid transparent',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Resume Content Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '28px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
              }}
            >
              {/* Header Contact Block */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0 }}>
                      Mohit Sharma
                    </h1>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '4px' }}>
                      AI Engineer · Autonomous Systems & LLM Pipelines
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      color: '#10b981',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    <span>Open to Work · 2–4 Wk Notice</span>
                  </div>
                </div>

                {/* Metadata row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '14px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="var(--accent-primary)" />
                    {content.personal.location}
                  </span>
                  <span style={{ color: 'var(--border-medium)' }}>·</span>
                  <a href={`mailto:${content.personal.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <Mail size={14} color="var(--accent-primary)" />
                    {content.personal.email}
                  </a>
                  <span style={{ color: 'var(--border-medium)' }}>·</span>
                  <a href={content.personal.github} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <GithubIcon size={14} color="var(--accent-primary)" />
                    github.com/mohitvenom
                  </a>
                  <span style={{ color: 'var(--border-medium)' }}>·</span>
                  <a href={content.personal.linkedin} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <LinkedinIcon size={14} color="var(--accent-primary)" />
                    LinkedIn
                  </a>
                </div>

                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '14px', marginBottom: 0 }}>
                  {content.personal.supportingDescription} Architect of production-ready LangGraph orchestrations, MCP servers, and self-correcting agent sandboxes that convert complex natural-language business processes into deterministic, resilient software execution.
                </p>
              </div>

              {/* Quantified Production Metrics Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    7
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    Marketplace Products Live
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    75%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    Core Test Coverage
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    850ms
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    Batch Pipeline Latency
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    65%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    Inference Cost Cut
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    6+
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    Hardened Edge Cases
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              {(activeTab === 'all' || activeTab === 'experience') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Building2 size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Professional Experience
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Role 1 */}
                    <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                        <div>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            AI Engineer
                          </span>
                          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>·</span>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Ubuy Technologies
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                          Jan 2026 – Present
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '4px 0 10px 0' }}>
                        Digital Marketing & Automation Team · Jaipur, India
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        <li>Architected and deployed enterprise content research and generation pipelines utilizing two-stage cascading retrieval (BM25 + bi-encoder/cross-encoder re-ranking) with asynchronous batching.</li>
                        <li>Reduced full-document evaluation latency from 4.8s to 850ms while slashing model inference costs by 65%.</li>
                        <li>Built backend automation for Google Ads Search Terms Reports, automating negative keyword identification and saving 5–6 weekly manual auditing hours.</li>
                        <li>Engineered research dashboards unifying SerpAPI, Rainforest API, and Search Console data streams.</li>
                      </ul>
                    </div>

                    {/* Role 2 */}
                    <div style={{ borderLeft: '2px solid var(--border-medium)', paddingLeft: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                        <div>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            AI Intern
                          </span>
                          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>·</span>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Ubuy Technologies
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          Sept 2025 – Dec 2025
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '4px 0 10px 0' }}>
                        Digital Marketing Team · Jaipur, India
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        <li>Developed high-throughput headless scrapers and stock-status validation crawlers using Playwright and BeautifulSoup.</li>
                        <li>Automated multi-engine webmaster indexing submissions across Google and Bing.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Systems & Flagship Projects */}
              {(activeTab === 'all' || activeTab === 'projects') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Layers size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Featured Systems & Architectures
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Project 1 */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Inventory Intel Agent
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                            LangGraph · Model Context Protocol (MCP) · PostgreSQL · FastAPI · Docker
                          </div>
                        </div>
                        <a
                          href="https://github.com/mohitvenom/inventory_intel_engine"
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <span>Repository</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '8px' }}>
                        Autonomous agent monitoring marketplace price drops and stockouts across Amazon, Ubuy, and eBay. Built with the official MCP Python SDK to decouple tool providers from orchestrators, achieving 75% test coverage and resolving anti-bot constraints systematically.
                      </p>
                    </div>

                    {/* Project 2 */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            ForgeAI — Autonomous Engineering Agent
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                            Python · FastAPI · Docker Sandbox · GitHub API · Pytest
                          </div>
                        </div>
                        <a
                          href="https://github.com/mohitvenom/SWA_task"
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <span>Repository</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '8px' }}>
                        Sandboxed software engineering agent that parses natural language issues, drafts plans, writes code in an isolated container, executes test suites, and generates validated GitHub Pull Requests. Features safe-path enforcement and execution budget watchdog.
                      </p>
                    </div>

                    {/* Project 3 */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Two-Stage Content Generation Engine
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                            GPT-4o-mini · BM25 · Cross-Encoder Re-Ranking · SerpAPI · Async Batching
                          </div>
                        </div>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          PROPRIETARY (UBUY)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '8px' }}>
                        Researches and drafts SEO content by aggregating SERP, Reddit, and YouTube data. Solved topic coverage skew by combining entity-coverage thresholds with coverage-weighted mean scoring, improving relevancy scores by 28%.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Technical Matrix */}
              {(activeTab === 'all' || activeTab === 'skills') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Cpu size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Technical Skills & Competencies
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {content.skills.map((cluster, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px'
                        }}
                      >
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '8px' }}>
                          {cluster.category}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {cluster.items.map((item, j) => (
                            <span
                              key={j}
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-muted)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Certifications */}
              {(activeTab === 'all' || activeTab === 'education') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <GraduationCap size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Education & Credentials
                    </h3>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          B.Tech in Computer Science and Engineering
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          University of Engineering and Management, Jaipur
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                          CGPA: 8.69 / 10.0
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          2022 – 2026
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Verified Technical Certifications:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle2 size={13} color="var(--accent-primary)" />
                          Python for Data Science (NPTEL)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle2 size={13} color="var(--accent-primary)" />
                          Database Management Systems (NPTEL)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle2 size={13} color="var(--accent-primary)" />
                          Deep Learning (Infosys Springboard)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div style={{ marginTop: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      <Award size={15} color="var(--accent-primary)" />
                      <span>Competitive Programming & Milestones</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                      {content.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Action Bar */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>Ready for immediate deployment · Remote / On-Site</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a
                  href={`mailto:${content.personal.email}?subject=Interview%20Invitation%20-%20Mohit%20Sharma`}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Contact Candidate →
                </a>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
