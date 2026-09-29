import { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Terminal } from 'lucide-react';
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

const SectionHeading = ({ num, text }: { num: string, text: string }) => (
  <h3 style={{ 
    color: 'var(--accent-amber)', 
    fontSize: '0.875rem', 
    fontFamily: 'var(--font-mono)', 
    marginBottom: 'var(--spacing-4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }}>
    [{num}] {text}
  </h3>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p style={{ 
    fontSize: '1.125rem', 
    lineHeight: 1.7, 
    color: 'var(--text-primary)',
    maxWidth: '750px' 
  }}>
    {children}
  </p>
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
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'var(--spacing-4)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(10, 10, 12, 0.95)',
            backdropFilter: 'blur(12px)'
          }}
        />

        {/* Content */}
        <m.div
          ref={overlayRef}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="panel"
          data-lenis-prevent="true"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-slate-900)',
            padding: 'var(--spacing-8)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-12)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="hardware-btn"
            style={{ position: 'absolute', top: 'var(--spacing-6)', right: 'var(--spacing-6)' }}
          >
            <X size={20} />
          </button>

          <header style={{ maxWidth: '800px', paddingRight: 'var(--spacing-12)' }}>
            <span style={{ color: 'var(--status-cyan)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 'var(--spacing-3)' }}>
              // CASE STUDY
            </span>
            <h2 id="dialog-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: 'var(--text-primary)' }}>
              {project.title}
            </h2>
          </header>

          <section>
            <SectionHeading num="01" text="Overview" />
            <Paragraph>{caseStudy.approach}</Paragraph>
          </section>

          <section>
            <SectionHeading num="02" text="Problem" />
            <Paragraph>{caseStudy.problem}</Paragraph>
          </section>

          <section>
            <SectionHeading num="03" text="Architecture" />
            <div style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-6)', background: 'var(--bg-slate-800)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <CaseStudyDiagram id={project.id} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.6 }}>
              {caseStudy.architecture}
            </p>
          </section>

          <section>
            <SectionHeading num="04" text="Key Engineering Decisions" />
            {Array.isArray(caseStudy.keyDecisions) ? (
              <ul style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--text-primary)', maxWidth: '750px', paddingLeft: 'var(--spacing-6)' }}>
                {caseStudy.keyDecisions.map((desc, i) => (
                  <li key={i} style={{ marginBottom: 'var(--spacing-2)' }}>{desc}</li>
                ))}
              </ul>
            ) : (
              <Paragraph>{caseStudy.keyDecisions}</Paragraph>
            )}
          </section>

          <section>
            <SectionHeading num="05" text="Hard Problem / Debugging Story" />
            {parsedHardProblem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '750px' }}>
                <div>
                  <span style={{ color: 'var(--status-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', display: 'block', marginBottom: 'var(--spacing-2)' }}>[ ISSUE ]</span>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{parsedHardProblem.issue}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', display: 'block', marginBottom: 'var(--spacing-2)' }}>[ ROOT CAUSE ]</span>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{parsedHardProblem.rootCause}</p>
                </div>
                <div style={{ background: 'rgba(0, 229, 255, 0.05)', borderLeft: '2px solid var(--status-cyan)', padding: 'var(--spacing-4)' }}>
                  <span style={{ color: 'var(--status-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', display: 'block', marginBottom: 'var(--spacing-2)' }}>[ FIX ]</span>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{parsedHardProblem.fix}</p>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255, 176, 0, 0.05)', borderLeft: '2px solid var(--accent-amber)', padding: 'var(--spacing-4)', maxWidth: '750px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.6 }}>{caseStudy.hardProblems}</p>
              </div>
            )}
          </section>

          <section>
            <SectionHeading num="06" text="Outcome" />
            <div style={{ maxWidth: '750px' }}>
              {Array.isArray(caseStudy.outcome) ? (
                <ul style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--text-primary)', paddingLeft: 'var(--spacing-6)' }}>
                  {caseStudy.outcome.map((item, i) => (
                    <li key={i} style={{ marginBottom: 'var(--spacing-2)' }}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '1.25rem', color: 'var(--status-cyan)', lineHeight: 1.6 }}>{caseStudy.outcome}</p>
              )}
            </div>
          </section>

          <section>
            <SectionHeading num="07" text="Tech Stack" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', maxWidth: '750px' }}>
              {caseStudy.stack.map(s => (
                <span key={s} style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', padding: '6px 12px', background: 'var(--bg-slate-800)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading num="08" text="Links" />
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              {caseStudy.links && caseStudy.links.length > 0 ? (
                caseStudy.links.map(link => (
                  <a key={link.text} href={link.url} target="_blank" rel="noreferrer" className="hardware-btn primary" style={{ padding: 'var(--spacing-3) var(--spacing-6)' }}>
                    <Terminal size={16} />
                    {link.text}
                    <ArrowUpRight size={16} />
                  </a>
                ))
              ) : (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Internal project — no public links available.
                </p>
              )}
            </div>
          </section>
          
          {(caseStudy as any).note && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'var(--spacing-4)', fontFamily: 'var(--font-mono)', maxWidth: '750px' }}>
              // {(caseStudy as any).note}
            </p>
          )}
        </m.div>
      </div>
    </AnimatePresence>
  );
}
