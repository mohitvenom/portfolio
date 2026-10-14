import { useState, useRef, useEffect } from 'react';
import { content } from '../data/content';
import { scrollTo } from '../utils/lenis';
import { Download, Menu, X } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';

export const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(e.target as Node) && 
        toggleRef.current && 
        !toggleRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    scrollTo(target, { offset: -80 });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 11, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      width: '100%',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        {/* Zone 1: Single text element Brand Wordmark */}
        <a 
          href="#hero" 
          onClick={(e) => handleScroll(e, '#hero')}
          style={{ 
            fontSize: '1.0625rem', 
            fontWeight: 700, 
            letterSpacing: '-0.02em', 
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>Mohit Sharma</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.875rem' }}>/ AI Engineer</span>
        </a>
        
        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav 
          style={{ display: 'none' }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          <style>{`
            @media (min-width: 820px) {
              .desktop-nav { display: flex !important; align-items: center; gap: 2rem; }
            }
          `}</style>
          <a 
            href="#projects" 
            onClick={(e) => handleScroll(e, '#projects')} 
            style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}
            className="nav-link"
          >
            Selected Systems
          </a>
          <a 
            href="#specimen" 
            onClick={(e) => handleScroll(e, '#specimen')} 
            style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}
            className="nav-link"
          >
            Architecture
          </a>
          <a 
            href="#skills" 
            onClick={(e) => handleScroll(e, '#skills')} 
            style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}
            className="nav-link"
          >
            Engineering Matrix
          </a>
          <a 
            href="#experience" 
            onClick={(e) => handleScroll(e, '#experience')} 
            style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}
            className="nav-link"
          >
            Trajectory
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleScroll(e, '#contact')} 
            style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}
            className="nav-link"
          >
            Connect
          </a>
        </nav>
        
        {/* Zone 3: 1 primary action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <a 
            href={content.personal.resumeUrl} 
            download="Mohit_Sharma_Resume.pdf"
            className="btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
          >
            <Download size={15} />
            <span>Resume</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button 
            ref={toggleRef}
            className="mobile-toggle-btn"
            style={{ 
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <style>{`
              @media (max-width: 819px) {
                .mobile-toggle-btn { display: flex !important; align-items: center; justify-content: center; }
              }
            `}</style>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              width: '100%',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-overlay)'
            }}
          >
            <a 
              href="#projects" 
              onClick={(e) => handleScroll(e, '#projects')} 
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', padding: '0.5rem 0' }}
            >
              Selected Systems
            </a>
            <a 
              href="#specimen" 
              onClick={(e) => handleScroll(e, '#specimen')} 
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', padding: '0.5rem 0' }}
            >
              Architecture
            </a>
            <a 
              href="#skills" 
              onClick={(e) => handleScroll(e, '#skills')} 
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', padding: '0.5rem 0' }}
            >
              Engineering Matrix
            </a>
            <a 
              href="#experience" 
              onClick={(e) => handleScroll(e, '#experience')} 
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', padding: '0.5rem 0' }}
            >
              Trajectory
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScroll(e, '#contact')} 
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', padding: '0.5rem 0' }}
            >
              Connect
            </a>
            <a
              href={content.personal.resumeUrl}
              download="Mohit_Sharma_Resume.pdf"
              onClick={() => setIsMenuOpen(false)}
              className="btn-primary"
              style={{ marginTop: '0.5rem', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <Download size={15} />
              <span>Download Resume</span>
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};
