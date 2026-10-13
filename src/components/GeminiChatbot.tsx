import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  RotateCcw, 
  Sparkles, 
  Cpu, 
  Zap, 
  BrainCircuit, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  ArrowRight
} from 'lucide-react';

export type TaskType = 'general' | 'complex' | 'fast';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  model?: string;
  timestamp: string;
}

const TASK_MODES: {
  id: TaskType;
  label: string;
  model: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
}[] = [
  {
    id: 'general',
    label: 'General Guide',
    model: 'gemini-3.5-flash',
    description: 'Technical portfolio guide & candidate overview',
    icon: Bot
  },
  {
    id: 'complex',
    label: 'Deep Architecture',
    model: 'gemini-3.1-pro-preview',
    description: 'Complex reasoning, state machines & MCP protocols',
    icon: BrainCircuit
  },
  {
    id: 'fast',
    label: 'Rapid Intel',
    model: 'gemini-3.1-flash-lite',
    description: 'Ultra-fast bullet summaries & key stats',
    icon: Zap
  }
];

const SUGGESTED_PROMPTS = [
  "How does the Inventory Intel Agent use MCP and LangGraph?",
  "Explain ForgeAI's sandboxed plan-code-test-review loop.",
  "What did you build at Ubuy Technologies?",
  "What are Mohit's core skills and availability?"
];

let messageCounter = 0;
function createMessageId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

function getFormattedTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const INITIAL_GREETING: Message = {
  id: 'init-1',
  role: 'model',
  content: "Hello! I am Mohit's Gemini-powered engineering copilot. Ask me anything about Mohit's autonomous multi-agent pipelines, MCP servers, experience at Ubuy Technologies, or availability for full-time opportunities.",
  model: 'gemini-3.5-flash',
  timestamp: 'Just now'
};

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>('general');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingTextRef = useRef('');
  const streamingModelRef = useRef<string | undefined>(undefined);

  // Auto-scroll to bottom of thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Global shortcut (Cmd+K / Ctrl+K) to open chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClearHistory = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setMessages([INITIAL_GREETING]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    setInput('');

    const userMessage: Message = {
      id: createMessageId('usr'),
      role: 'user',
      content: prompt,
      timestamp: getFormattedTime()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const activeMode = TASK_MODES.find(m => m.id === taskType);
    const assistantMessageId = createMessageId('asst');
    streamingTextRef.current = '';
    streamingModelRef.current = activeMode?.model;
    
    // Add placeholder assistant message for streaming
    setMessages(prev => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'model',
        content: '',
        model: activeMode?.model,
        timestamp: getFormattedTime()
      }
    ]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          taskType,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body for stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.text) {
                streamingTextRef.current += data.text;
                const currentText = streamingTextRef.current;
                const currentModel = streamingModelRef.current;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: currentText, model: currentModel }
                      : msg
                  )
                );
              }
              if (data.done && data.model) {
                streamingModelRef.current = data.model;
              }
            } catch {
              // Ignore malformed SSE chunk
            }
          }
        }
      }

      if (!streamingTextRef.current) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "I received your message but no output was generated. Please try again or switch tasks."
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Chat generation error:', err);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `⚠️ Error communicating with Gemini: ${err.message || 'Network error'}. Please check your connection or switch to another model.`
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentModeInfo = TASK_MODES.find(m => m.id === taskType) || TASK_MODES[0];

  return (
    <>
      {/* Floating Trigger Button */}
      <m.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="chat-floating-trigger"
          aria-label={isOpen ? "Close AI Copilot" : "Open Gemini AI Copilot"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            borderRadius: '9999px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), 0 0 16px rgba(245, 158, 11, 0.12)',
            transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Gemini Copilot
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentModeInfo.model}
            </span>
          </div>

          <span 
            style={{ 
              fontSize: '0.6875rem', 
              color: 'var(--text-muted)', 
              background: 'var(--bg-muted)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            ⌘K
          </span>
        </button>
      </m.div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            style={{
              position: 'fixed',
              bottom: isExpanded ? '24px' : '88px',
              right: '24px',
              width: isExpanded ? 'calc(100vw - 48px)' : '440px',
              maxWidth: isExpanded ? '860px' : 'calc(100vw - 48px)',
              height: isExpanded ? 'calc(100vh - 48px)' : '620px',
              maxHeight: isExpanded ? 'calc(100vh - 48px)' : '80vh',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 32px rgba(245, 158, 11, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 95,
              overflow: 'hidden',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <Bot size={18} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Mohit's AI Copilot
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        background: 'var(--accent-soft)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      GEMINI
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Autonomous Agents & Architecture Intel
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear conversation history"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RotateCcw size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(prev => !prev)}
                  title={isExpanded ? "Collapse view" : "Expand view"}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Task / Role Selector Segmented Bar */}
            <div
              style={{
                padding: '8px 14px',
                background: 'var(--bg-canvas)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                overflowX: 'auto'
              }}
            >
              {TASK_MODES.map(mode => {
                const Icon = mode.icon;
                const isSelected = taskType === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTaskType(mode.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '5px 8px',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 600 : 500,
                      borderRadius: '6px',
                      background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                    title={mode.description}
                  >
                    <Icon size={13} />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Model Subtitle Bar */}
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(245, 158, 11, 0.04)',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={12} color="var(--accent-primary)" />
                <span>Engine: {currentModeInfo.model}</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>
                {taskType === 'complex' ? 'High Reasoning' : taskType === 'fast' ? 'Low Latency' : 'General Tasks'}
              </span>
            </div>

            {/* Scrollable Conversation Thread */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {messages.map(msg => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    {/* Role Tag & Timestamp */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.6875rem',
                        color: 'var(--text-muted)',
                        marginBottom: '4px',
                        padding: '0 4px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <span>{isUser ? 'Evaluator / Recruiter' : 'Gemini Copilot'}</span>
                      {msg.model && <span>· {msg.model}</span>}
                      <span>· {msg.timestamp}</span>
                    </div>

                    {/* Bubble Content */}
                    <div
                      style={{
                        maxWidth: '88%',
                        padding: '12px 16px',
                        borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                        background: isUser ? 'var(--accent-primary)' : 'var(--bg-surface)',
                        color: isUser ? '#090b10' : 'var(--text-primary)',
                        border: isUser ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        boxShadow: isUser 
                          ? '0 4px 12px rgba(245, 158, 11, 0.2)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.3)',
                        fontWeight: isUser ? 500 : 400
                      }}
                    >
                      {msg.content ? (
                        <div>{msg.content}</div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <span className="dot-pulse" />
                          <span>Generating architectural reasoning...</span>
                        </div>
                      )}
                    </div>

                    {/* Copy affordance for model messages */}
                    {!isUser && msg.content && (
                      <div style={{ marginTop: '4px', padding: '0 4px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.6875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px'
                          }}
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={12} color="#10b981" />
                              <span style={{ color: '#10b981' }}>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips (when only 1 or 2 messages) */}
            {messages.length <= 2 && !isLoading && (
              <div
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Suggested Deep Dives:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SUGGESTED_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      style={{
                        background: 'var(--bg-muted)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <span>{prompt}</span>
                      <ArrowRight size={11} color="var(--accent-primary)" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Console */}
            <div
              style={{
                padding: '12px 14px',
                borderTop: '1px solid var(--border-medium)',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px'
              }}
            >
              <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder={`Ask about systems, MCP architecture, or background... (${currentModeInfo.model})`}
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: 1.4,
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                style={{
                  height: '42px',
                  width: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: input.trim() && !isLoading ? 'var(--accent-primary)' : 'var(--bg-muted)',
                  color: input.trim() && !isLoading ? '#090b10' : 'var(--text-muted)',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s ease, transform 0.1s ease',
                  boxShadow: input.trim() && !isLoading ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none'
                }}
                title="Send message (Enter)"
              >
                {isLoading ? (
                  <span className="dot-pulse" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};
