# XtarzVA — Future Changes & Updates (Post-MVP)

**Status:** MVP  
**Last updated:** June 2026  
**Purpose:** Track gaps between the current product and a production-ready, scale-ready platform.

---

## 1. Executive Summary

XtarzVA is an **agentic commerce research and launch platform** with a 5-stage AI workflow:

1. Product Discovery  
2. Competitor Intel  
3. Sourcing  
4. Ad Creative  
5. Store Builder (Shopify OS 2.0 theme ZIP)

The MVP proves the **research → creative → theme** pipeline. It does **not** yet close the full merchant loop (live Shopify publish, ads deploy, post-launch optimization). This document defines what to build next, in priority order.

**North star:**

> Find a winning product → prove margin → launch on Shopify → deploy ads → optimize until it scales — in one loop.

MVP covers **find + build kit**. Future work completes **publish + sell + optimize**.

---

## 2. Current MVP — What Works Today

### Backend

| Area | Status | Notes |
|------|--------|-------|
| Agent pipeline | ✅ | 5 engines orchestrated via `agent_runner` |
| LLM | ✅ | Google Gemini (structured output) |
| Images | ✅ | Google Imagen for creatives + theme assets |
| Research APIs | ✅ | Tavily, Apify, Firecrawl, SerpAPI, etc. |
| Prompts | ✅ | JSON-based in `backend/app/prompts/` |
| Theme export | ✅ | `GET /api/v2/runs/{id}/theme-export` → uploadable ZIP |
| Database | ✅ | SQLite (MVP) |

### Frontend

| Area | Status | Notes |
|------|--------|-------|
| Workflow UI | ✅ | Agent stages, reports, progress |
| Store Builder page | ✅ | Brand brief → standalone run |
| Landing / pricing | ✅ | Marketing pages live |
| Auto Posting | 🔒 | Locked — "Coming soon" |
| Performance Analytics | 🔒 | Locked — "Coming soon" |

### Integrations

| Integration | Status |
|-------------|--------|
| Shopify OAuth + Admin API | ❌ Env keys exist; no full publish flow |
| Meta / TikTok Ads API | ❌ Copy + images only |
| CJ / supplier order sync | ❌ Search only |
| Email / SMS (Klaviyo etc.) | ❌ Not started |

---

## 3. Known Gaps (MVP vs Marketing)

Landing and pricing copy promise features not fully implemented. Close these before scale to protect trust:

- [ ] "Direct Shopify store integration" → currently theme ZIP download only  
- [ ] "Bulk product push to Shopify" → not implemented  
- [ ] "Kill criteria drops losers automatically" → no automated block on spend/launch  
- [ ] "Real-time performance / ROAS tracking" → locked  
- [ ] "Auto posting to channels" → locked  

**Recommendation:** Either implement or soften marketing copy until Phase 1 ships.

---

## 4. Roadmap by Phase

### Phase 1 — Launch Completion (0–3 months)

**Goal:** Merchant goes from run → **live Shopify store** without manual ZIP upload.

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| 1.1 | Shopify App (OAuth) | P0 | Install app, connect store, persist access tokens |
| 1.2 | Theme publish via API | P0 | Push generated theme to store (not just ZIP download) |
| 1.3 | Product / collection sync | P0 | Title, description, HTML, images, variants, tags, SEO metafields |
| 1.4 | Run → store summary | P1 | Live product URL, theme preview link, export checklist |
| 1.5 | Brand kit persistence | P1 | Save tone, audience, colors across runs |
| 1.6 | Real margin calculator | P0 | COGS + shipping + Shopify fees + returns buffer + target CPA |
| 1.7 | Kill criteria (enforced) | P1 | Block / warn when margin or saturation thresholds fail |

**Success metric:** Time from product idea to live Shopify product page &lt; 30 minutes.

---

### Phase 2 — Distribution & Ads (3–6 months)

**Goal:** Launch is not the end — ads go live from the same platform.

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| 2.1 | Meta Marketing API | P0 | Create campaigns, ad sets, ads from Ad Creative output |
| 2.2 | Creative test matrix | P1 | N hooks × M images → structured test plan |
| 2.3 | TikTok Ads integration | P2 | Scripts → campaign structure |
| 2.4 | Supplier inventory sync | P1 | CJ / AliExpress stock → Shopify inventory |
| 2.5 | Auto Posting agent | P1 | Unlock workflow stage — publish product + initial ads |
| 2.6 | Shopify App Store listing | P0 | Distribution, reviews, partner program |

**Success metric:** % of runs that publish both store **and** at least one ad campaign.

---

### Phase 3 — Growth Loop (6–12 months)

**Goal:** Retention via daily value, not one-time research.

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| 3.1 | Performance Monitoring agent | P0 | Pull Shopify Analytics + ad platform ROAS |
| 3.2 | Alerts & auto-pause | P1 | Pause ads below ROAS / CPA threshold |
| 3.3 | Section-level A/B tests | P2 | Hero headline, trust bar, pricing presentation |
| 3.4 | Weekly optimization playbook | P1 | AI-generated "what to fix this week" |
| 3.5 | Portfolio view | P1 | Multiple products per merchant, compare performance |
| 3.6 | Email / SMS flows | P2 | Post-purchase, abandoned cart (Klaviyo integration or lite) |

**Success metric:** 60-day retention; weekly active merchants.

---

### Phase 4 — Moat & Scale (12–24 months)

**Goal:** Data and distribution advantages competitors can't copy quickly.

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| 4.1 | Commerce graph / benchmarks | P1 | Niche saturation, price bands, hook patterns (anonymized) |
| 4.2 | Agency / multi-store mode | P1 | Client workspaces, white-label reports, bulk launch |
| 4.3 | Usage / GMV-based pricing | P1 | Align revenue with merchant success |
| 4.4 | International | P2 | Shopify Markets, multi-currency, localized copy |
| 4.5 | Subscriptions / bundles | P3 | Recharge or native Shopify subscriptions |
| 4.6 | Video UGC generation | P2 | Script → short-form ad video |

