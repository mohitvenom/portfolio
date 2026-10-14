import { useEffect, useState, Suspense, lazy, useRef } from 'react';
import Lenis from 'lenis';
import { frame, cancelFrame } from 'motion';
import { LazyMotion, domAnimation } from 'motion/react';
import { setLenis } from './utils/lenis';
import { content } from './data/content';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { SkillsAndExperience } from './components/SkillsAndExperience';
import { ContactTerminal } from './components/ContactTerminal';
import { StyleGuide } from './components/StyleGuide';
import { SpatialBackground } from './components/SpatialBackground';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { BackToTop } from './components/BackToTop';

const CaseStudyOverlay = lazy(() => import('./components/CaseStudyOverlay'));
import './index.css';

function LazyRender({ children, minHeight = "100vh", id }: { children: React.ReactNode, minHeight?: string, id?: string }) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldRender(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });

  if (ref.current) {
    observer.observe(ref.current);
  }
  return () => observer.disconnect();
}, []);

return (
  <div id={id} ref={ref} style={{ minHeight: shouldRender ? 'auto' : minHeight, contentVisibility: shouldRender ? 'visible' : 'auto' }}>
    {shouldRender ? children : null}
  </div>
);
}

function App() {
  useEffect(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const lenis = new Lenis({
      duration: isReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    // Store globally via module
    setLenis(lenis);

    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }
    
    // Sync Lenis with Motion's render loop
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const [currentHash, setCurrentHash] = useState(() => typeof window !== 'undefined' ? window.location.hash : '');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#/case/')) {
      return window.location.hash.replace('#/case/', '');
    }
    return null;
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash.startsWith('#/case/')) {
        setActiveCaseId(hash.replace('#/case/', ''));
      } else {
        setActiveCaseId(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);

  const handleOpenCase = (id: string) => {
    setActiveCaseId(id);
    setCurrentHash(`#/case/${id}`);
    try {
      window.location.hash = `#/case/${id}`;
    } catch {
      // ignore
    }
  };

  const handleCloseOverlay = () => {
    setActiveCaseId(null);
    setCurrentHash('');
    try {
      if (window.location.hash.startsWith('#/case/')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {
      window.location.hash = '';
    }
  };

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Subtle fixed animated progress bar tracking scroll depth */}
      <ScrollProgressBar />
      <SpatialBackground />
      <a href="#main-content" className="skip-link sr-only focusable">Skip to content</a>
      <Nav />
      <main id="main-content" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        {currentHash === '#/styleguide' ? <StyleGuide /> : (
          <>
            <Hero />
            <LazyRender id="projects" minHeight="600px">
              <Projects onSelectProject={handleOpenCase} />
            </LazyRender>
            <LazyRender id="skills" minHeight="600px">
              <SkillsAndExperience />
            </LazyRender>
            <LazyRender id="contact" minHeight="500px">
              <ContactTerminal />
            </LazyRender>
          </>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-canvas)',
        padding: '2.5rem 1.5rem',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Mohit Sharma</span>
            <span style={{ margin: '0 0.5rem' }}>·</span>
            <span>AI Engineer at Ubuy Technologies</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a href="https://github.com/mohitvenom" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/mohit-sharma-aiengineeer" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
              LinkedIn
            </a>
            <a href="mailto:slsharmakv04@gmail.com" style={{ color: 'var(--text-secondary)' }}>
              Email
            </a>
            <a
              href={content.personal.resumeUrl}
              download="Mohit_Sharma_Resume.pdf"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8125rem',
                textDecoration: 'none'
              }}
            >
              Resume (PDF)
            </a>
            <a 
              href="#hero" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              style={{ color: 'var(--accent-primary)', fontWeight: 500 }}
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>

      {Boolean(activeCaseId) && (
        <Suspense fallback={
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(5, 7, 10, 0.9)', 
            zIndex: 100, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              border: '2px solid rgba(245, 158, 11, 0.2)', 
              borderTopColor: 'var(--accent-primary)', 
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }>
          <CaseStudyOverlay 
            id={activeCaseId} 
            onClose={handleCloseOverlay} 
          />
        </Suspense>
      )}

      {/* Floating Back to Top Button (visible past hero) */}
      <BackToTop />
    </LazyMotion>
  );
}

export default App;
