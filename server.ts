import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI SDK on the server side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_PROMPT = `You are the AI Engineering Copilot for Mohit Sharma's portfolio. You represent Mohit's work, engineering philosophy, and architectural depth to recruiters, engineering managers, and technical peers.

### Candidate Profile:
- **Name**: Mohit Sharma
- **Current Role**: AI Engineer at Ubuy Technologies (Embedded in digital marketing & automation team, Jan 2026 – Present; previously AI Intern Sept 2025 – Dec 2025).
- **Specialization**: Autonomous multi-agent systems, LangGraph orchestration, Model Context Protocol (MCP), LLM application pipelines, resilient web scrapers & automated testing.
- **Location**: Jaipur, India (Open to work · Full-time · Open to Remote & Relocation · Notice Period: 2 to 4 weeks).
- **Education**: B.Tech in Computer Science (2022–2026), University of Engineering & Management, Jaipur (CGPA: 8.69 / 10). Certifications in Python for Data Science (NPTEL), DBMS (NPTEL), Deep Learning (Infosys).
- **Email**: slsharmakv04@gmail.com
- **GitHub**: https://github.com/mohitvenom
- **LinkedIn**: https://www.linkedin.com/in/mohit-sharma-aiengineeer

### Flagship Projects & Technical Highlights:
1. **Inventory Intel Agent** (GitHub: github.com/mohitvenom/inventory_intel_engine):
   - Autonomous multi-agent marketplace monitor for price drops, restocks, and stockouts with real-time Slack alerts and Next.js dashboard.
   - Architecture: APScheduler -> LangGraph orchestrator -> Model Context Protocol (MCP) server exposing decoupled scraper & PostgreSQL DB tools -> Slack alerts + Next.js dashboard.
   - Hard Problem: Walmart PerimeterX anti-bot blocked automated requests based on IP reputation. Rather than shipping a fragile workaround, Mohit documented it as an explicit limitation and shipped a robust system across Amazon, Ubuy, and eBay with 75% test coverage.
2. **ForgeAI** (GitHub: github.com/mohitvenom/SWA_task):
   - Autonomous software engineering agent converting natural-language tasks into validated, committed pull requests via sandboxed plan-code-test-review loops.
   - Stack: Python, FastAPI, Pydantic, LLMs, GitHub API, Pytest, Docker sandboxing.
   - Hard Problem: During real end-to-end runs, token consumption ballooned with loop stalls ('Iteration budget exceeded'). Root cause: the LLM router returned both native tool calls and JSON CodingDecision simultaneously, and the agent discarded the decision when tool calls were present. Mohit fixed the state transition logic and added 22/22 passing SSE tests.
3. **Content Generation Tool** (Ubuy Technologies):
   - Two-stage retrieval-and-rewrite pipeline researching SerpAPI, Reddit (PRAW), and YouTube Data API.
   - Replaced high-latency single-pass LLM scoring with lightweight BM25 + dense bi-encoder embeddings, routing only flagged sections to cross-encoders and GPT-4o-mini.
   - Outcome: Cut latency from 4.8s to 850ms, improved cross-encoder relevance by 28%, and cut model inference costs by 65%.
4. **Secondary Tooling**:
   - Google & Bing SEO Automation Tools (saved 5-6 hours/weekly).
   - Google Ads Search Terms Automation with negative keyword detection.
   - Product Research Dashboard & Multi-Source Scrapers.
   - Keyword Explorer (Google Ads Keyword Planner API + OpenAI).
   - MediGo (Healthcare OpenCV OCR + VGG16 X-ray classifier on Flask/MySQL).

### Persona & Style:
- Professional, technical, articulate, direct, and architectural.
- Answer questions with concrete system architecture, trade-offs, and metrics.
- Keep answers clean and well-structured using Markdown formatting, code snippets, or bullet points where helpful.
- If asked about hiring or interviews, invite the evaluator to connect directly via email (slsharmakv04@gmail.com) or download Mohit's resume.`;

