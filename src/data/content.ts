export const content = {
  personal: {
    name: "Mohit Sharma",
    role: "AI Engineer",
    tagline: "Engineering Autonomous Systems & Neural Architectures",
    status: {
      text: "Open to work · Full-time · Relocation: India",
      type: "available", // cyan LED
    },
    email: "[ADD EMAIL]",
    github: "https://github.com/mohitvenom",
    linkedin: "https://www.linkedin.com/in/mohit-sharma-aiengineeer/",
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
        { label: "Marketplaces", value: "4 (Amazon, Ubuy, Walmart, eBay)" },
        { label: "Build phases", value: "10" }
      ],
      tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "MCP", "LangGraph", "LLMs", "OpenAI API", "Docker Compose", "Next.js"],
      featured: true,
      caseStudy: {
        problem: "Price and stock changes across marketplaces (Amazon, Ubuy, Walmart, eBay) are easy to miss when checked manually.",
        approach: "An autonomous agent scrapes marketplace product pages on a schedule, stores history in PostgreSQL, and sends Slack alerts on price drops, restocks and stockouts. A LangGraph orchestrator calls tools exposed by an MCP server, gpt-4o-mini writes run summaries, and a Next.js dashboard supports adding products and on-demand runs (Run Now / Check Now).",
        architecture: "Scheduler -> LangGraph orchestrator -> MCP server (scraper tools, DB tools) -> PostgreSQL -> Slack + Next.js dashboard.",
        stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "MCP Python SDK", "LangGraph", "OpenAI gpt-4o-mini", "APScheduler", "Next.js 14", "Docker Compose"],
        keyDecisions: [
          "[ADD DECISION: why an MCP server for scraping and DB tools]",
          "Built in 10 phases; Walmart and eBay scrapers were added after the initial Amazon and Ubuy version."
        ],
        hardProblems: "[ADD BUG STORY]",
        outcome: "[ADD METRIC]",
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
        keyDecisions: "[ADD DECISION: how the sandbox is isolated]",
        hardProblems: "[ADD BUG STORY]",
        outcome: "[ADD METRIC]",
        links: [
          { text: "GitHub", url: "[ADD REPO LINK]" },
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
      tech: ["Python", "FastAPI", "LangGraph", "OpenAI API", "SerpAPI", "PostgreSQL", "LLMs"],
      featured: true,
      caseStudy: {
        problem: "SEO content for category, brand and blog pages needs research from several sources before writing.",
        approach: "A full-stack tool that gathers research from SerpAPI, Reddit (PRAW) and the YouTube Data API, then uses GPT-4o-mini to generate SEO content for category, brand and blog pages.",
        architecture: "Research sources (SerpAPI, Reddit, YouTube) -> aggregation -> LLM generation -> SEO content output.",
        stack: ["Python", "FastAPI", "GPT-4o-mini", "SerpAPI", "PRAW", "YouTube Data API"],
        keyDecisions: "[ADD DECISION]",
        hardProblems: "[ADD BUG STORY]",
        outcome: "[ADD METRIC]",
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
