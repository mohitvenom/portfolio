import { useState, useRef, useEffect } from 'react';
import { content } from '../data/content';
import { scrollTo } from '../utils/lenis';
import { Terminal, Menu, X } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';

export const Nav = () => {
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
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && toggleRef.current && !toggleRef.current.contains(e.target as Node)) {
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
    scrollTo(target, { offset: -73 });
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 17, 21, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: 'var(--panel-border)',
        padding: 'var(--spacing-4) var(--spacing-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-2)', 
          fontFamily: 'var(--font-mono)', 
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <Terminal size={18} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>MOHIT SHARMA // AI ENGINEER</span>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
          {/* Desktop Links */}
          <div className="hide-on-mobile" style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
            <a href="#hero" onClick={(e) => handleScroll(e, '#hero')} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>// HERO</a>
            <a href="#projects" onClick={(e) => handleScroll(e, '#projects')} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>// PROJECTS</a>
            <a href="#skills" onClick={(e) => handleScroll(e, '#skills')} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>// SKILLS</a>
            <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>// CONTACT</a>
          </div>
          
          <a href={content.personal.resumeUrl} download className="hardware-btn primary hide-on-mobile" style={{ marginLeft: 'var(--spacing-4)' }}>
            <span className="led-status amber"></span>
            Resume_PDF
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            ref={toggleRef}
            className="hardware-btn" 
            style={{ display: 'none' }} // Hidden by default, shown via CSS class for mobile
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <style>{`
              @media (max-width: 768px) {
                button[aria-label="Toggle Menu"] { display: flex !important; }
              }
            `}</style>
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '73px', // approx nav height
              left: 0,
              width: '100%',
              background: 'var(--bg-slate-800)',
              borderBottom: 'var(--panel-border)',
              padding: 'var(--spacing-6)',
              zIndex: 49,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)'
            }}
          >
            <a href="#hero" onClick={(e) => handleScroll(e, '#hero')} style={{ fontFamily: 'var(--font-mono)', padding: 'var(--spacing-3)' }}>// HERO</a>
            <a href="#projects" onClick={(e) => handleScroll(e, '#projects')} style={{ fontFamily: 'var(--font-mono)', padding: 'var(--spacing-3)' }}>// PROJECTS</a>
            <a href="#skills" onClick={(e) => handleScroll(e, '#skills')} style={{ fontFamily: 'var(--font-mono)', padding: 'var(--spacing-3)' }}>// SKILLS</a>
            <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} style={{ fontFamily: 'var(--font-mono)', padding: 'var(--spacing-3)' }}>// CONTACT</a>
            
            <a href={content.personal.resumeUrl} download onClick={() => setIsMenuOpen(false)} className="hardware-btn primary" style={{ marginTop: 'var(--spacing-4)' }}>
              <span className="led-status amber"></span>
              Download Resume
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};
