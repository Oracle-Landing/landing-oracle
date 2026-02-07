# Arthur King's Landing - Quick Overview

## What Is It?
A modern landing page for Arthur Oracle — the first AI oracle agent deployed on New Year's Eve 2025 to monitor Chiang Mai's disaster response, built with Astro, React, Tailwind CSS, and SIWE authentication.

**Live:** https://arthur.buildwithoracle.com

---

## Directory Structure

```
arthur-kings-landing/
├── src/
│   ├── components/          # React components for web3 UI
│   │   ├── ConnectWallet.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ApiStatusTable.tsx
│   ├── pages/               # Astro pages & API routes
│   │   ├── index.astro      # Main landing page
│   │   └── api/auth/        # SIWE auth endpoints
│   ├── stores/              # Nanostores state management
│   │   ├── api.ts           # API monitoring store
│   │   └── auth.ts          # Auth state
│   ├── lib/auth.ts          # SIWE & JWT helpers
│   ├── layouts/Base.astro   # Root layout with navbar
│   └── styles/global.css    # Tailwind theme & animations
├── public/                  # Static assets (favicon, crowned-masks.svg)
├── astro.config.mjs         # Astro + Cloudflare + React + Tailwind
├── wrangler.toml            # Cloudflare Workers config
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5.17 (static + hybrid) |
| UI | React 19, Tailwind CSS 4 |
| Auth | SIWE (Sign-In With Ethereum) via viem |
| State | Nanostores (atoms + maps + computed) |
| Hosting | Cloudflare Pages + Workers |
| Storage | Cloudflare KV (nonces) |
| Package Manager | Bun |

---

## Key Features

### SIWE Authentication
Same pattern as Phukhao — nonce → sign → verify → JWT cookie

### API Health Monitoring
- Background polling of 7 Chiang Mai data sources
- Latency tracking + status caching via Nanostores maps
- Real-time status badges (StatsGrid, ApiStatusTable, StatusBadge)
- Sources: UJIC, CM Command, CMU Press, forest fires, air quality

### Stats
- 39K+ posts indexed across 180+ days
- <50ms average API latency
- 7 active data sources

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Hero landing — Arthur's story, stats, Oracle family links |
| `GET /api/auth/nonce` | Generate SIWE nonce |
| `POST /api/auth/verify` | Verify signature, issue JWT |
| `GET /api/auth/session` | Check session status |
| `POST /api/auth/logout` | Clear session |

---

## Notable Patterns

1. **Hybrid Rendering** — Static HTML + dynamic API routes via `export const prerender = false`
2. **React Islands** — `client:load` hydration for interactive components only
3. **Nanostores Maps** — `apiStatuses` keyed by API ID with computed `onlineCount`, `avgLatency`
4. **Custom JWT** — No library, Web Crypto API HMAC-SHA256 directly
5. **Dark + Gold Theme** — Slate-950 gradient with amber/gold accents (Oracle/divine theme)

---

## Setup

```bash
bun install && bun run dev  # http://localhost:4321
```

Deploy: Push to GitHub → Cloudflare auto-builds. Set `JWT_SECRET` via `wrangler secret put`.

---

## Comparison with Phukhao

| Feature | Arthur | Phukhao |
|---------|--------|---------|
| Theme | Dark + Gold/Amber | Dark + Cyan/Purple |
| Focus | Disaster monitoring APIs | Teaching demo |
| Unique | API health dashboard, StatsGrid | Audio narration, Thai subtitles |
| Shared | SIWE auth, Astro 5, React 19, Nanostores, Cloudflare, viem | Same stack |
