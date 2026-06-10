# Xtarz Commerce OS — Backend

Agentic commerce research API. Five independent agents (no monolithic pipeline):

- **Product Discovery** — find winning products
- **Competitor Intel** — analyze market gaps (import product from Discovery)
- **Sourcing** — find suppliers (import product from Discovery)
- **Ad Creative** — SEO, product copy, tags, ad hooks, UGC, Meta ads (Gemini + Imagen)
- **Store Builder** — uploadable Shopify OS 2.0 theme ZIP

Requires `GOOGLE_API_KEY` in `.env` (see `.env.example`).

## Start

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

API docs: http://127.0.0.1:8000/docs
