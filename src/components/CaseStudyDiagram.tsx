import { m } from 'motion/react';
import type { Variants } from 'motion/react';
import { useEffect, useState } from 'react';

interface CaseStudyDiagramProps {
  id: string;
}

export const CaseStudyDiagram = ({ id }: CaseStudyDiagramProps) => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mql = window.matchMedia('(max-width: 480px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' }
    }
  };

  const nodeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const renderContent = () => {
    switch (id) {
      case 'inventory-intel-agent':
        return isMobile ? (
          <svg viewBox="0 0 300 450" width="100%" height="100%" aria-label="Architecture Diagram: Scheduler connects to LangGraph orchestrator, which connects to MCP server containing scraper and DB tools, connecting to PostgreSQL and ending at Slack/Next.js dashboard.">
            {/* Edges */}
            <m.path d="M 150 75 L 150 125" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 175 L 150 225" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 275 L 75 325" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 275 L 225 325" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />

            {/* Nodes */}
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }}>
              <rect x="100" y="25" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--accent-amber)" />
              <text x="150" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Scheduler</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <rect x="100" y="125" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="150" y="155" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">LangGraph</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <rect x="100" y="225" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="150" y="250" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">MCP Server</text>
              <text x="150" y="265" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">(Scraper/DB)</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="25" y="325" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="75" y="355" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">PostgreSQL</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="175" y="325" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="225" y="350" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Slack /</text>
              <text x="225" y="365" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Next.js</text>
            </m.g>
          </svg>
        ) : (
          <svg viewBox="0 0 800 200" width="100%" height="100%" aria-label="Architecture Diagram: Scheduler connects to LangGraph orchestrator, which connects to MCP server containing scraper and DB tools, connecting to PostgreSQL and ending at Slack/Next.js dashboard.">
            {/* Horizontal Layout same as before */}
            <m.path d="M 120 100 L 220 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 320 100 L 420 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 520 80 L 620 50" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 520 120 L 620 150" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }}>
              <rect x="20" y="75" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--accent-amber)" />
              <text x="70" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Scheduler</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <rect x="220" y="75" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="270" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">LangGraph</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <rect x="420" y="75" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="470" y="100" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">MCP Server</text>
              <text x="470" y="115" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">(Scraper/DB)</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="620" y="25" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="670" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">PostgreSQL</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="620" y="125" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="670" y="150" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Slack /</text>
              <text x="670" y="165" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Next.js</text>
            </m.g>
          </svg>
        );
      case 'forge-ai':
        return isMobile ? (
          <svg viewBox="0 0 300 450" width="100%" height="100%" aria-label="Architecture Diagram: Task inputs into Planner, which connects to Sandbox Executor and Test Layer, ultimately outputting to GitHub PR workflow.">
            {/* Vertical Edges */}
            <m.path d="M 150 75 L 150 125" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 175 L 150 225" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 275 L 150 325" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 375 L 150 425" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />

            {/* Vertical Nodes */}
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }}>
              <circle cx="150" cy="50" r="25" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="150" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Task</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <rect x="100" y="125" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="150" y="155" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Planner</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <rect x="100" y="225" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--accent-amber)" />
              <text x="150" y="250" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Sandbox</text>
              <text x="150" y="265" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Executor</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="100" y="325" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="150" y="355" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Test Layer</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.8 }}>
              <rect x="100" y="425" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="150" y="455" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">PR</text>
            </m.g>
          </svg>
        ) : (
          <svg viewBox="0 0 800 150" width="100%" height="100%" aria-label="Architecture Diagram: Task inputs into Planner, which connects to Sandbox Executor and Test Layer, ultimately outputting to GitHub PR workflow.">
            <m.path d="M 100 75 L 180 75" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 280 75 L 360 75" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 460 75 L 540 75" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 640 75 L 720 75" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }}>
              <circle cx="50" cy="75" r="40" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="50" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Task</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <rect x="180" y="50" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="230" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Planner</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <rect x="360" y="50" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--accent-amber)" />
              <text x="410" y="75" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Sandbox</text>
              <text x="410" y="90" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Executor</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="540" y="50" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="590" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Test Layer</text>
            </m.g>
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.8 }}>
              <rect x="720" y="50" width="60" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="750" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">PR</text>
            </m.g>
          </svg>
        );
      case 'content-gen-tool':
        return isMobile ? (
          <svg viewBox="0 0 300 350" width="100%" height="100%" aria-label="Architecture Diagram: Sources (SerpAPI, Reddit, YouTube) feed into Aggregation, which connects to LLM Generation, outputting SEO Content.">
            {/* Vertical Edges */}
            <m.path d="M 50 75 L 150 125" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 150 75 L 150 125" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 250 75 L 150 125" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            
            <m.path d="M 150 175 L 150 225" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} />
            <m.path d="M 150 275 L 150 325" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }} />

            {/* Vertical Nodes */}
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }}>
              <rect x="10" y="25" width="80" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">SerpAPI</text>
              
              <rect x="110" y="25" width="80" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="150" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Reddit</text>
              
              <rect x="210" y="25" width="80" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="250" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">YouTube</text>
            </m.g>

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <rect x="100" y="125" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="150" y="155" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Aggregation</text>
            </m.g>
            
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <rect x="100" y="225" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--accent-amber)" />
              <text x="150" y="250" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">LLM</text>
              <text x="150" y="265" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Generation</text>
            </m.g>

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="100" y="325" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="150" y="355" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">SEO Content</text>
            </m.g>
          </svg>
        ) : (
          <svg viewBox="0 0 800 200" width="100%" height="100%" aria-label="Architecture Diagram: Sources (SerpAPI, Reddit, YouTube) feed into Aggregation, which connects to LLM Generation, outputting SEO Content.">
            <m.path d="M 120 50 L 220 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 120 100 L 220 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            <m.path d="M 120 150 L 220 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} />
            
            <m.path d="M 320 100 L 420 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} />
            <m.path d="M 520 100 L 620 100" stroke="var(--status-cyan)" strokeWidth="2" fill="none" variants={pathVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }} />

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }}>
              <rect x="20" y="30" width="100" height="40" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="70" y="55" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">SerpAPI</text>
              
              <rect x="20" y="80" width="100" height="40" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="70" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Reddit</text>
              
              <rect x="20" y="130" width="100" height="40" rx="4" fill="var(--bg-slate-700)" stroke="var(--text-muted)" />
              <text x="70" y="155" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">YouTube</text>
            </m.g>

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <rect x="220" y="75" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="270" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">Aggregation</text>
            </m.g>
            
            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <rect x="420" y="75" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--accent-amber)" />
              <text x="470" y="100" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">LLM</text>
              <text x="470" y="115" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Generation</text>
            </m.g>

            <m.g variants={nodeVariants} initial={prefersReduced ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <rect x="620" y="75" width="100" height="50" rx="4" fill="var(--bg-slate-700)" stroke="var(--status-cyan)" />
              <text x="670" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="var(--font-mono)">SEO Content</text>
            </m.g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', overflowX: isMobile ? 'hidden' : 'auto' }}>
      <div style={{ minWidth: isMobile ? '100%' : '600px', padding: 'var(--spacing-4)' }}>
        {renderContent()}
      </div>
    </div>
  );
};