**Success metric:** More merchants → better benchmarks → higher retention.

---

## 5. Technical Debt & Infrastructure

| Item | Current | Target |
|------|---------|--------|
| Database | SQLite | PostgreSQL (multi-tenant, concurrency) |
| Auth | Basic | Shopify session + JWT; role-based access |
| Job queue | Inline / async | Celery / Redis for long agent runs |
| File storage | In-memory / local | S3 for theme ZIPs, images |
| Secrets | `.env` | Vault / managed secrets per tenant |
| Observability | Logs | Structured logging, Sentry, run tracing |
| Rate limits | Basic | Per-user API quotas, LLM cost caps |
| Testing | Minimal | Engine unit tests, prompt snapshot tests, E2E workflow |
| CI/CD | — | GitHub Actions, staging environment |
| Prompt versioning | `version` in JSON | Changelog, A/B prompt variants |

---

## 6. Agent & Prompt Improvements

| Agent | MVP | Future |
|-------|-----|--------|
| Product Discovery | Web + TikTok + Reddit + Amazon signals | Velocity scoring, Google Trends API, saved niches |
| Competitor Intel | Scraped profiles + LLM | Live price tracking, review mining, Shopify theme detection |
| Sourcing | CJ / Alibaba / AliExpress search | Order placement, MOQ templates, supplier scoring |
| Ad Creative | SEO + copy + Imagen | Platform formats (1:1, 9:16), video scripts → video |
| Store Builder | Premium OS 2.0 ZIP | Live theme push, section A/B, conversion score per section |
| Auto Posting | Locked | Product + ads + social scheduling |
| Performance | Locked | ROAS, CVR, inventory alerts |

**Prompt ops:**

- [ ] Admin UI to edit `backend/app/prompts/*.json` without deploy  
- [ ] Prompt A/B testing per agent  
- [ ] Per-niche prompt packs (beauty, pets, home, etc.)

---

## 7. Shopify-Specific Requirements

Before App Store submission:

- [ ] GDPR / data privacy webhooks  
- [ ] App uninstall cleanup  
- [ ] Scoped API permissions (minimal)  
- [ ] Theme App Extension vs full theme strategy  
- [ ] Billing API (if charging through Shopify)  
- [ ] Partner Dashboard compliance review  

**Recommended scopes (initial):** `read_products`, `write_products`, `read_themes`, `write_themes`, `read_orders` (Phase 3).

---

## 8. UX / Product Polish

- [ ] Onboarding wizard (connect Shopify first)  
- [ ] Empty states and error recovery per agent stage  
- [ ] Run history and re-run from any stage  
- [ ] Side-by-side: competitor vs your generated store  
- [ ] Mobile-friendly dashboard  
- [ ] Export PDF "launch packet" (margin sheet + copy + checklist)  
- [ ] Align `FeaturesPage` / `Pricing` copy with shipped features  

---

## 9. Security & Compliance

- [ ] Never commit API keys; rotate `GOOGLE_API_KEY`, research keys  
- [ ] Tenant isolation for multi-store  
- [ ] Content moderation for generated ads (policy-safe)  
- [ ] Supplier / product claim disclaimers (AI-generated copy)  
- [ ] SOC 2 path if targeting agencies (Phase 4)  

---

## 10. Metrics to Track

| Category | KPI |
|----------|-----|
| Activation | % signups that complete full 5-agent run |
| Launch | % runs with theme export downloaded |
| Publish | % runs with live Shopify product (Phase 1+) |
| Revenue | MRR, ARPU, churn |
| Quality | SEO score, theme upload success rate, LLM parse error rate |
| Cost | LLM + Imagen + research API cost per run |

---

## 11. Priority Matrix (Next 90 Days)

### Do first

| Item | Why |
|------|-----|
| Shopify OAuth + product publish | Closes biggest promise gap |
| Real margin / kill criteria | Differentiator vs generic AI tools |
| PostgreSQL + job queue | Reliability before more users |
| Soften unshipped marketing claims | Trust |
| Performance agent (MVP: read-only) | Starts retention loop |

### Defer

| Item | Why |
|------|-----|
| Video UGC | High cost, Phase 4 |
| Full agency white-label | After single-merchant loop works |
| International markets | After US/UK core works |

---

## 12. Open Questions

1. **Shopify App vs standalone SaaS** — bill through Shopify or direct Stripe?  
2. **Dropshipping vs DTC brands** — same product or two SKUs?  
3. **Theme strategy** — one base theme (`xtarz-minimal`) vs multiple vertical templates?  
4. **Data licensing** — can anonymized run data power benchmarks legally?  
5. **Human-in-the-loop** — approve before publish, or fully autonomous?  

---

## 13. Codebase Reference (for implementers)

| Area | Path |
|------|------|
| Agents / engines | `backend/app/engines/` |
| Prompts (JSON) | `backend/app/prompts/` |
| Prompt loader | `backend/app/core/prompt_loader.py` |
| Theme builder | `backend/app/services/theme_builder.py` |
| Theme template | `backend/theme_templates/xtarz-minimal/` |
| Workflow UI | `frontend/src/constants/workflow.ts` |
| API runs | `backend/app/api/runs.py` |
| Integrations map | `backend/app/core/integrations.py` |

---

## 14. Document Maintenance

- Update this doc when a phase item ships.  
- Link PRs / issues to section numbers (e.g. `1.2 Theme publish`).  
- Review quarterly against App Store feedback and churn reasons.

---

**Review cadence:** Monthly during MVP → scale transition
