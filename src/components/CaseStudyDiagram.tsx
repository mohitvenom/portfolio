import { useState } from 'react';
import { Database, Zap, Cpu, Bell, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudyDiagramProps {
  id: string;
}

interface FlowStep {
  from: string;
  to: string;
  label: string;
  protocol: string;
}

interface NodeDetail {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  badge: string;
  icon: any;
  color: string;
  details: string;
}

export const CaseStudyDiagram = ({ id }: CaseStudyDiagramProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'steps'>('flow');

  const renderToolbar = (stepCount?: number) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
        <span>Directional Data Flow Topology</span>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-muted)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={() => setViewMode('flow')}
          style={{
            background: viewMode === 'flow' ? 'var(--bg-surface)' : 'transparent',
            color: viewMode === 'flow' ? 'var(--text-primary)' : 'var(--text-muted)',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Directional Flow
        </button>
        <button
          type="button"
          onClick={() => setViewMode('steps')}
          style={{
            background: viewMode === 'steps' ? 'var(--bg-surface)' : 'transparent',
            color: viewMode === 'steps' ? 'var(--text-primary)' : 'var(--text-muted)',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Execution Steps {stepCount ? `(${stepCount})` : ''}
        </button>
      </div>
    </div>
  );

  // Specific diagrams per project
  if (id === 'inventory-intel-agent') {
    const nodes: NodeDetail[] = [
      {
        id: 'scheduler',
        title: 'APScheduler',
        subtitle: 'Cron Ingestion Loop',
        tech: 'Python / AsyncIO',
        badge: 'Trigger',
        icon: Zap,
        color: '#f59e0b',
        details: 'Triggers multi-marketplace scrapers at scheduled intervals (Amazon, Ubuy, eBay). Handles jitter & rate limiting.'
      },
      {
        id: 'langgraph',
        title: 'LangGraph Engine',
        subtitle: 'StateGraph Orchestrator',
        tech: 'LangGraph / gpt-4o-mini',
        badge: 'Decision Core',
        icon: Cpu,
        color: '#f59e0b',
        details: 'Evaluates price changes against threshold policies, manages cyclic state machine, and summarizes delta runs.'
      },
      {
        id: 'mcp-server',
        title: 'MCP Protocol Server',
        subtitle: 'Standardized Tool Host',
        tech: 'MCP Python SDK',
        badge: 'Tool Router',
        icon: Layers,
        color: '#38bdf8',
        details: 'Exposes decoupled scraper tools & DB tools over Model Context Protocol; allows client-agnostic reuse.'
      },
      {
        id: 'postgres',
        title: 'PostgreSQL Store',
        subtitle: 'Time-Series Prices & Stock',
        tech: 'SQLAlchemy / Alembic',
        badge: 'Persistence',
        icon: Database,
        color: '#a78bfa',
        details: 'ACID storage of raw price histories, SKU snapshots, and scraper run health checks.'
      },
      {
        id: 'alerts',
        title: 'Alerts & Dashboard',
        subtitle: 'Slack + Next.js App',
        tech: 'Webhooks / Next.js 14',
        badge: 'Output Sink',
        icon: Bell,
        color: '#34d399',
        details: 'Instant alerts on price drops, restocks & stockouts to Slack channels, plus real-time operator UI.'
      }
    ];

    const steps: FlowStep[] = [
      { from: 'APScheduler', to: 'LangGraph', label: '1. Cron tick initiates run for 7 monitored SKUs', protocol: 'In-Memory Async' },
      { from: 'LangGraph', to: 'MCP Server', label: '2. Dispatches scrape tool calls via MCP protocol', protocol: 'JSON-RPC 2.0 / MCP' },
      { from: 'MCP Server', to: 'PostgreSQL', label: '3. Writes normalized price & inventory records', protocol: 'SQLAlchemy ACID' },
      { from: 'LangGraph', to: 'Alerts & Dashboard', label: '4. Dispatches Slack alert on price delta / stock change', protocol: 'HTTPS Webhook / REST' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {renderToolbar(steps.length)}

        {viewMode === 'steps' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {steps.map((step, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-soft)', 
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {step.from} <ArrowRight size={11} style={{ display: 'inline', margin: '0 2px' }} /> {step.to}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                  {step.protocol}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* SVG Flow Diagram with Explicit Directional Arrows */
          <div style={{ width: '100%', overflowX: 'auto', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
            <svg 
              viewBox="0 0 880 270" 
              style={{ width: '100%', minWidth: '760px', height: 'auto', display: 'block' }}
              aria-label="Architecture Data Flow: Scheduler feeds LangGraph via cron ticks, LangGraph calls MCP tools via JSON-RPC, MCP stores records in PostgreSQL, LangGraph pushes alerts to Slack and Next.js"
            >
              <defs>
                {/* Directional Arrowheads */}
                <marker id="arrow-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
                <marker id="arrow-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
                </marker>
                <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a78bfa" />
                </marker>

                <linearGradient id="stream-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>

                <style>{`
                  @keyframes flowDash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .flow-arrow-active {
                    stroke-dasharray: 6, 6;
                    animation: flowDash 1.2s linear infinite;
                  }
                `}</style>
              </defs>

              {/* Grid Background Lines for Architectural Feel */}
              <g stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1">
                <line x1="0" y1="67" x2="880" y2="67" />
                <line x1="0" y1="135" x2="880" y2="135" />
                <line x1="0" y1="202" x2="880" y2="202" />
                <line x1="175" y1="0" x2="175" y2="270" />
                <line x1="350" y1="0" x2="350" y2="270" />
                <line x1="530" y1="0" x2="530" y2="270" />
                <line x1="710" y1="0" x2="710" y2="270" />
              </g>

              {/* FLOW 1: Scheduler -> LangGraph */}
              <g>
                <path 
                  d="M 145 135 L 210 135" 
                  stroke="#f59e0b" 
                  strokeWidth="2.5" 
                  fill="none" 
                  markerEnd="url(#arrow-amber)" 
                  className="flow-arrow-active"
                />
                <rect x="150" y="115" width="55" height="18" rx="4" fill="#181d28" stroke="rgba(245, 158, 11, 0.3)" />
                <text x="177" y="128" fill="#f59e0b" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
                  Trigger →
                </text>
              </g>

              {/* FLOW 2: LangGraph -> MCP Server */}
              <g>
                <path 
                  d="M 365 135 L 430 135" 
                  stroke="#38bdf8" 
                  strokeWidth="2.5" 
                  fill="none" 
                  markerEnd="url(#arrow-cyan)" 
                  className="flow-arrow-active"
                />
                <rect x="368" y="115" width="62" height="18" rx="4" fill="#181d28" stroke="rgba(56, 189, 248, 0.3)" />
                <text x="399" y="128" fill="#38bdf8" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
                  JSON-RPC →
                </text>
              </g>

              {/* FLOW 3: MCP Server -> PostgreSQL (Branch Top-Right) */}
              <g>
                <path 
                  d="M 585 110 C 635 110, 645 70, 695 70" 
                  stroke="#a78bfa" 
                  strokeWidth="2.5" 
                  fill="none" 
                  markerEnd="url(#arrow-purple)" 
                  className="flow-arrow-active"
                />
                <rect x="612" y="65" width="65" height="18" rx="4" fill="#181d28" stroke="rgba(167, 139, 250, 0.3)" />
                <text x="644" y="78" fill="#a78bfa" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
                  DB Write →
                </text>
              </g>

              {/* FLOW 4: LangGraph -> Slack / Dashboard (Branch Bottom-Right) */}
              <g>
                <path 
                  d="M 585 160 C 635 160, 645 200, 695 200" 
                  stroke="#34d399" 
                  strokeWidth="2.5" 
                  fill="none" 
                  markerEnd="url(#arrow-emerald)" 
                  className="flow-arrow-active"
                />
                <rect x="608" y="185" width="68" height="18" rx="4" fill="#181d28" stroke="rgba(52, 211, 153, 0.3)" />
                <text x="642" y="198" fill="#34d399" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
                  Alert Webhook →
                </text>
              </g>

              {/* NODE 1: Scheduler */}
              <g 
                onClick={() => setSelectedNode('scheduler')} 
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="15" 
                  y="95" 
                  width="130" 
                  height="80" 
                  rx="8" 
                  fill="#11141c" 
                  stroke={selectedNode === 'scheduler' ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)'} 
                  strokeWidth={selectedNode === 'scheduler' ? '2' : '1'} 
                />
                <rect x="25" y="105" width="50" height="14" rx="3" fill="rgba(245, 158, 11, 0.15)" />
                <text x="50" y="115" fill="#f59e0b" fontSize="7.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">TRIGGER</text>
                <text x="25" y="137" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">Scheduler</text>
                <text x="25" y="152" fill="#94a3b8" fontSize="10" fontFamily="var(--font-sans)">Hourly Cron Loop</text>
                <text x="25" y="165" fill="#f59e0b" fontSize="9" fontFamily="var(--font-mono)">APScheduler</text>
              </g>

              {/* NODE 2: LangGraph Orchestrator */}
              <g 
                onClick={() => setSelectedNode('langgraph')} 
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="215" 
                  y="85" 
                  width="150" 
                  height="100" 
                  rx="8" 
                  fill="#181d28" 
                  stroke={selectedNode === 'langgraph' ? '#f59e0b' : '#f59e0b'} 
                  strokeWidth="2" 
                />
                <rect x="225" y="97" width="75" height="16" rx="3" fill="rgba(245, 158, 11, 0.25)" />
                <text x="262" y="109" fill="#f59e0b" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">DECISION CORE</text>
                <text x="225" y="132" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="var(--font-sans)">LangGraph</text>
                <text x="225" y="148" fill="#cbd5e1" fontSize="10" fontFamily="var(--font-sans)">Cyclic Graph Agent</text>
                <text x="225" y="162" fill="#94a3b8" fontSize="9.5" fontFamily="var(--font-sans)">Delta & Stockout Evaluator</text>
                <text x="225" y="176" fill="#f59e0b" fontSize="9" fontFamily="var(--font-mono)">gpt-4o-mini summarizer</text>
              </g>

              {/* NODE 3: MCP Server */}
              <g 
                onClick={() => setSelectedNode('mcp-server')} 
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="435" 
                  y="85" 
                  width="150" 
                  height="100" 
                  rx="8" 
                  fill="#11141c" 
                  stroke={selectedNode === 'mcp-server' ? '#38bdf8' : 'rgba(56, 189, 248, 0.5)'} 
                  strokeWidth={selectedNode === 'mcp-server' ? '2' : '1.5'} 
                />
                <rect x="445" y="97" width="80" height="16" rx="3" fill="rgba(56, 189, 248, 0.2)" />
                <text x="485" y="109" fill="#38bdf8" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">TOOL PROTOCOL</text>
                <text x="445" y="132" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="var(--font-sans)">MCP Server</text>
                <text x="445" y="148" fill="#94a3b8" fontSize="10" fontFamily="var(--font-sans)">Decoupled Tool Host</text>
                <text x="445" y="162" fill="#cbd5e1" fontSize="9" fontFamily="var(--font-mono)">Amazon/Ubuy/eBay Scrapers</text>
                <text x="445" y="176" fill="#38bdf8" fontSize="9" fontFamily="var(--font-mono)">MCP Python SDK</text>
              </g>

              {/* NODE 4: PostgreSQL */}
              <g 
                onClick={() => setSelectedNode('postgres')} 
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="700" 
                  y="25" 
                  width="165" 
                  height="85" 
                  rx="8" 
                  fill="#11141c" 
                  stroke={selectedNode === 'postgres' ? '#a78bfa' : 'rgba(167, 139, 250, 0.4)'} 
                  strokeWidth={selectedNode === 'postgres' ? '2' : '1'} 
                />
                <rect x="710" y="37" width="70" height="16" rx="3" fill="rgba(167, 139, 250, 0.2)" />
                <text x="745" y="49" fill="#a78bfa" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">PERSISTENCE</text>
                <text x="710" y="72" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">PostgreSQL</text>
                <text x="710" y="87" fill="#94a3b8" fontSize="10" fontFamily="var(--font-sans)">Time-series Price History</text>
                <text x="710" y="100" fill="#a78bfa" fontSize="9" fontFamily="var(--font-mono)">SQLAlchemy / Alembic</text>
              </g>

              {/* NODE 5: Slack + Next.js */}
              <g 
                onClick={() => setSelectedNode('alerts')} 
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="700" 
                  y="155" 
                  width="165" 
                  height="85" 
                  rx="8" 
                  fill="#11141c" 
                  stroke={selectedNode === 'alerts' ? '#34d399' : 'rgba(52, 211, 153, 0.4)'} 
                  strokeWidth={selectedNode === 'alerts' ? '2' : '1'} 
                />
                <rect x="710" y="167" width="80" height="16" rx="3" fill="rgba(52, 211, 153, 0.2)" />
                <text x="750" y="179" fill="#34d399" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">DISPATCH & UI</text>
                <text x="710" y="202" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)">Slack & Next.js</text>
                <text x="710" y="217" fill="#94a3b8" fontSize="10" fontFamily="var(--font-sans)">Webhook Alerts & Dashboard</text>
                <text x="710" y="230" fill="#34d399" fontSize="9" fontFamily="var(--font-mono)">Instant Notification Sink</text>
              </g>
            </svg>
          </div>
        )}

        {/* Selected Node Spec Inspector */}
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <span>
            {selectedNode 
              ? nodes.find(n => n.id === selectedNode)?.details 
              : "Flow Direction: Arrows indicate active runtime data flow and tool calls across protocol boundaries. Click any component above to inspect implementation specs."}
          </span>
        </div>
      </div>
    );
  }

  if (id === 'forge-ai') {
    const steps: FlowStep[] = [
      { from: 'Task Spec', to: 'Planner Agent', label: '1. Ingests natural language issue or user prompt', protocol: 'REST / SSE' },
      { from: 'Planner Agent', to: 'Sandbox Executor', label: '2. Decomposes into DAG implementation steps', protocol: 'Pydantic Strict Schema' },
      { from: 'Sandbox Executor', to: 'Pytest Suite', label: '3. Runs code edits in Docker execution sandbox', protocol: 'Container Isolation' },
      { from: 'Pytest Suite', to: 'GitHub PR Checkpoint', label: '4. Verifies 22/22 tests pass then pushes PR', protocol: 'GitHub REST API' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {renderToolbar(steps.length)}

        {viewMode === 'steps' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {steps.map((step, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-soft)', 
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {step.from} <ArrowRight size={11} style={{ display: 'inline', margin: '0 2px' }} /> {step.to}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                  {step.protocol}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
            <svg 
              viewBox="0 0 880 200" 
              style={{ width: '100%', minWidth: '760px', height: 'auto', display: 'block' }}
              aria-label="ForgeAI Flow: Task input feeds Planner, Planner feeds Sandbox Executor, Sandbox feeds Test Layer, Test Layer triggers PR creation"
            >
              <defs>
                <marker id="arrow-forge-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-forge-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
                <marker id="arrow-forge-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
                </marker>
                <style>{`
                  @keyframes forgeDash {
                    to { stroke-dashoffset: -20; }
                  }
                  .forge-arrow {
                    stroke-dasharray: 6, 6;
                    animation: forgeDash 1.2s linear infinite;
                  }
                `}</style>
              </defs>

              {/* Flow Arrows with Explicit Arrowheads */}
              {/* Task -> Planner */}
              <g>
                <path d="M 125 100 L 195 100" stroke="#f59e0b" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-forge-amber)" className="forge-arrow" />
                <rect x="135" y="80" width="50" height="18" rx="4" fill="#181d28" stroke="rgba(245, 158, 11, 0.3)" />
                <text x="160" y="93" fill="#f59e0b" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">Prompt →</text>
              </g>

              {/* Planner -> Sandbox */}
              <g>
                <path d="M 345 100 L 415 100" stroke="#38bdf8" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-forge-cyan)" className="forge-arrow" />
                <rect x="355" y="80" width="50" height="18" rx="4" fill="#181d28" stroke="rgba(56, 189, 248, 0.3)" />
                <text x="380" y="93" fill="#38bdf8" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">Plan DAG →</text>
              </g>

              {/* Sandbox -> Test Layer */}
              <g>
                <path d="M 565 100 L 635 100" stroke="#38bdf8" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-forge-cyan)" className="forge-arrow" />
                <rect x="575" y="80" width="50" height="18" rx="4" fill="#181d28" stroke="rgba(56, 189, 248, 0.3)" />
                <text x="600" y="93" fill="#38bdf8" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">Code Diff →</text>
              </g>

              {/* Test Layer -> GitHub PR */}
              <g>
                <path d="M 765 100 L 805 100" stroke="#34d399" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-forge-emerald)" className="forge-arrow" />
              </g>

              {/* NODES */}
              {/* Task Node */}
              <g>
                <rect x="15" y="55" width="110" height="90" rx="8" fill="#11141c" stroke="rgba(255, 255, 255, 0.1)" />
                <rect x="25" y="65" width="45" height="15" rx="3" fill="rgba(255, 255, 255, 0.1)" />
                <text x="47" y="76" fill="#cbd5e1" fontSize="7.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">INPUT</text>
                <text x="25" y="98" fill="#ffffff" fontSize="13" fontWeight="700">Task Spec</text>
                <text x="25" y="113" fill="#94a3b8" fontSize="9.5">Natural Language</text>
                <text x="25" y="128" fill="#64748b" fontSize="8.5" fontFamily="var(--font-mono)">Pydantic Model</text>
              </g>

              {/* Planner Node */}
              <g>
                <rect x="200" y="45" width="145" height="110" rx="8" fill="#181d28" stroke="#f59e0b" strokeWidth="2" />
                <rect x="210" y="57" width="55" height="16" rx="3" fill="rgba(245, 158, 11, 0.2)" />
                <text x="237" y="69" fill="#f59e0b" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">ORCHESTRATOR</text>
                <text x="210" y="92" fill="#ffffff" fontSize="14" fontWeight="700">Planner Agent</text>
                <text x="210" y="108" fill="#cbd5e1" fontSize="10">LLM Decision Graph</text>
                <text x="210" y="123" fill="#94a3b8" fontSize="9">Fixed JSON/Tool Collision</text>
                <text x="210" y="137" fill="#f59e0b" fontSize="8.5" fontFamily="var(--font-mono)">SSE Stream Events</text>
              </g>

              {/* Sandbox Node */}
              <g>
                <rect x="420" y="45" width="145" height="110" rx="8" fill="#11141c" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="430" y="57" width="55" height="16" rx="3" fill="rgba(56, 189, 248, 0.2)" />
                <text x="457" y="69" fill="#38bdf8" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">SANDBOX</text>
                <text x="430" y="92" fill="#ffffff" fontSize="14" fontWeight="700">Docker Runtime</text>
                <text x="430" y="108" fill="#cbd5e1" fontSize="10">Isolated Code Exec</text>
                <text x="430" y="123" fill="#94a3b8" fontSize="9">Workspace Allowlist</text>
                <text x="430" y="137" fill="#38bdf8" fontSize="8.5" fontFamily="var(--font-mono)">Container Volume</text>
              </g>

              {/* Test Layer Node */}
              <g>
                <rect x="640" y="45" width="125" height="110" rx="8" fill="#11141c" stroke="#34d399" strokeWidth="1.5" />
                <rect x="650" y="57" width="50" height="16" rx="3" fill="rgba(52, 211, 153, 0.2)" />
                <text x="675" y="69" fill="#34d399" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">VALIDATION</text>
                <text x="650" y="92" fill="#ffffff" fontSize="13" fontWeight="700">Test Layer</text>
                <text x="650" y="108" fill="#cbd5e1" fontSize="10">22/22 Tests Suite</text>
                <text x="650" y="123" fill="#94a3b8" fontSize="9">Pytest Assertion</text>
                <text x="650" y="137" fill="#34d399" fontSize="8.5" fontFamily="var(--font-mono)">Pass Gate</text>
              </g>

              {/* GitHub PR */}
              <g>
                <rect x="810" y="65" width="60" height="70" rx="8" fill="#181d28" stroke="rgba(255, 255, 255, 0.2)" />
                <text x="840" y="95" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">PR</text>
                <text x="840" y="112" fill="#34d399" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">GitHub</text>
              </g>
            </svg>
          </div>
        )}

        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <span>
            Directional pipeline arrows show execution progression from user requirement, through sandboxed DAG planning, to automated Pytest gate and Git pull request generation.
          </span>
        </div>
      </div>
    );
  }

  // content-gen-tool and other tools
  const steps: FlowStep[] = [
    { from: 'SerpAPI / Reddit / YT', to: 'BM25 + Bi-Encoder', label: '1. Multi-source harvesting & coarse candidate pooling', protocol: 'Async Batching' },
    { from: 'Candidate Pool', to: 'Cross-Encoder Re-ranker', label: '2. Low-performing paragraphs routed to deep semantic scorer', protocol: 'Semantic Embeddings' },
    { from: 'Cross-Encoder', to: 'GPT-4o-mini Generator', label: '3. Top 15% high-relevance context forwarded to LLM', protocol: 'Prompt Orchestration' },
    { from: 'LLM Generator', to: 'SEO Storefront Output', label: '4. Coverage-weighted markdown published to category pages', protocol: 'CMS / REST Output' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {renderToolbar(steps.length)}

      {viewMode === 'steps' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-soft)', 
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {step.from} <ArrowRight size={11} style={{ display: 'inline', margin: '0 2px' }} /> {step.to}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                {step.protocol}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
          <svg 
            viewBox="0 0 880 230" 
            style={{ width: '100%', minWidth: '760px', height: 'auto', display: 'block' }}
            aria-label="Content Generation Tool Flow: Multi-source inputs converge to Aggregation, flow through BM25 and Cross-Encoder to GPT-4o-mini, yielding SEO Content"
          >
            <defs>
              <marker id="arrow-gen-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-gen-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
              </marker>
              <marker id="arrow-gen-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
              </marker>
              <style>{`
                @keyframes genDash {
                  to { stroke-dashoffset: -20; }
                }
                .gen-arrow {
                  stroke-dasharray: 6, 6;
                  animation: genDash 1.2s linear infinite;
                }
              `}</style>
            </defs>

            {/* Ingestion convergence arrows */}
            <g>
              <path d="M 125 45 C 160 45, 170 115, 205 115" stroke="#38bdf8" strokeWidth="2" fill="none" markerEnd="url(#arrow-gen-cyan)" className="gen-arrow" />
              <path d="M 125 115 L 205 115" stroke="#38bdf8" strokeWidth="2" fill="none" markerEnd="url(#arrow-gen-cyan)" className="gen-arrow" />
              <path d="M 125 185 C 160 185, 170 115, 205 115" stroke="#38bdf8" strokeWidth="2" fill="none" markerEnd="url(#arrow-gen-cyan)" className="gen-arrow" />
            </g>

            {/* Aggregation -> Bi/Cross-Encoder */}
            <g>
              <path d="M 355 115 L 425 115" stroke="#f59e0b" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-gen-amber)" className="gen-arrow" />
              <rect x="363" y="95" width="58" height="18" rx="4" fill="#181d28" stroke="rgba(245, 158, 11, 0.3)" />
              <text x="392" y="108" fill="#f59e0b" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">BM25 Fast →</text>
            </g>

            {/* Cross-Encoder -> LLM */}
            <g>
              <path d="M 575 115 L 645 115" stroke="#f59e0b" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-gen-amber)" className="gen-arrow" />
              <rect x="583" y="95" width="58" height="18" rx="4" fill="#181d28" stroke="rgba(245, 158, 11, 0.3)" />
              <text x="612" y="108" fill="#f59e0b" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">Top 15% →</text>
            </g>

            {/* LLM -> SEO Output */}
            <g>
              <path d="M 785 115 L 825 115" stroke="#34d399" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-gen-emerald)" className="gen-arrow" />
            </g>

            {/* Ingestion Source Nodes */}
            <g>
              <rect x="15" y="25" width="110" height="40" rx="6" fill="#11141c" stroke="rgba(255, 255, 255, 0.1)" />
              <text x="70" y="50" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">SerpAPI</text>

              <rect x="15" y="95" width="110" height="40" rx="6" fill="#11141c" stroke="rgba(255, 255, 255, 0.1)" />
              <text x="70" y="120" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">Reddit (PRAW)</text>

              <rect x="15" y="165" width="110" height="40" rx="6" fill="#11141c" stroke="rgba(255, 255, 255, 0.1)" />
              <text x="70" y="190" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">YouTube API</text>
            </g>

            {/* Aggregation Node */}
            <g>
              <rect x="210" y="70" width="145" height="90" rx="8" fill="#181d28" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="220" y="80" width="60" height="16" rx="3" fill="rgba(56, 189, 248, 0.2)" />
              <text x="250" y="92" fill="#38bdf8" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">AGGREGATION</text>
              <text x="220" y="115" fill="#ffffff" fontSize="13" fontWeight="700">Batch Ingestion</text>
              <text x="220" y="130" fill="#94a3b8" fontSize="9.5">Async Parallel Requests</text>
              <text x="220" y="145" fill="#38bdf8" fontSize="8.5" fontFamily="var(--font-mono)">Latency: 850ms</text>
            </g>

            {/* Re-ranking Engine */}
            <g>
              <rect x="430" y="65" width="145" height="100" rx="8" fill="#181d28" stroke="#f59e0b" strokeWidth="2" />
              <rect x="440" y="77" width="70" height="16" rx="3" fill="rgba(245, 158, 11, 0.2)" />
              <text x="475" y="89" fill="#f59e0b" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">RE-RANKING</text>
              <text x="440" y="112" fill="#ffffff" fontSize="13" fontWeight="700">2-Stage Filter</text>
              <text x="440" y="128" fill="#cbd5e1" fontSize="9.5">Bi + Cross-Encoder</text>
              <text x="440" y="142" fill="#94a3b8" fontSize="8.5">Coverage-weighted mean</text>
              <text x="440" y="156" fill="#f59e0b" fontSize="8.5" fontFamily="var(--font-mono)">-65% Model Costs</text>
            </g>

            {/* LLM Generation */}
            <g>
              <rect x="650" y="70" width="135" height="90" rx="8" fill="#11141c" stroke="#34d399" strokeWidth="1.5" />
              <rect x="660" y="80" width="60" height="16" rx="3" fill="rgba(52, 211, 153, 0.2)" />
              <text x="690" y="92" fill="#34d399" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">SYNTHESIS</text>
              <text x="660" y="115" fill="#ffffff" fontSize="13" fontWeight="700">GPT-4o-mini</text>
              <text x="660" y="130" fill="#94a3b8" fontSize="9.5">Targeted Section Rewrite</text>
              <text x="660" y="145" fill="#34d399" fontSize="8.5" fontFamily="var(--font-mono)">Zero Topic Gaps</text>
            </g>

            {/* Output */}
            <g>
              <rect x="830" y="80" width="40" height="70" rx="6" fill="#181d28" stroke="rgba(255, 255, 255, 0.2)" />
              <text x="850" y="112" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">SEO</text>
              <text x="850" y="127" fill="#34d399" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">CMS</text>
            </g>
          </svg>
        </div>
      )}

      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
        <span>
          Cascading arrows demonstrate the two-stage retrieval pipeline: asynchronous raw ingestion converges to fast bi-encoder candidate scoring, and only pruned sections route to semantic cross-encoders.
        </span>
      </div>
    </div>
  );
};

