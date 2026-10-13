import { useState } from 'react';
import { m } from 'motion/react';
import { content } from '../data/content';
import { scrollTo } from '../utils/lenis';
import { ArrowDown, Download, ExternalLink, GitBranch, Layers, ShieldCheck, CheckCircle2, Box } from 'lucide-react';
import { ThreeAgentTopology } from './ThreeAgentTopology';

export const Hero = () => {
  const [heroViewMode, setHeroViewMode] = useState<'3d' | 'spec'>('3d');
  const [activeSpecimenTab, setActiveSpecimenTab] = useState<'graph' | 'mcp' | 'hardening'>('graph');

  return (
    <section id="hero" style={{ 
      position: 'relative', 
      paddingTop: 'var(--space-12)',
      paddingBottom: 'var(--space-16)',
    }}>
      {/* Split-Screen Hero Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--space-12)',
        alignItems: 'center',
        marginBottom: 'var(--space-16)'
      }}>
        {/* Left Column: Typographic Authority & Value Proposition */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Quiet Unboxed Kicker */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '0.875rem',
            color: 'var(--accent-primary)',
            fontWeight: 600,
            marginBottom: 'var(--space-4)'
          }}>
            <span>AI Engineer</span>
            <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">·</span>
            <span>Autonomous Systems & LLM Pipelines</span>
          </div>

          {/* Headline */}
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.85rem)', 
            lineHeight: 1.1, 
            letterSpacing: '-0.03em',
            marginBottom: 'var(--space-6)',
            color: 'var(--text-primary)'
          }}>
            Building autonomous systems that execute, reason & adapt.
          </h1>

          {/* Lead Paragraph */}
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
            maxWidth: '560px'
          }}>
            AI Engineer at <strong>Ubuy Technologies</strong>. Specializing in multi-marketplace intelligence engines, Model Context Protocol (MCP) tool servers, sandboxed code-synthesis runtimes, and low-latency retrieval pipelines.
          </p>

          {/* Primary Action Controls */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 'var(--space-4)', 
            alignItems: 'center',
            marginBottom: 'var(--space-8)'
          }}>
            <button 
              className="btn-primary"
              onClick={() => scrollTo('#projects', { offset: -80 })}
            >
              <span>Explore Selected Work</span>
              <ArrowDown size={16} />
            </button>
            <a 
              href={content.personal.resumeUrl} 
              download="Mohit_Sharma_Resume.pdf"
              className="btn-secondary"
            >
              <Download size={16} />
              <span>Download Resume</span>
            </a>
          </div>

          {/* Quick Credential Links */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.25rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}>
            <a 
              href={content.personal.github} 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}
              className="hover-accent"
            >
              <span>GitHub</span>
              <ExternalLink size={13} />
            </a>
            <span aria-hidden="true">·</span>
            <a 
              href={content.personal.linkedin} 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}
              className="hover-accent"
            >
              <span>LinkedIn</span>
              <ExternalLink size={13} />
            </a>
            <span aria-hidden="true">·</span>
            <span>Jaipur, India · Open to full-time roles</span>
          </div>
        </m.div>

        {/* Right Column: 3D Autonomous Agent Specimen */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <div className="filter-segmented-bar" style={{ padding: '3px' }}>
              <button
                type="button"
                onClick={() => setHeroViewMode('3d')}
                className={`filter-tab-button ${heroViewMode === '3d' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Box size={13} />
                <span>3D Agent Mesh</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroViewMode('spec')}
                className={`filter-tab-button ${heroViewMode === 'spec' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <GitBranch size={13} />
                <span>Protocol Breakdown</span>
              </button>
            </div>
          </div>

          {heroViewMode === '3d' ? (
            <ThreeAgentTopology />
          ) : (
            <m.div
              id="specimen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="architectural-card"
              style={{
                padding: 'var(--space-6)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-overlay)',
              }}
            >
          {/* Card Top Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                LIVE ARCHITECTURAL SPECIMEN
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              v1.4 / Production
            </span>
          </div>

          {/* Interactive Specimen Tabs */}
          <div className="filter-segmented-bar" style={{ width: '100%', marginBottom: 'var(--space-5)' }}>
            <button
              onClick={() => setActiveSpecimenTab('graph')}
              className={`filter-tab-button ${activeSpecimenTab === 'graph' ? 'active' : ''}`}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <GitBranch size={14} />
              <span>LangGraph State</span>
            </button>
            <button
              onClick={() => setActiveSpecimenTab('mcp')}
              className={`filter-tab-button ${activeSpecimenTab === 'mcp' ? 'active' : ''}`}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Layers size={14} />
              <span>MCP Protocol</span>
            </button>
            <button
              onClick={() => setActiveSpecimenTab('hardening')}
              className={`filter-tab-button ${activeSpecimenTab === 'hardening' ? 'active' : ''}`}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <ShieldCheck size={14} />
              <span>Hardening</span>
            </button>
          </div>

          {/* Tab 1: State Machine Pipeline */}
          {activeSpecimenTab === 'graph' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Autonomous state transitions executed by Inventory Intel Agent:
              </div>

              {[
                { stage: '1. Cron Trigger', desc: 'APScheduler initiates marketplace scan job' },
                { stage: '2. LangGraph Router', desc: 'Orchestrates tool invocation based on target vendor spec' },
                { stage: '3. MCP Scraper Service', desc: 'Standardized tool call to Amazon / Ubuy / eBay parsers' },
                { stage: '4. Diff & Checkpoint', desc: 'PostgreSQL historical delta check (price drop, stockout)' },
                { stage: '5. Dispatcher', desc: 'Slack webhook notifications + Next.js dashboard stream' }
              ].map((step, idx) => (
                <div 
                  key={step.stage}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: idx === 2 ? 'var(--accent-soft)' : 'var(--bg-surface-elevated)',
                    border: idx === 2 ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: idx === 2 ? 'var(--accent-primary)' : 'var(--text-muted)',
                    minWidth: '18px'
                  }}>
                    0{idx + 1}
                  </span>
                  <div>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: 600, 
                      color: idx === 2 ? 'var(--accent-primary)' : 'var(--text-primary)' 
                    }}>
                      {step.stage}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: MCP Tool Protocol */}
          {activeSpecimenTab === 'mcp' && (
            <div style={{ 
              background: 'var(--bg-canvas)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              overflowX: 'auto'
            }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                // Model Context Protocol (MCP) Tool Declaration
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`@mcp.tool()
async def scrape_marketplace_item(
    url: str, 
    marketplace: Literal["amazon", "ubuy", "ebay"]
) -> ProductTelemetry:
    """Standardized tool contract decoupled from LangGraph"""
    session = await get_anti_detection_session()
    raw_payload = await fetch_vendor_dom(session, url)
    return parse_structured_pricing(raw_payload)`}</pre>
            </div>
          )}

          {/* Tab 3: Engineering Hardening */}
          {activeSpecimenTab === 'hardening' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-surface-elevated)', 
                border: '1px solid var(--border-subtle)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Token Budget Runaway Mitigation</span>
                </div>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-secondary)' }}>
                  Patched coding agent state-transition leak that previously consumed 2–3K tokens per cycle without transitioning from Implementing to Validating.
                </p>
              </div>

              <div style={{ 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-surface-elevated)', 
                border: '1px solid var(--border-subtle)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Coverage-Weighted Semantic Scoring</span>
                </div>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-secondary)' }}>
                  Replaced raw cosine max() pooling with entity coverage penalty, preventing 300-word low-effort snippets from out-scoring comprehensive 2,000-word guides.
                </p>
              </div>
            </div>
          )}

          {/* Card Footer */}
          <div style={{ 
            marginTop: 'var(--space-5)', 
            paddingTop: 'var(--space-3)', 
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span>Focus: LangGraph · MCP Python SDK · FastAPI</span>
            <a 
              href="#projects" 
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#projects', { offset: -80 });
              }}
              style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              View System Specs →
            </a>
          </div>
        </m.div>
      )}
    </div>
  </div>

      {/* Full-Width Claim-to-Proof Metric Strip (Portfolio Reference Rule: Section 2.B) */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          padding: 'var(--space-6)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        <div>
          <div className="font-tabular" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1.1 }}>
            3
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Live Marketplaces Tracked
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Amazon, Ubuy & eBay via MCP scraper tools
          </div>
        </div>

        <div>
          <div className="font-tabular" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1.1 }}>
            75%
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Decision Logic Test Coverage
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Hardened with comprehensive Pytest suites
          </div>
        </div>

        <div>
          <div className="font-tabular" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1.1 }}>
            65%
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            LLM Inference Cost Reduction
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Via cascading BM25 + bi-encoder filtering
          </div>
        </div>

        <div>
          <div className="font-tabular" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1.1 }}>
            850ms
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Async Pipeline Latency
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Reduced down from 4.8s synchronous baseline
          </div>
        </div>
      </m.div>
    </section>
  );
};
