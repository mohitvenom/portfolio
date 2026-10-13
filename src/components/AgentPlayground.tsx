import React, { useState, useEffect, useRef } from 'react';
import { m } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Boxes, 
  CheckCircle2, 
  ArrowRight,
  Code2
} from 'lucide-react';

interface SimulationStep {
  id: string;
  node: string;
  status: 'active' | 'success' | 'warn' | 'error';
  title: string;
  thought: string;
  mcpCall?: {
    server: string;
    method: string;
    tool: string;
    params: Record<string, any>;
    result?: Record<string, any>;
  };
  durationMs: number;
  tokens: { prompt: number; completion: number };
  stateSnapshot: Record<string, any>;
}

interface Scenario {
  id: string;
  title: string;
  tag: string;
  description: string;
  initialPrompt: string;
  nodes: { id: string; label: string; type: 'trigger' | 'planner' | 'mcp' | 'tool' | 'eval' | 'output' }[];
  steps: SimulationStep[];
  expectedOutcome: string;
  hardeningRule: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'inventory-intel',
    title: 'Inventory Intel Monitor',
    tag: 'LangGraph · MCP SDK · PostgreSQL',
    description: 'Autonomous multi-marketplace price drop & stockout detection engine with MCP tool isolation.',
    initialPrompt: 'Check prices and stock for Sony WH-1000XM5 across Amazon, Ubuy, and eBay. Flag any price drop > 8% or restocks.',
    nodes: [
      { id: 'cron', label: 'Cron Scheduler', type: 'trigger' },
      { id: 'planner', label: 'LangGraph Planner', type: 'planner' },
      { id: 'mcp-router', label: 'MCP Server', type: 'mcp' },
      { id: 'scraper', label: 'Marketplace Scrapers', type: 'tool' },
      { id: 'timescale-db', label: 'PostgreSQL DB', type: 'tool' },
      { id: 'notifier', label: 'Slack & Alert Engine', type: 'output' }
    ],
    expectedOutcome: 'Detected 12.4% price drop on eBay ($329 vs $375 7-day median). Alert pushed to #inventory-signals.',
    hardeningRule: 'Anti-bot mitigation: PerimeterX block on Walmart recognized gracefully without crashing graph execution.',
    steps: [
      {
        id: 's1',
        node: 'planner',
        status: 'active',
        title: 'LangGraph State Initialization',
        thought: 'Received scheduled trigger for SKU "SNY-WH1000-XM5". Reading active marketplace configurations and historical median pricing.',
        durationMs: 82,
        tokens: { prompt: 210, completion: 45 },
        stateSnapshot: {
          session_id: "mcp-inv-8841",
          sku: "SNY-WH1000-XM5",
          tracked_markets: ["amazon", "ubuy", "ebay"],
          active_retry_count: 0
        }
      },
      {
        id: 's2',
        node: 'mcp-router',
        status: 'active',
        title: 'MCP Server Protocol Handshake',
        thought: 'Dispatching tools/call requests over standardized MCP Python SDK interface to decouple scraper client from orchestrator.',
        mcpCall: {
          server: "inventory-mcp-v1",
          method: "tools/call",
          tool: "scrape_marketplace_prices",
          params: { query: "Sony WH-1000XM5", markets: ["amazon", "ubuy", "ebay"] },
          result: { amazon: { price: 348.00, in_stock: true }, ubuy: { price: 362.50, in_stock: true }, ebay: { price: 304.99, in_stock: true } }
        },
        durationMs: 440,
        tokens: { prompt: 340, completion: 98 },
        stateSnapshot: {
          raw_feed: { amazon: 348.0, ubuy: 362.5, ebay: 304.99 },
          mcp_transport: "stdio/json-rpc-2.0",
          status: "DATA_ACQUIRED"
        }
      },
      {
        id: 's3',
        node: 'timescale-db',
        status: 'active',
        title: 'PostgreSQL Time-Series Comparison',
        thought: 'Querying historical 14-day rolling price window. eBay price ($304.99) is 12.4% below 7-day trailing median ($348.00). Alert threshold (8%) satisfied.',
        mcpCall: {
          server: "inventory-mcp-v1",
          method: "tools/call",
          tool: "query_price_history",
          params: { sku: "SNY-WH1000-XM5", window_days: 14 },
          result: { median_price: 348.0, delta_pct: -12.35, trigger_alert: true }
        },
        durationMs: 110,
        tokens: { prompt: 180, completion: 32 },
        stateSnapshot: {
          price_delta: "-12.35%",
          threshold_exceeded: true,
          alert_target: "slack_webhook_inventory_signals"
        }
      },
      {
        id: 's4',
        node: 'notifier',
        status: 'success',
        title: 'Slack Webhook Dispatched',
        thought: 'Formatted Markdown alert payload with direct deep link and historical drop graph. Committed transaction checkpoint to PostgreSQL.',
        durationMs: 95,
        tokens: { prompt: 160, completion: 74 },
        stateSnapshot: {
          status: "COMPLETE",
          alert_delivered: true,
          next_scheduled_run: "2026-10-09T03:00:00Z"
        }
      }
    ]
  },
  {
    id: 'forge-ai',
    title: 'ForgeAI Autonomous PR & Test Repair',
    tag: 'Docker Sandbox · Pytest · GitHub API',
    description: 'Sandboxed code repair agent that generates fixes, runs unit tests, diagnoses failure loops, and creates Git PRs.',
    initialPrompt: 'Fix bug: "CodingAgent discarded CodingDecision when native tool calls were present, creating infinite loop under SSE stream".',
    nodes: [
      { id: 'issue', label: 'Issue Ingest', type: 'trigger' },
      { id: 'planner', label: 'Plan & Solve', type: 'planner' },
      { id: 'sandbox', label: 'Docker Container', type: 'mcp' },
      { id: 'pytest', label: 'Pytest Suite', type: 'tool' },
      { id: 'reflector', label: 'Self-Correction', type: 'eval' },
      { id: 'git-pr', label: 'GitHub PR Commit', type: 'output' }
    ],
    expectedOutcome: 'All 22/22 regression tests passed in sandbox. Created PR #41 with detailed architectural changelog.',
    hardeningRule: 'Safe-path enforcement: Blocks directory traversal beyond authorized workspace root.',
    steps: [
      {
        id: 's1',
        node: 'planner',
        status: 'active',
        title: 'Task Decomposition & Safe-Path Audit',
        thought: 'Inspecting repo structure at /src/agents/coding_agent.py. Enforcing authorized workspace-root allowlist.',
        durationMs: 140,
        tokens: { prompt: 410, completion: 112 },
        stateSnapshot: {
          workspace_root: "/app/repo",
          path_verified: true,
          target_file: "src/agents/coding_agent.py"
        }
      },
      {
        id: 's2',
        node: 'sandbox',
        status: 'active',
        title: 'Docker Sandbox Patch Execution',
        thought: 'Applying patch to preserve CodingDecision alongside tool calls. Preventing router from stalling in IMPLEMENTING phase.',
        durationMs: 310,
        tokens: { prompt: 580, completion: 180 },
        stateSnapshot: {
          patch_applied: true,
          container_isolation: "docker_bridge_no_network",
          modified_lines: "+14 / -4"
        }
      },
      {
        id: 's3',
        node: 'pytest',
        status: 'active',
        title: 'Automated Pytest Execution',
        thought: 'Running pytest tests/test_coding_agent.py inside container. 22/22 unit tests passing, zero regression detected.',
        mcpCall: {
          server: "forge-sandbox",
          method: "tools/call",
          tool: "run_pytest",
          params: { test_file: "tests/test_coding_agent.py", verbose: true },
          result: { passed: 22, failed: 0, time_seconds: 1.48 }
        },
        durationMs: 520,
        tokens: { prompt: 290, completion: 48 },
        stateSnapshot: {
          tests_passed: 22,
          tests_failed: 0,
          status: "VALIDATED"
        }
      },
      {
        id: 's4',
        node: 'git-pr',
        status: 'success',
        title: 'GitHub Pull Request Generated',
        thought: 'Git checkpoint created. Branch fix/router-decision-discard pushed to origin. Pull Request opened via GitHub API.',
        durationMs: 180,
        tokens: { prompt: 310, completion: 140 },
        stateSnapshot: {
          branch: "fix/router-decision-discard",
          pr_number: 41,
          status: "MERGE_READY"
        }
      }
    ]
  },
  {
    id: 'content-rag',
    title: 'Two-Stage SEO RAG & Re-ranking',
    tag: 'BM25 · Cross-Encoder · GPT-4o-mini',
    description: 'Cascading retrieval-and-rewrite engine that researches SERP topics, weeds out noise, and crafts high-ranking copy.',
    initialPrompt: 'Research competitor SERP & Reddit benchmarks for "Autonomous Agent Frameworks Comparison" and draft optimized section.',
    nodes: [
      { id: 'query', label: 'Keyword Query', type: 'trigger' },
      { id: 'harvester', label: 'SerpAPI / Reddit', type: 'mcp' },
      { id: 'bm25', label: 'BM25 Dense Filter', type: 'tool' },
      { id: 'cross-encoder', label: 'Cross-Encoder', type: 'eval' },
      { id: 'rewrite', label: 'LLM Synthesis', type: 'output' }
    ],
    expectedOutcome: 'Evaluated 48 candidate passages in 850ms (down from 4.8s). Topic coverage score boosted to 94%.',
    hardeningRule: 'Coverage-weighted mean scoring prevents 300-word spam articles from gaming similarity algorithms.',
    steps: [
      {
        id: 's1',
        node: 'harvester',
        status: 'active',
        title: 'Multi-Source SERP & Reddit Ingestion',
        thought: 'Harvesting top 10 Google search results via SerpAPI and top 5 community discussions via Reddit PRAW.',
        durationMs: 380,
        tokens: { prompt: 220, completion: 60 },
        stateSnapshot: {
          serp_documents: 10,
          reddit_threads: 5,
          raw_text_chunks: 48
        }
      },
      {
        id: 's2',
        node: 'bm25',
        status: 'active',
        title: 'First-Stage Fast Pruning (BM25)',
        thought: 'Eliminating 36 irrelevant candidate paragraphs with fast BM25 lexographic scoring in 14ms.',
        durationMs: 90,
        tokens: { prompt: 150, completion: 20 },
        stateSnapshot: {
          candidates_filtered: 36,
          candidates_retained: 12,
          stage_1_latency: "14ms"
        }
      },
      {
        id: 's3',
        node: 'cross-encoder',
        status: 'active',
        title: 'Second-Stage Cross-Encoder Re-Ranking',
        thought: 'Deep semantic scoring on 12 remaining candidate passages. Entity-coverage threshold applied.',
        durationMs: 240,
        tokens: { prompt: 410, completion: 90 },
        stateSnapshot: {
          top_k_passages: 4,
          relevance_boost: "+28%",
          topical_coverage: "94%"
        }
      },
      {
        id: 's4',
        node: 'rewrite',
        status: 'success',
        title: 'Structured LLM Rewrite Generation',
        thought: 'GPT-4o-mini generating authoritative comparative table and section copy with cited real-world latency trade-offs.',
        durationMs: 420,
        tokens: { prompt: 620, completion: 310 },
        stateSnapshot: {
          word_count: 680,
          reading_ease: 68.4,
          status: "READY_FOR_CMS"
        }
      }
    ]
  }
];