function formatErrorMessage(err: any): string {
  if (!err) return 'An error occurred during response generation';
  const rawMsg = err.message || String(err);
  try {
    const parsed = JSON.parse(rawMsg);
    if (parsed?.error?.message) {
      if (parsed.error.message.includes('API key not valid') || parsed.error.status === 'INVALID_ARGUMENT') {
        return 'Please select or configure your Gemini API key in the Settings > Secrets panel to chat with the copilot.';
      }
      return parsed.error.message;
    }
  } catch {
    // raw string
  }
  if (rawMsg.includes('API key not valid') || rawMsg.includes('API_KEY_INVALID')) {
    return 'Please select or configure your Gemini API key in the Settings > Secrets panel to chat with the copilot.';
  }
  if (rawMsg.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini API quota exceeded for this model tier. Upgrading your key in Settings > Secrets increases rate limits.';
  }
  return rawMsg;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Chat Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { messages, taskType = 'general', stream = true } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages must be a non-empty array' });
      }

      // Model selection based on user requirements:
      // - gemini-3.1-pro-preview: particularly complex tasks
      // - gemini-3.5-flash: general tasks
      // - gemini-3.1-flash-lite: fast tasks
      let selectedModel = 'gemini-3.5-flash';
      if (taskType === 'complex') {
        selectedModel = 'gemini-3.1-pro-preview';
      } else if (taskType === 'fast') {
        selectedModel = 'gemini-3.1-flash-lite';
      }

      // Convert messages to Gemini contents structure
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      }));

      // Task-specific system prompt adjustment
      let rolePrompt = SYSTEM_PROMPT;
      if (taskType === 'complex') {
        rolePrompt += '\n\n[Active Mode: Complex Reasoning & Systems Architecture] Provide deep technical analysis, state machine breakdowns, code-level reasoning, and architectural trade-offs.';
      } else if (taskType === 'fast') {
        rolePrompt += '\n\n[Active Mode: Fast Q&A & Quick Summary] Provide concise, rapid bullet points and quick TL;DR summaries without fluff.';
      } else {
        rolePrompt += '\n\n[Active Mode: General Portfolio Guide & Technical Evaluator] Provide articulate, balanced technical responses tailored to engineering recruiters and hiring managers.';
      }

      const executeGenerateStream = async (model: string) => {
        return await ai.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: rolePrompt,
          },
        });
      };

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');

        try {
          let responseStream;
          try {
            responseStream = await executeGenerateStream(selectedModel);
          } catch (modelErr: any) {
            // If complex model fails (e.g. quota/key restrictions), fallback to gemini-3.5-flash
            if (selectedModel !== 'gemini-3.5-flash') {
              console.warn(`Fallback from ${selectedModel} to gemini-3.5-flash:`, modelErr?.message);
              selectedModel = 'gemini-3.5-flash';
              responseStream = await executeGenerateStream(selectedModel);
            } else {
              throw modelErr;
            }
          }

          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }

          res.write(`data: ${JSON.stringify({ done: true, model: selectedModel })}\n\n`);
          res.end();
        } catch (streamError: any) {
          console.error('Streaming error in /api/chat:', streamError);
          const errorMsg = formatErrorMessage(streamError);
          res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
          res.end();
        }
      } else {
        // Non-streaming response
        try {
          let response = await ai.models.generateContent({
            model: selectedModel,
            contents,
            config: {
              systemInstruction: rolePrompt,
            },
          });
          return res.json({ text: response.text || '', model: selectedModel });
        } catch (modelErr: any) {
          if (selectedModel !== 'gemini-3.5-flash') {
            selectedModel = 'gemini-3.5-flash';
            let response = await ai.models.generateContent({
              model: selectedModel,
              contents,
              config: {
                systemInstruction: rolePrompt,
              },
            });
            return res.json({ text: response.text || '', model: selectedModel });
          }
          throw modelErr;
        }
      }
    } catch (err: any) {
      console.error('Error handling /api/chat:', err);
      return res.status(500).json({ error: formatErrorMessage(err) });
    }
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Vite development integration or static file serving
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
