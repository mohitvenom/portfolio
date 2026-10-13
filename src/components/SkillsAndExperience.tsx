import { useState } from 'react';
import { content } from '../data/content';
import { m } from 'motion/react';
import { Briefcase, GraduationCap, Award, ArrowUpRight } from 'lucide-react';
import { TiltCard3D } from './TiltCard3D';

export const SkillsAndExperience = () => {
  const [activeModuleBank, setActiveModuleBank] = useState<string>('All');

  const getProjectUrl = (id: string) => {
    const proj = content.projects.find(p => p.id === id);
    if (!proj) return undefined;
    return proj.type === 'Flagship' ? `#/case/${id}` : undefined;
  };

  const filteredSkills = content.skills.filter(group => {
    if (activeModuleBank === 'All') return true;
    return group.category.toLowerCase().includes(activeModuleBank.toLowerCase());
  });

  return (
    <section id="skills" style={{ 
      paddingTop: 'var(--space-16)', 
      paddingBottom: 'var(--space-16)',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      {/* 02. Engineering Capabilities Matrix - 3D Hardware Rack */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          flexWrap: 'wrap', 
          gap: '1rem',
          marginBottom: 'var(--space-2)'
        }}>
          <div>
            <div style={{ 
              fontSize: '0.8125rem', 
              fontWeight: 600, 
              letterSpacing: '0.04em', 
              color: 'var(--accent-primary)', 
              textTransform: 'uppercase',
              marginBottom: 'var(--space-2)'
            }}>
              02. Technical Capabilities & Rack Modules
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', margin: 0 }}>
              Engineering competencies honed in production.
            </h2>
          </div>

          {/* 3D Hardware Channel Selector */}
          <div className="filter-segmented-bar" style={{ padding: '3px' }}>
            {['All', 'Agentic', 'Distributed', 'Ingestion', 'Evaluation'].map((bank) => (
              <button
                key={bank}
                type="button"
                onClick={() => setActiveModuleBank(bank)}
                className={`filter-tab-button ${activeModuleBank === bank ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                {bank === 'All' ? 'All Banks' : bank}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', marginBottom: 'var(--space-10)', marginTop: '0.5rem' }}>
          A disciplined, production-first skillset spanning autonomous agent orchestration, resilient data ingestion, and semantic retrieval systems.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {filteredSkills.map((group, idx) => (
            <m.div 
              key={group.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <TiltCard3D
                scrollParallax={true}
                index={idx}
                parallaxSpeed={18}
                maxTilt={6}
                style={{
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-surface)',
                  height: '100%'
                }}
              >
                <div style={{ 
                  fontSize: '0.8125rem', 
                  fontWeight: 600, 
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-4)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '1px solid var(--border-subtle)',
                  transform: 'translateZ(20px)'
                }}>
                  {group.category}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', transform: 'translateZ(10px)' }}>
                  {group.items.map(skill => (
                    <div 
                      key={skill.name}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'baseline', 
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        fontSize: '0.9375rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {skill.name}
                      </span>
                      {(skill as any).usedIn && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {(skill as any).usedIn}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </TiltCard3D>
            </m.div>
          ))}
        </div>
      </div>

      {/* 03. Trajectory & Experience */}
      <div id="experience" style={{ paddingTop: 'var(--space-12)' }}>
        <div style={{ 
          fontSize: '0.8125rem', 
          fontWeight: 600, 
          letterSpacing: '0.04em', 
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-2)'
        }}>
          03. Experience & Trajectory
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', marginBottom: 'var(--space-10)' }}>
          Professional background & milestones.
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-12)'
        }}>
          {/* Work Experience Card */}
          <div className="architectural-card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-6)' }}>
              <div style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-soft)',
                color: 'var(--accent-primary)'
              }}>
                <Briefcase size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Ubuy Technologies
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Jaipur, India · Full-Time & Embedded
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* AI Engineer Role */}
              <div style={{ paddingLeft: 'var(--space-4)', borderLeft: '2px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    AI Engineer
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    Jan 2026 – Present
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                  Embedded in digital marketing and growth, engineering autonomous retrieval engines, marketplace intelligence tooling, and automated indexing systems.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['content-gen-tool', 'seo-automation', 'product-research-dash', 'keyword-explorer'].map((projId) => {
                    const url = getProjectUrl(projId);
                    const proj = content.projects.find(p => p.id === projId);
                    if (!proj) return null;
                    if (url) {
                      return (
                        <a 
                          key={projId}
                          href={url}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            color: 'var(--accent-primary)',
                            background: 'var(--bg-muted)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          <span>{proj.title}</span>
                          <ArrowUpRight size={12} />
                        </a>
                      );
                    }
                    return (
                      <span 
                        key={projId}
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          background: 'var(--bg-muted)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {proj.title}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* AI Intern Role */}
              <div style={{ paddingLeft: 'var(--space-4)', borderLeft: '2px solid var(--border-medium)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    AI Intern
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Sept 2025 – Dec 2025
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
                  Developed scraping harnesses, researched LLM evaluation protocols, and built internal automated indexing scripts.
                </p>
              </div>
            </div>
          </div>

          {/* Education & Algorithmic Rigor Card */}
          <div className="architectural-card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-6)' }}>
              <div style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-soft)',
                color: 'var(--accent-primary)'
              }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Education & Foundations
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Academic Credentials & Competitive Programming
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    B.Tech in Computer Science
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    2022 – 2026
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                  University of Engineering and Management (UEM), Jaipur · <strong style={{ color: 'var(--text-primary)' }}>CGPA: 8.69 / 10</strong>
                </p>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Certifications: Python for Data Science (NPTEL) · DBMS (NPTEL) · Deep Learning (Infosys)
                </div>
              </div>

              {/* Competitive Achievements */}
              <div style={{ 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-muted)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Award size={16} />
                  <span>Algorithmic Rigor</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {content.achievements.map((ach, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{ach}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
