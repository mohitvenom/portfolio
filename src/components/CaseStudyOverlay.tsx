import { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { content } from '../data/content';
import { start, stop } from '../utils/lenis';
import { CaseStudyDiagram } from './CaseStudyDiagram';

interface CaseStudyOverlayProps {
  id: string | null;
  onClose: () => void;
}

export default function CaseStudyOverlay({ id, onClose }: CaseStudyOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  
  const project = content.projects.find(p => p.id === id);

  useEffect(() => {
    if (id) {
      stop();
      // focus trap
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 100);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        start();
        window.removeEventListener('keydown', handleKeyDown);
        
        // Return focus
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
            background: 'rgba(15, 17, 21, 0.9)',
            backdropFilter: 'blur(8px)'
          }}
        />

        {/* Content */}
        <m.div
          ref={overlayRef}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="panel"
          data-lenis-prevent="true"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-slate-900)',
            padding: 'var(--spacing-8)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-8)'
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

          <header>
            <span style={{ color: 'var(--status-cyan)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
              // CASE STUDY
            </span>
            <h2 id="dialog-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-4)' }}>{project.title}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {caseStudy.stack.map(s => (
                <span key={s} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '4px 8px', background: 'var(--bg-slate-800)', border: '1px solid var(--border-color)' }}>
                  {s}
                </span>
              ))}
            </div>
          </header>

          <section>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>[01] PROBLEM</h3>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>{caseStudy.problem}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>[02] APPROACH</h3>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>{caseStudy.approach}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>[03] ARCHITECTURE</h3>
            <div style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-6)', background: 'var(--bg-slate-800)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <CaseStudyDiagram id={project.id} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {caseStudy.architecture}
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>[04] KEY ENGINEERING DECISIONS</h3>
            {Array.isArray(caseStudy.keyDecisions) ? (
              <ul style={{ fontSize: '1.125rem', lineHeight: 1.6, paddingLeft: 'var(--spacing-6)' }}>
                {caseStudy.keyDecisions.map((desc, i) => (
                  <li key={i} style={{ marginBottom: 'var(--spacing-2)' }}>{desc}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>{caseStudy.keyDecisions}</p>
            )}
          </section>

          <section>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>[05] HARD PROBLEMS SOLVED</h3>
            <div style={{ background: 'rgba(255, 176, 0, 0.05)', borderLeft: '2px solid var(--accent-amber)', padding: 'var(--spacing-4)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{caseStudy.hardProblems}</p>
            </div>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>[06] OUTCOME</h3>
            <p style={{ fontSize: '1.25rem', color: 'var(--status-cyan)' }}>{caseStudy.outcome}</p>
          </section>

          <footer style={{ marginTop: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            {caseStudy.links?.map(link => (
              <a key={link.text} href={link.url} target="_blank" rel="noreferrer" className="hardware-btn" style={{ padding: 'var(--spacing-3) var(--spacing-6)' }}>
                {link.text}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </footer>
          
          {(caseStudy as any).note && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'var(--spacing-4)' }}>
              {(caseStudy as any).note}
            </p>
          )}
        </m.div>
      </div>
    </AnimatePresence>
  );
}
