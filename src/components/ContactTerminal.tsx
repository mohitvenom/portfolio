import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Download, ExternalLink, Mail, ArrowUpRight } from 'lucide-react';
import { content } from '../data/content';

type OutputLine = {
  text: string;
  isCommand?: boolean;
  isHtml?: boolean;
};

const RESUME_CONSTANT = content.personal.resumeUrl;

export const ContactTerminal = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([
    { text: 'mohit@portfolio:~$ Welcome. Type "help" to see available commands.' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const commands = ['help', 'email', 'github', 'linkedin', 'resume', 'projects', 'status', 'clear'];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const printLine = (text: string, isCommand = false, isHtml = false) => {
    setOutput(prev => [...prev, { text, isCommand, isHtml }]);
  };

  const handleCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim().toLowerCase();
    printLine(`mohit@portfolio:~$ ${cmd}`, true);
    
    if (cmd) {
      setHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }
    
    switch (cmd) {
      case 'help':
        printLine('Available commands: ' + commands.join(', '));
        break;
      case 'email':
        printLine(`Opening email client to contact ${content.personal.email}...`);
        window.location.href = `mailto:${content.personal.email}`;
        break;
      case 'github':
        printLine('Opening GitHub in a new tab...', false, true);
        printLine(`<a href="${content.personal.github}" target="_blank" rel="noopener noreferrer" style="color:var(--status-cyan);text-decoration:underline">${content.personal.github}</a>`, false, true);
        window.open(content.personal.github, '_blank', 'noopener,noreferrer');
        break;
      case 'linkedin':
        printLine('Opening LinkedIn in a new tab...', false, true);
        printLine(`<a href="${content.personal.linkedin}" target="_blank" rel="noopener noreferrer" style="color:var(--status-cyan);text-decoration:underline">${content.personal.linkedin}</a>`, false, true);
        window.open(content.personal.linkedin, '_blank', 'noopener,noreferrer');
        break;
      case 'resume':
        printLine('Downloading resume PDF...');
        const a = document.createElement('a');
        a.href = RESUME_CONSTANT;
        a.download = 'Mohit_Sharma_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        break;
      case 'projects':
        printLine('Scrolling to projects section...');
        const projEl = document.getElementById('projects-heading');
        if (projEl) {
          // If lenis is globally available we'd use it, otherwise fallback to scrollIntoView
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(projEl, { offset: -80 });
          } else {
            projEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;
      case 'testlink':
        printLine('Testing malicious link...', false, true);
        printLine(`<a href="javascript:alert('xss')" target="_blank" rel="noopener noreferrer" style="color:var(--status-cyan);text-decoration:underline">Click me</a>`, false, true);
        break;
      case 'status':
        printLine(content.personal.status.text);
        break;
      case 'clear':
        setOutput([]);
        break;
      case '':
        break;
      default:
        printLine(`Command not found: ${cmd}. Type "help" to see available commands.`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = commands.find(c => c.startsWith(inputValue.toLowerCase()));
      if (match) setInputValue(match);
    }
  };

  const TypewriterLine = ({ line }: { line: OutputLine }) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [displayedText, setDisplayedText] = useState(prefersReduced ? line.text : '');
    
    useEffect(() => {
      if (prefersReduced || line.isCommand) return;
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < line.text.length) {
          setDisplayedText(prev => prev + line.text.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }, [line.text, prefersReduced, line.isCommand]);
    
    const textToRender = line.isCommand || prefersReduced ? line.text : displayedText;
    
    if (line.isHtml) {
      if (line.text.startsWith('<a')) {
        const hrefMatch = line.text.match(/href="([^"]+)"/);
        const contentMatch = line.text.match(/>([^<]+)<\/a>/);
        if (hrefMatch && contentMatch) {
          const rawUrl = hrefMatch[1];
          const isSafe = /^(https?|mailto):/i.test(rawUrl);
          const linkText = contentMatch[1];
          const isFinished = textToRender === line.text;
          
          if (!isSafe || !isFinished) {
            return <div style={{ color: 'var(--status-cyan)' }}>{textToRender}</div>;
          }
          
          return (
            <div style={{ color: 'var(--status-cyan)' }}>
              <a href={rawUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} style={{ color: 'var(--status-cyan)', textDecoration: 'underline' }}>
                {linkText}
              </a>
            </div>
          );
        }
      }
      return <div style={{ color: 'var(--status-cyan)' }}>{textToRender}</div>;
    }

    return (
      <div style={{ color: line.isCommand ? 'var(--text-secondary)' : 'var(--status-cyan)' }}>
        {textToRender}
      </div>
    );
  };

  return (
    <section style={{ paddingTop: 'var(--spacing-24)', paddingBottom: 'var(--spacing-24)' }}>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-8)' }}>
        // CONTACT & LINKS
      </h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-8)', alignItems: 'flex-start' }}>
        
        {/* Terminal Container */}
        <div 
          className="panel" 
          style={{ 
            flex: '1 1 400px',
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.875rem',
            background: '#0a0a0c', // Darker terminal bg
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '350px',
            overflow: 'hidden'
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal Header */}
          <div style={{ padding: 'var(--spacing-2) var(--spacing-4)', background: 'var(--bg-slate-800)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 'var(--spacing-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
          </div>
          
          {/* Visually hidden Screen Reader Region */}
          <div className="sr-only" role="log" aria-live="polite">
            {output.map((line, i) => {
               const text = line.isHtml ? line.text.replace(/<[^>]*>?/gm, '') : line.text;
               return <div key={i}>{text}</div>;
            })}
          </div>

          {/* Visual Output Region */}
          <div 
            ref={terminalRef}
            aria-hidden="true"
            style={{ padding: 'var(--spacing-4)', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}
          >
            {output.map((line, i) => (
              <TypewriterLine key={i} line={line} />
            ))}
          </div>
            
          {/* Input Line (Accessible) */}
          <div style={{ padding: '0 var(--spacing-4) var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'auto' }}>
              <span style={{ color: 'var(--accent-amber)' }}>mohit@portfolio:~$</span>
              <label htmlFor="terminal-input" className="sr-only">Terminal Input</label>
              <input 
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  outline: 'none',
                  flex: 1,
                  padding: 0
                }}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
        </div>

        {/* Visible Quick Links */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>
            Or use these quick links:
          </p>
          <a href={`mailto:${content.personal.email}`} className="hardware-btn primary" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}><Mail size={16} /> Email</span>
            <ExternalLink size={16} />
          </a>
          <a href={content.personal.github} target="_blank" rel="noopener noreferrer" className="hardware-btn" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}><ExternalLink size={16} /> GitHub</span>
            <ArrowUpRight size={16} />
          </a>
          <a href={content.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hardware-btn" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}><ExternalLink size={16} /> LinkedIn</span>
            <ArrowUpRight size={16} />
          </a>
          <a href={RESUME_CONSTANT} download="Mohit_Sharma_Resume.pdf" className="hardware-btn" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}><Download size={16} /> Download Resume</span>
          </a>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', width: '100%' }}>Terminal Shortcuts:</span>
            {['help', 'email', 'resume', 'projects'].map(cmd => (
              <button 
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="hardware-btn" 
                style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem' }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
