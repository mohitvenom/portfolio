import { useState } from 'react';
import { content } from '../data/content';
import { m, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { TiltCard3D } from './TiltCard3D';

const categories = [
  { id: 'All', label: 'All Systems' },
  { id: 'Agents', label: 'Autonomous Agents' },
  { id: 'Automation', label: 'Automation Pipelines' },
  { id: 'ML', label: 'Machine Learning & Retrieval' }
];

interface ProjectsProps {
  onSelectProject?: (id: string) => void;
}

export const Projects = ({ onSelectProject }: ProjectsProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = content.projects.filter(p => 
    activeCategory === 'All' ? true : p.category === activeCategory
  );

  const flagshipProjects = filteredProjects.filter(p => p.featured);
  const secondaryProjects = filteredProjects.filter(p => !p.featured);

  const handleOpenOverlay = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onSelectProject) {
      onSelectProject(id);
    }
  };

  return (
    <section id="projects" style={{ 
      paddingTop: 'var(--space-16)', 
      paddingBottom: 'var(--space-16)'
    }}>
      {/* Editorial Section Header */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div style={{ 
          fontSize: '0.8125rem', 
          fontWeight: 600, 
          letterSpacing: '0.04em', 
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-2)'
        }}>
          01. Production Systems & Case Studies
        </div>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <h2 id="projects-heading" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em' }}>
            Architected for reliability in production.
          </h2>

          {/* Interactive Filter Controls */}
          <div className="filter-segmented-bar" role="tablist" aria-label="Filter projects by category">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`filter-tab-button ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: 0, fontSize: '1.0625rem' }}>
          Explore key systems developed at Ubuy Technologies and independently, focused on autonomous decision loops, protocol compliance, and resilient execution.
        </p>
      </div>

      {/* Flagship Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
        <AnimatePresence mode="popLayout">
          {flagshipProjects.map((project, idx) => (
            <m.div
              id={`project-card-${project.id}`}
              key={project.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <TiltCard3D
                scrollParallax={true}
                index={idx}
                parallaxSpeed={34}
                onClick={(e) => handleOpenOverlay(e, project.id)}
                style={{
                  padding: 'var(--space-8)',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Unboxed Metadata Header (Zero-Pill Rule) */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  marginBottom: 'var(--space-3)',
                  transform: 'translateZ(25px)'
                }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Production Specimen</span>
                  {project.metrics && project.metrics.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{project.metrics[0].value} {project.metrics[0].label}</span>
                    </>
                  )}
                </div>

                {/* Title & External Affordance */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  gap: '1rem', 
                  marginBottom: 'var(--space-4)',
                  transform: 'translateZ(30px)'
                }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {project.title}
                  </h3>
                  <div style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-muted)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateZ(40px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                  }}>
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Core Description */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 'var(--space-6)', transform: 'translateZ(15px)' }}>
                  {project.description}
                </p>

                {/* Architectural Highlights */}
                {project.caseStudy && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'var(--space-3)', 
                    marginBottom: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    background: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    transform: 'translateZ(25px)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: '70px' }}>
                        Topology:
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {project.caseStudy.architecture}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: '70px' }}>
                        Resolved:
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {project.caseStudy.hardProblems.split('.')[0]}.
                      </span>
                    </div>
                  </div>
                )}

                {/* Unboxed Tech Stack (Zero Pills - clean inline metadata) */}
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', transform: 'translateZ(20px)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {project.tech.slice(0, 6).map((item, i) => (
                      <span key={item} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                        {i < Math.min(project.tech.length, 6) - 1 && (
                          <span style={{ marginLeft: '0.75rem', color: 'var(--border-medium)' }} aria-hidden="true">·</span>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Clear Affordance Link */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    marginTop: 'var(--space-4)', 
                    color: 'var(--accent-primary)', 
                    fontSize: '0.875rem', 
                    fontWeight: 600,
                    transform: 'translateZ(35px)'
                  }}>
                    <span>Examine Architecture Deep-Dive</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </TiltCard3D>
            </m.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Secondary Projects / Engineering Tools */}
      {secondaryProjects.length > 0 && (
        <div>
          <div style={{ 
            fontSize: '0.8125rem', 
            fontWeight: 600, 
            letterSpacing: '0.04em', 
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-4)'
          }}>
            Additional Tooling & Ingestion Pipelines
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <AnimatePresence mode="popLayout">
              {secondaryProjects.map((project, idx) => (
                <m.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <TiltCard3D
                    scrollParallax={true}
                    index={idx + 3}
                    parallaxSpeed={24}
                    maxTilt={6}
                    style={{
                      padding: 'var(--space-6)',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--bg-surface)',
                      height: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', transform: 'translateZ(20px)' }}>
                      <h4 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {project.title.replace(' [In Progress]', '').replace(' [Academic Project]', '')}
                      </h4>
                      {project.title.includes('[In Progress]') && (
                        <span style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                          IN DEVELOPMENT
                        </span>
                      )}
                      {project.title.includes('[Academic Project]') && (
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          ACADEMIC
                        </span>
                      )}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-4)', flexGrow: 1, transform: 'translateZ(12px)' }}>
                      {project.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', transform: 'translateZ(16px)' }}>
                      {project.tech.map((t, idx) => (
                        <span key={t}>
                          {t}{idx < project.tech.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </TiltCard3D>
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
};
