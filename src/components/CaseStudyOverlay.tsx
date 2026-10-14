import { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { X, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
import { content } from '../data/content';
import { start, stop } from '../utils/lenis';
import { CaseStudyDiagram } from './CaseStudyDiagram';

interface CaseStudyOverlayProps {
  id: string | null;
  onClose: () => void;
}

const parseHardProblem = (text: string) => {
  const issueMatch = text.match(/Issue:\s*(.*?)(?=Root Cause:|$)/i);
  const rootCauseMatch = text.match(/Root Cause:\s*(.*?)(?=Fix:|$)/i);
  const fixMatch = text.match(/Fix:\s*(.*)/i);
  
  if (issueMatch && rootCauseMatch && fixMatch) {
    return {
      issue: issueMatch[1].trim(),
      rootCause: rootCauseMatch[1].trim(),
      fix: fixMatch[1].trim()
    };
  }
  return null;
};

const ChapterHeading = ({ num, title }: { num: string; title: string }) => (
  <div style={{ marginBottom: 'var(--space-3)' }}>
    <div style={{ 
      fontSize: '0.75rem', 
      fontWeight: 600, 
      color: 'var(--accent-primary)', 
      textTransform: 'uppercase', 
      letterSpacing: '0.04em' 
    }}>
      {num}.
    </div>
    <h3 style={{ 
      fontSize: '1.25rem', 
      fontWeight: 700, 
      color: 'var(--text-primary)', 
      letterSpacing: '-0.02em',
      marginTop: '2px'
    }}>
      {title}
    </h3>
  </div>
);

export default function CaseStudyOverlay({ id, onClose }: CaseStudyOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  
  const project = content.projects.find(p => p.id === id);

  useEffect(() => {
    if (id) {
      stop();
      setTimeout(() => closeBtnRef.current?.focus(), 100);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        start();
        window.removeEventListener('keydown', handleKeyDown);
        
        setTimeout(() => {
          const card = document.getElementById(`project-card-${id}`);
          if (card) {
            card.focus();
          } else {
            document.getElementById('projects-heading')?.focus();
          }
        }, 50);
      };
    }
  }, [id, onClose]);

  if (!id || !project || !project.caseStudy) return null;

  const { caseStudy } = project;
  const parsedHardProblem = caseStudy.hardProblems ? parseHardProblem(caseStudy.hardProblems) : null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Measured Backdrop Scrim */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5, 7, 10, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            cursor: 'pointer'
          }}
        />

        {/* Modal Window */}
        <m.div
          ref={overlayRef}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="architectural-card"
          data-lenis-prevent="true"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
            boxShadow: 'var(--shadow-overlay)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 'var(--space-6)',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--accent-primary)', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '0.35rem'
              }}>
                Architectural Case Study · {project.category}
              </div>
              <h2 id="dialog-title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                {project.title}
              </h2>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close dialog"
              className="btn-secondary"
              style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Chapter 01: System Overview & Approach */}
          <section>
            <ChapterHeading num="01" title="Overview & Operational Scope" />
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
              {caseStudy.approach}
            </p>
          </section>

          {/* Chapter 02: Problem Definition */}
          <section>
            <ChapterHeading num="02" title="Architectural Problem Statement" />
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
              {caseStudy.problem}
            </p>
          </section>

          {/* Chapter 03: Topology Diagram */}
          <section>
            <ChapterHeading num="03" title="Component Topology & Data Flow" />
            <div style={{
              padding: 'var(--space-6)',
              background: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 'var(--space-4)',
              overflow: 'hidden'
            }}>
              <CaseStudyDiagram id={project.id} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: 0 }}>
              {caseStudy.architecture}
            </p>
          </section>

          {/* Chapter 04: Key Engineering Decisions */}
          <section>
            <ChapterHeading num="04" title="Strategic Engineering Trade-Offs" />
            {Array.isArray(caseStudy.keyDecisions) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {caseStudy.keyDecisions.map((desc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '0.55rem', flexShrink: 0 }} />
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
                {caseStudy.keyDecisions}
              </p>
            )}
          </section>

          {/* Chapter 05: The Hard Problem / Incident Debugging */}
          <section>
            <ChapterHeading num="05" title="Production Hardening & Bug Diagnosis" />
            {parsedHardProblem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ 
                  padding: 'var(--space-4)', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--bg-muted)', 
                  border: '1px solid var(--border-subtle)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <AlertTriangle size={14} color="var(--accent-primary)" />
                    <span>The Production Anomaly</span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
                    {parsedHardProblem.issue}
                  </p>
                </div>

                <div style={{ 
                  padding: 'var(--space-4)', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--bg-muted)', 
                  border: '1px solid var(--border-subtle)' 
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Root Cause Analysis
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
                    {parsedHardProblem.rootCause}
                  </p>
                </div>

                <div style={{ 
                  padding: 'var(--space-4)', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--accent-soft)', 
                  border: '1px solid var(--accent-border)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <CheckCircle2 size={14} />
                    <span>Permanent Resolution & Hardening</span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
                    {parsedHardProblem.fix}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {caseStudy.hardProblems}
              </p>
            )}
          </section>

          {/* Chapter 06: Verified Outcomes */}
          <section>
            <ChapterHeading num="06" title="Verified Outcomes & Metrics" />
            {Array.isArray(caseStudy.outcome) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {caseStudy.outcome.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '1.0625rem', color: 'var(--accent-primary)', fontWeight: 600, margin: 0 }}>
                {caseStudy.outcome}
              </p>
            )}
          </section>

          {/* Chapter 07: Stack & Links */}
          <section style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                  Technologies Utilized
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {caseStudy.stack.map(s => (
                    <span 
                      key={s} 
                      style={{ 
                        fontSize: '0.8125rem', 
                        fontFamily: 'var(--font-mono)', 
                        padding: '4px 8px', 
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-muted)', 
                        border: '1px solid var(--border-subtle)', 
                        color: 'var(--text-secondary)' 
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {caseStudy.links && caseStudy.links.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {caseStudy.links.map(link => (
                    <a 
                      key={link.text} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-primary"
                      style={{ padding: '0.625rem 1rem' }}
                    >
                      <span>Repository on {link.text}</span>
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Internal Ubuy Production System
                </span>
              )}
            </div>
          </section>
        </m.div>
      </div>
    </AnimatePresence>
  );
}
