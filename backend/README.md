# Xtarz Commerce OS — Backend

Agentic commerce research API. Five pipeline stages:

- **Product Discovery** — find winning products
- **Competitor Intel** — analyze market gaps
- **Sourcing** — find suppliers
- **Store Builder** — generate store content
- **Ad Creative** — generate ad copy and hooks

## Start

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

API docs: http://127.0.0.1:8000/docs
