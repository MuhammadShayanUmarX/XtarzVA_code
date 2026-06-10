# XtarzVA

Agentic commerce research and launch platform — product discovery, competitor intel, sourcing, store builder, and ad creative agents.

## Stack

- **Backend:** FastAPI, SQLite, Groq LLM, Tavily/Apify/Firecrawl research APIs
- **Frontend:** React, Vite, TypeScript

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # add your API keys
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5174` (Vite proxies `/api` → backend).

## Roadmap

Post-MVP features, phases, and technical debt are tracked in [docs/FUTURE_CHANGES_AND_UPDATES.md](docs/FUTURE_CHANGES_AND_UPDATES.md).