export const AgentPlayground: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('inventory-intel');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'normal' | 'turbo'>('normal');
  const [loopGuardEnabled, setLoopGuardEnabled] = useState<boolean>(true);
  const [activeInspectorStep, setActiveInspectorStep] = useState<SimulationStep | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log when new step arrives
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  // Simulation execution runner
  useEffect(() => {
    let timer: any;
    if (isRunning && currentStepIndex < scenario.steps.length - 1) {
      const delay = speed === 'normal' ? 950 : 350;
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => {
          const next = prev + 1;
          if (next >= scenario.steps.length - 1) {
            setIsRunning(false);
          }
          return next;
        });
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, scenario.steps.length, speed]);

  const handleStart = () => {
    if (currentStepIndex >= scenario.steps.length - 1) {
      setCurrentStepIndex(0);
    } else if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStepNext = () => {
    setIsRunning(false);
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setActiveInspectorStep(null);
  };

  const handleScenarioChange = (id: string) => {
    handleReset();
    setSelectedScenarioId(id);
  };

  // Cumulative metrics
  const executedSteps = scenario.steps.slice(0, currentStepIndex + 1);
  const totalDuration = executedSteps.reduce((acc, s) => acc + s.durationMs, 0);
  const totalTokens = executedSteps.reduce((acc, s) => acc + s.tokens.prompt + s.tokens.completion, 0);
  const estCost = ((totalTokens / 1000) * 0.00015).toFixed(5);

  const isCompleted = currentStepIndex === scenario.steps.length - 1;

  return (
    <section 
      id="sandbox" 
      style={{ 
        paddingTop: 'var(--space-16)', 
        paddingBottom: 'var(--space-16)',
        position: 'relative'
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontSize: '0.875rem', 
          color: 'var(--accent-primary)', 
          fontWeight: 600, 
          marginBottom: 'var(--space-2)' 
        }}>
          <Cpu size={16} />
          <span>Interactive Execution Sandbox</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>Live Multi-Agent Simulation</span>
        </div>
        <h2 style={{ 
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          color: 'var(--text-primary)', 
          margin: 0 
        }}>
          Simulate Autonomous Agent Graphs
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '720px', 
          marginTop: 'var(--space-2)',
          lineHeight: 1.6
        }}>
          Inspect how Mohit orchestrates LangGraph state machines, decouples tools via the official Model Context Protocol (MCP), and prevents infinite retry loops with hardened guardrails.
        </p>
      </div>

      {/* Main Sandbox Card Frame */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Control Bar: Scenario Preset Selector */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}
        >
          {/* Preset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architecture Preset:
            </span>
            {SCENARIOS.map(s => {
              const isSelected = s.id === selectedScenarioId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleScenarioChange(s.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 600 : 500,
                    background: isSelected ? 'var(--accent-soft)' : 'var(--bg-canvas)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Execution Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={isRunning ? handlePause : handleStart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: isRunning ? 'var(--bg-muted)' : 'var(--accent-primary)',
                color: isRunning ? 'var(--text-primary)' : '#090b10',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: isRunning ? 'none' : '0 2px 10px rgba(245, 158, 11, 0.3)'
              }}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{isRunning ? 'Pause' : isCompleted ? 'Replay' : 'Run Graph'}</span>
            </button>

            <button
              type="button"
              onClick={handleStepNext}
              disabled={isRunning || isCompleted}
              title="Execute one node at a time (Human-in-the-Loop)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-canvas)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: isRunning || isCompleted ? 'not-allowed' : 'pointer',
                opacity: isRunning || isCompleted ? 0.5 : 1
              }}
            >
              <span>Step Next</span>
              <ArrowRight size={12} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset simulation graph"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-canvas)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={14} />
            </button>

            {/* Turbo Speed Toggle */}
            <button
              type="button"
              onClick={() => setSpeed(s => s === 'normal' ? 'turbo' : 'normal')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: speed === 'turbo' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: speed === 'turbo' ? 'var(--accent-primary)' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              <Zap size={11} />
              <span>{speed === 'turbo' ? 'Turbo (350ms)' : '1x Real'}</span>
            </button>
          </div>
        </div>

        {/* Objective & Hardening Rules Banner */}
        <div
          style={{
            padding: '12px 20px',
            background: 'var(--bg-muted)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.8125rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
              Target Objective:
            </span>
            <span style={{ color: 'var(--text-primary)' }}>"{scenario.initialPrompt}"</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setLoopGuardEnabled(prev => !prev)}
              title="Toggle agent loop watchdog guardrail"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: loopGuardEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: loopGuardEnabled ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                color: loopGuardEnabled ? '#10b981' : '#f87171',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={12} />
              <span>Loop Guard: {loopGuardEnabled ? 'Active' : 'Bypassed'}</span>
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {scenario.hardeningRule}
            </span>
          </div>
        </div>

        {/* Middle Stage: Visual Graph Flow */}
        <div
          style={{
            padding: '24px 20px',
            background: 'var(--bg-canvas)',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'relative',
            overflowX: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '680px', gap: '12px' }}>
            {scenario.nodes.map((node, index) => {
              // Determine if node is currently executing, completed, or idle
              const isExecutingNode = currentStepIndex >= 0 && currentStepIndex < scenario.steps.length && scenario.steps[currentStepIndex].node === node.id;
              const hasExecutedNode = scenario.steps.slice(0, currentStepIndex + 1).some(s => s.node === node.id);

              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: '110px',
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: isExecutingNode 
                        ? 'var(--bg-surface-elevated)' 
                        : hasExecutedNode 
                          ? 'var(--bg-surface)' 
                          : 'var(--bg-muted)',
                      border: isExecutingNode 
                        ? '1.5px solid var(--accent-primary)' 
                        : hasExecutedNode 
                          ? '1px solid rgba(245, 158, 11, 0.35)' 
                          : '1px solid var(--border-subtle)',
                      boxShadow: isExecutingNode 
                        ? '0 0 16px rgba(245, 158, 11, 0.25)' 
                        : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* Node Type Indicator */}
                    <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {node.type}
                    </div>

                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isExecutingNode ? 'var(--accent-primary)' : hasExecutedNode ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {node.label}
                    </div>

                    {/* Status Dot */}
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: isExecutingNode ? '#fbbf24' : hasExecutedNode ? '#10b981' : 'var(--text-dim)',
                          boxShadow: isExecutingNode ? '0 0 8px #fbbf24' : 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {isExecutingNode ? 'RUNNING' : hasExecutedNode ? 'RESOLVED' : 'QUEUED'}
                      </span>
                    </div>
                  </div>

                  {/* Flow Arrow / Connector Edge */}
                  {index < scenario.nodes.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', color: hasExecutedNode ? 'var(--accent-primary)' : 'var(--border-medium)', flexShrink: 0 }}>
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Lower Split Screen: Real-Time MCP JSON-RPC & Thought Trace vs State Inspector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          {/* Left Column: Streaming Thought Log & JSON-RPC Calls */}
          <div
            style={{
              padding: '16px 20px',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-canvas)',
              minHeight: '280px',
              maxHeight: '360px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                <Terminal size={14} />
                <span>Agent Monologue & Tool Call Stream</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Step {currentStepIndex >= 0 ? currentStepIndex + 1 : 0} of {scenario.steps.length}
              </span>
            </div>

            {currentStepIndex === -1 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                <Boxes size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p style={{ fontSize: '0.8125rem', margin: 0 }}>
                  Graph is idle. Click <strong>"Run Graph"</strong> or <strong>"Step Next"</strong> to initiate the multi-agent orchestration pipeline.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {scenario.steps.slice(0, currentStepIndex + 1).map((step, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <m.div
                      key={step.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setActiveInspectorStep(step)}
                      style={{
                        padding: '12px 14px',
                        background: isCurrent ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                        border: isCurrent ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isCurrent ? 'var(--accent-primary)' : '#10b981' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {step.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          +{step.durationMs}ms
                        </span>
                      </div>

                      {/* Monologue */}
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 6px 0', lineHeight: 1.5 }}>
                        {step.thought}
                      </p>

                      {/* Tool Call Payload Snippet if available */}
                      {step.mcpCall && (
                        <div
                          style={{
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            color: '#93c5fd',
                            marginTop: '6px'
                          }}
                        >
                          <span style={{ color: 'var(--accent-primary)' }}>→ MCP Call:</span> {step.mcpCall.method} ({step.mcpCall.tool})
                        </div>
                      )}
                    </m.div>
                  );
                })}
                <div ref={terminalBottomRef} />
              </div>
            )}
          </div>

          {/* Right Column: State Inspector & Telemetry HUD */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-surface)',
              minHeight: '280px',
              maxHeight: '360px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                <Code2 size={14} />
                <span>LangGraph State Payload Inspector</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {activeInspectorStep ? `Inspecting ${activeInspectorStep.title}` : 'Latest State'}
              </span>
            </div>

            {/* JSON State Viewer */}
            <div
              style={{
                flex: 1,
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                overflowX: 'auto',
                lineHeight: 1.5
              }}
            >
              {currentStepIndex >= 0 ? (
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(
                    activeInspectorStep 
                      ? activeInspectorStep.stateSnapshot 
                      : scenario.steps[currentStepIndex].stateSnapshot, 
                    null, 
                    2
                  )}
                </pre>
              ) : (
                <span style={{ color: 'var(--text-dim)' }}>
                  // State graph uninitialized.{'\n'}
                  // Awaiting session payload...
                </span>
              )}
            </div>

            {/* Performance Telemetry HUD */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Graph Latency</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {totalDuration} ms
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Total Tokens</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                  {totalTokens}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Inference Cost</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  ${estCost}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status Bar: Final Outcome Banner */}
        {isCompleted && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              padding: '14px 20px',
              background: 'rgba(16, 185, 129, 0.08)',
              borderTop: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                Execution Succeeded: {scenario.expectedOutcome}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Completed in {totalDuration}ms · Zero infinite loop regressions
            </span>
          </m.div>
        )}
      </div>
    </section>
  );
};
