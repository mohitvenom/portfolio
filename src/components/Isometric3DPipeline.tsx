import { useState } from 'react';
import { Play, CheckCircle2, RotateCcw, Box, Cpu, Database, Bell, Layers, Zap } from 'lucide-react';

interface Isometric3DPipelineProps {
  id: string;
}

interface Node3D {
  id: string;
  name: string;
  tag: string;
  color: string;
  icon: any;
  x: number;
  y: number;
  z: number;
  tech: string;
}

export const Isometric3DPipeline = ({ id }: Isometric3DPipelineProps) => {
  const [simStep, setSimStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tiltAngle, setTiltAngle] = useState({ x: 52, z: -36 });

  const getNodes = (): Node3D[] => {
    if (id === 'inventory-intel-agent') {
      return [
        { id: 'cron', name: 'APScheduler', tag: '01. TRIGGER', color: '#f59e0b', icon: Zap, x: -160, y: -60, z: 25, tech: 'AsyncIO cron (Hourly)' },
        { id: 'langgraph', name: 'LangGraph Engine', tag: '02. ORCHESTRATOR', color: '#f59e0b', icon: Cpu, x: -50, y: 0, z: 45, tech: 'Cyclic StateGraph + gpt-4o-mini' },
        { id: 'mcp', name: 'MCP Server', tag: '03. PROTOCOL HOST', color: '#38bdf8', icon: Layers, x: 70, y: 0, z: 35, tech: 'JSON-RPC 2.0 (Amazon/Ubuy)' },
        { id: 'postgres', name: 'PostgreSQL ACID', tag: '04. TIME-SERIES', color: '#a78bfa', icon: Database, x: 190, y: -80, z: 30, tech: 'SQLAlchemy snapshots' },
        { id: 'slack', name: 'Slack + Next.js', tag: '05. DISPATCH', color: '#34d399', icon: Bell, x: 190, y: 70, z: 30, tech: 'Webhook alert sink' },
      ];
    }
    if (id === 'forge-ai') {
      return [
        { id: 'spec', name: 'Task Spec', tag: '01. INPUT', color: '#cbd5e1', icon: Zap, x: -160, y: 0, z: 20, tech: 'Natural language issue' },
        { id: 'planner', name: 'Planner Agent', tag: '02. DECOMPOSITION', color: '#f59e0b', icon: Cpu, x: -60, y: 0, z: 45, tech: 'Pydantic DAG schema' },
        { id: 'sandbox', name: 'Docker Sandbox', tag: '03. RUNTIME', color: '#38bdf8', icon: Layers, x: 60, y: 0, z: 35, tech: 'Isolated code volume' },
        { id: 'pytest', name: 'Pytest Suite', tag: '04. VALIDATION', color: '#34d399', icon: Database, x: 170, y: 0, z: 30, tech: '22/22 regression gate' },
      ];
    }
    // Default / content-gen-tool
    return [
      { id: 'harvester', name: 'Multi-Source Harvester', tag: '01. HARVEST', color: '#38bdf8', icon: Layers, x: -160, y: 0, z: 25, tech: 'SerpAPI / Reddit / YT' },
      { id: 'biencoder', name: 'BM25 + Bi-Encoder', tag: '02. FAST PASS', color: '#f59e0b', icon: Cpu, x: -50, y: 0, z: 40, tech: 'Dense vector pooling' },
      { id: 'cross', name: 'Cross-Encoder Scorer', tag: '03. RE-RANKER', color: '#f59e0b', icon: Database, x: 70, y: 0, z: 35, tech: 'Coverage-weighted mean' },
      { id: 'gen', name: 'GPT-4o-mini Generator', tag: '04. SYNTHESIS', color: '#34d399', icon: Bell, x: 190, y: 0, z: 30, tech: 'Zero topic gaps' },
    ];
  };

  const nodes = getNodes();

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= nodes.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setSimStep(null);
        }, 1200);
      } else {
        setSimStep(current);
      }
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 3D Stage Top Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Box size={14} color="var(--accent-primary)" />
          <span>3D Isometric Volumetric Stage</span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            CSS 3D Depth
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="filter-tab-button"
            style={{
              padding: '5px 12px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isSimulating ? 'var(--accent-soft)' : 'var(--bg-surface)',
              color: isSimulating ? 'var(--accent-primary)' : 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              cursor: isSimulating ? 'not-allowed' : 'pointer'
            }}
          >
            <Play size={12} fill={isSimulating ? "currentColor" : "none"} />
            <span>{isSimulating ? `Executing Step ${((simStep || 0) + 1)}...` : 'Simulate Live Pipeline'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTiltAngle(a => a.x === 52 ? { x: 35, z: -20 } : { x: 52, z: -36 })}
            className="filter-tab-button"
            style={{ padding: '5px 8px', fontSize: '0.75rem' }}
            title="Toggle isometric camera angle"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* 3D Isometric Viewport Container */}
      <div 
        style={{
          width: '100%',
          height: '320px',
          background: 'radial-gradient(ellipse at 50% 50%, #131722 0%, #090b10 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          perspective: '1200px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Spatial 3D World Plate */}
        <div 
          style={{
            width: '460px',
            height: '240px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tiltAngle.x}deg) rotateZ(${tiltAngle.z}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* Base Grid Plane */}
          <div 
            style={{
              position: 'absolute',
              inset: '-40px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              transform: 'translateZ(0px)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.9)'
            }}
          />

          {/* Render 3D Extruded Nodes */}
          {nodes.map((node, idx) => {
            const isCurrentSim = simStep === idx;
            const isSelected = selectedNode === node.id;
            const Icon = node.icon;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '110px',
                  height: '75px',
                  marginLeft: `${node.x - 55}px`,
                  marginTop: `${node.y - 37}px`,
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${isCurrentSim ? node.z + 25 : node.z}px)`,
                  transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  cursor: 'pointer'
                }}
              >
                {/* 3D Cast Shadow on Baseplate */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: '4px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    transform: `translateZ(-${node.z}px) scale(0.95)`,
                    filter: 'blur(8px)',
                    pointerEvents: 'none'
                  }}
                />

                {/* 3D Volumetric Side Thickness Plate */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '8px',
                    background: '#0d1017',
                    transform: 'translateZ(-12px)',
                    border: '1px solid rgba(0, 0, 0, 0.8)'
                  }}
                />

                {/* Top Face of 3D Node Block */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '8px',
                    background: isCurrentSim ? 'var(--bg-surface-elevated)' : '#121622',
                    border: `1.5px solid ${isCurrentSim ? node.color : isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.12)'}`,
                    boxShadow: isCurrentSim 
                      ? `0 0 24px ${node.color}50, inset 0 1px 0 rgba(255,255,255,0.2)` 
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0,0,0,0.4)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: 'translateZ(0px)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ 
                      fontSize: '7.5px', 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 700, 
                      color: node.color,
                      letterSpacing: '0.04em' 
                    }}>
                      {node.tag}
                    </span>
                    <Icon size={12} color={node.color} />
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                      {node.name}
                    </div>
                    <div style={{ fontSize: '7.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {node.tech}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Spec Bar */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="var(--accent-primary)" />
          <span>
            {selectedNode 
              ? `${nodes.find(n => n.id === selectedNode)?.name}: ${nodes.find(n => n.id === selectedNode)?.tech}`
              : "3D Isometric Projection: Click any node to inspect or click 'Simulate Live Pipeline' to trace a runtime execution cycle."}
          </span>
        </div>

        <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          True Volumetric Z-Stack
        </span>
      </div>
    </div>
  );
};
