export const content = {
  personal: {
    name: "Mohit Sharma",
    role: "AI Engineer",
    tagline: "Engineering Autonomous Systems & Neural Architectures",
    status: {
      text: "Open to work · Full-time · Relocation: India",
      type: "available", // cyan LED
    },
    email: "slsharmakv04@gmail.com",
    github: "https://github.com/mohitvenom",
    linkedin: "https://www.linkedin.com/in/mohit-sharma-aiengineeer",
    resumeUrl: "/Mohit_Sharma_Resume.pdf",
    location: "Jaipur, India",
    noticePeriod: "2 to 4 weeks"
  },
  projects: [
    {
      id: "inventory-intel-agent",
      title: "Inventory Intel Agent",
      type: "Flagship",
      category: "Agents",
      description: "Built an intelligent agent to process and analyze inventory data, providing actionable insights for business scaling.",
      metrics: [
        { label: "Products tracked", value: "7" },
        { label: "Marketplaces live", value: "3 (Amazon, Ubuy, eBay)" },
        { label: "Test coverage", value: "75%" },
        { label: "Bugs fixed during hardening", value: "6+" }
      ],
      tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "MCP", "LangGraph", "LLMs", "OpenAI API", "Docker Compose", "Next.js"],
      featured: true,
      caseStudy: {
        problem: "Price and stock changes across marketplaces (Amazon, Ubuy, Walmart, eBay) are easy to miss when checked manually.",
        approach: "An autonomous agent scrapes marketplace product pages on a schedule, stores history in PostgreSQL, and sends Slack alerts on price drops, restocks and stockouts. A LangGraph orchestrator calls tools exposed by an MCP server, gpt-4o-mini writes run summaries, and a Next.js dashboard supports adding products and on-demand runs (Run Now / Check Now).",
        architecture: "Scheduler -> LangGraph orchestrator -> MCP server (scraper tools, DB tools) -> PostgreSQL -> Slack + Next.js dashboard.",
        stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "MCP Python SDK", "LangGraph", "OpenAI gpt-4o-mini", "APScheduler", "Next.js 14", "Docker Compose"],
        keyDecisions: [
          "Chose the MCP Python SDK so the scraping and DB tools stay reusable by any MCP client rather than hard-wired to one agent framework — and verified the server over its real protocol before building the agent on top of it. Built in 10 phases; Walmart and eBay scrapers were added after the initial Amazon and Ubuy version."
        ],
        hardProblems: "Issue: Walmart scraping was blocked entirely. Root Cause: Walmart's PerimeterX anti-bot system flagged every approach tried — plain requests, cloudscraper, even browser automation — on IP reputation alone. Fix: Rather than force a fragile workaround, documented it as a known limitation and shipped without Walmart support, prioritizing a working system over fake coverage.",
        outcome: "7 products tracked across 4 marketplaces — Amazon, Ubuy and eBay live; Walmart evaluated and documented as a known limitation. 75% test coverage on core decision logic. 6+ real bugs found and fixed during hardening.",
        links: [
          { text: "GitHub", url: "https://github.com/mohitvenom/inventory_intel_engine" },
          { text: "Demo video", url: "[ADD DEMO LINK]" }
        ]
      }
    },
    {
      id: "forge-ai",
      title: "ForgeAI",
      type: "Flagship",
      category: "ML",
      description: "Built a comprehensive AI development platform bridging prompt engineering with scalable deployment architectures.",
      metrics: [],
      tech: ["Python", "FastAPI", "Pydantic", "LLMs", "GitHub API", "Pytest"],
      featured: true,
      caseStudy: {
        problem: "Turning a natural-language task into a tested pull request involves planning, coding, testing and review as separate manual steps.",
        approach: "Converts natural-language tasks into implementation plans and executes them in a secure sandbox. Modular components handle planning, code execution, testing, and GitHub pull-request workflows. A test-strategy layer maps automated test specs to user-acceptance criteria.",
        architecture: "Task -> Planner -> Sandbox executor -> Test layer -> GitHub PR workflow.",
        stack: ["Python", "FastAPI", "Pydantic", "LLMs", "GitHub API", "Pytest"],
        keyDecisions: "Executes validation and commands inside a Docker-based sandbox rather than directly on the host. Workspace access is restricted through an authorized workspace-root allowlist, safe-path validation, and controlled tool execution. Git operations run through a dedicated Git service, and the LLM can only propose actions — the application authorizes and executes them.",
        hardProblems: "Issue: During real end-to-end testing, the agent repeatedly consumed 2 to 3K input tokens while producing only about 57 output tokens, eventually failing with 'Iteration budget exceeded.' Root Cause: Traced to the CodingAgent — the LLM router was returning both native tool calls and a JSON CodingDecision in the same response, but the agent discarded the decision whenever tool calls were present, preventing the IMPLEMENTING to VALIDATING transition and causing the loop to repeat. Fix: Corrected the response-handling logic and added regression tests; the focused CodingAgent/SSE test suite passed 22 of 22.",
        outcome: "Built an end-to-end autonomous software-engineering workflow that understands a task, inspects a repository, plans changes, generates/modifies code, runs validation, diagnoses and repairs failures, reviews the result, and creates a Git checkpoint. Includes a React dashboard with live SSE execution events, execution history, workspace/settings views, and retry support. A real end-to-end test created a file with requested content and committed the change to Git.",
        links: [
          { text: "GitHub", url: "https://github.com/mohitvenom/SWA_task" },
          { text: "Demo video", url: "[ADD DEMO LINK]" }
        ]
      }
    },
    {
      id: "content-gen-tool",
      title: "Content Generation Tool",
      type: "Flagship",
      category: "Agents",
      description: "Built a specialized multi-agent workflow to automate digital marketing content generation at scale.",
      metrics: [],
      tech: ["Python", "FastAPI", "LangGraph", "OpenAI API", "SerpAPI", "PostgreSQL", "LLMs", "BM25", "bi-encoder/cross-encoder re-ranking", "asynchronous pipeline batching"],
      featured: true,
      caseStudy: {
        problem: "SEO content for category, brand and blog pages needs research from several sources before writing.",
        approach: "A full-stack tool that gathers research from SerpAPI, Reddit (PRAW) and the YouTube Data API, then uses GPT-4o-mini to generate SEO content for category, brand and blog pages.",
        architecture: "Research sources (SerpAPI, Reddit, YouTube) -> aggregation -> LLM generation -> SEO content output.",
        stack: ["Python", "FastAPI", "GPT-4o-mini", "SerpAPI", "PRAW", "YouTube Data API", "BM25", "bi-encoder/cross-encoder re-ranking", "asynchronous pipeline batching"],
        keyDecisions: "Used a cascading two-stage pipeline instead of single-pass LLM scoring. Passing whole documents to a heavy LLM caused high latency (over 8s) and diluted attention across granular headings, so lightweight BM25 and dense bi-encoder embeddings quickly score and flag low-performing paragraphs, and only those specific sections are routed to a cross-encoder and LLM for rewrite suggestions.",
        hardProblems: "Issue: Low-effort, 300-word drafts were scoring higher (98/100) than detailed 2,000-word guides. Root Cause: Sliding-window chunking used max() pooling on cosine similarity, so a single sentence closely matching a competitor query inflated the entire document's score while ignoring missing subtopics. Fix: Switched to a coverage-weighted mean combined with an entity-coverage threshold that penalizes unaddressed SERP topics.",
        outcome: [
          "Dropped full-document evaluation latency from 4.8s to 850ms via asynchronous pipeline batching.",
          "Improved target content relevance by 28% (cross-encoder score) and reduced topical gaps by 35% across 60+ benchmark articles.",
          "Cut model inference costs by 65% by filtering candidates before deep semantic re-ranking."
        ],
        links: [],
        note: "Internal Ubuy tool: architecture described at a high level."
      }
    },
    {
      id: "seo-automation",
      title: "SEO Automation Tools",
      type: "Secondary",
      category: "Automation",
      description: "Built automation for Google and Bing webmaster workflows, plus a Google indexing tool, replacing manual work that took roughly 5 to 6 hours per weekly cycle.",
      tech: ["Python", "Automation"],
      featured: false
    },
    {
      id: "google-ads-automation",
      title: "Google Ads Automation",
      type: "Secondary",
      category: "Automation",
      description: "Built a backend tool that processes the Google Ads Search Terms Report, flags non-performing keywords, and auto-detects negative keywords to cut wasted ad spend and manual weekly auditing.",
      tech: ["Python", "FastAPI", "Pandas"],
      featured: false
    },
    {
      id: "product-research-dash",
      title: "Product Research Dashboard & Scrapers",
      type: "Secondary",
      category: "Automation",
      description: "Built a single-page research dashboard combining SerpAPI, Rainforest API, Google Search Console and GA4, plus product and deals scrapers and a stock-status checker for storefront URLs.",
      tech: ["Python", "SerpAPI", "OpenAI API", "requests/BeautifulSoup", "cloudscraper"],
      featured: false
    },
    {
      id: "keyword-explorer",
      title: "Keyword Explorer [In Progress]",
      type: "Secondary",
      category: "ML",
      description: "Building a keyword research tool on the Google Ads Keyword Planner API and the OpenAI API.",
      tech: ["Python", "Google Ads API", "OpenAI API"],
      featured: false
    },
    {
      id: "medigo",
      title: "MediGo [Academic Project]",
      type: "Secondary",
      category: "ML",
      description: "Pharmacy and healthcare platform combining inventory management, OpenCV-based OCR text extraction and a VGG16 transfer-learning X-ray classifier, with Flask REST APIs on MySQL.",
      tech: ["Python", "Flask", "TensorFlow/Keras", "OpenCV", "MySQL"],
      featured: false
    }
  ],
  skills: [
    {
      category: "LLMs & Agents",
      items: [
        { name: "LLMs" },
        { name: "prompt engineering" },
        { name: "NLP" },
        { name: "OpenAI API" },
        { name: "LangGraph" },
        { name: "MCP" }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Python" },
        { name: "FastAPI" },
        { name: "Pydantic" },
        { name: "Flask" },
        { name: "SQLAlchemy" },
        { name: "Alembic" },
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "basic SQL" }
      ]
    },
    {
      category: "Automation & Scraping",
      items: [
        { name: "Selenium" },
        { name: "Playwright" },
        { name: "requests/BeautifulSoup" },
        { name: "cloudscraper" },
        { name: "Chrome extensions" }
      ]
    },
    {
      category: "Data & ML",
      items: [
        { name: "Pandas" },
        { name: "TensorFlow/Keras" },
        { name: "OpenCV" }
      ]
    },
    {
      category: "DevOps basics",
      items: [
        { name: "Docker" },
        { name: "Docker Compose" },
        { name: "Pytest" },
        { name: "GitHub API" }
      ]
    },
    {
      category: "Frontend (dashboards)",
      items: [
        { name: "Next.js" }
      ]
    }
  ],
  experience: [
    {
      id: "ai-engineer-ubuy",
      role: "AI Engineer",
      company: "Ubuy Technologies",
      period: "Jan 2026 to present",
      description: "Embedded in the digital marketing team. [ADD: what I built as an AI Engineer]",
      sharedText: "Built internal tools including a content generation tool, SEO automation tool, keyword research tool, Google indexing tool, and Chrome extensions for task automation and scraping.",
      projects: []
    },
    {
      id: "ai-intern-ubuy",
      role: "AI Intern",
      company: "Ubuy Technologies",
      period: "Sept to Dec 2025",
      description: "[ADD: what I built as an intern]",
      projects: []
    },
    {
      id: "ubuy-shared-projects",
      role: "Built at Ubuy",
      company: "Internal Tools",
      period: "Sept 2025 to present",
      description: "",
      projects: ["content-gen-tool", "seo-automation-tools", "product-research-dash", "keyword-explorer"]
    },
    {
      id: "education-uem",
      role: "B.Tech in Computer Science",
      company: "University of Engineering and Management, Jaipur",
      period: "2022 to 2026",
      description: "CGPA 8.69/10",
      certifications: ["Python for Data Science (NPTEL)", "Database Management Systems (NPTEL)", "Deep Learning (Infosys)"],
      projects: []
    }
  ],
  achievements: [
    "Top 10 in a college coding competition",
    "3rd position in Algo Master Competition",
    "Active on CodeForces and CodeChef"
  ]
};
