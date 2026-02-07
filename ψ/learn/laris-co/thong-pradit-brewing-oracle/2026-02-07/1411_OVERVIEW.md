# Thong Pradit Brewing Oracle (เสี่ยวเอ้อ / Xiaoer) - Quick Overview

## What Is It?
An AI-powered brewing knowledge system and landing site for Thong Pradit Brewing — a craft beer operation in Chiang Mai, combining brewing science documentation with theoretical physics visualization.

**Live:**
- https://thongpraditxcatlab.buildwithoracle.com
- https://xiaoer.buildwithoracle.com

**Name:** เสี่ยวเอ้อ (Siaw-Er / Xiaoer)
**Born:** 2026-01-28 at ร้านน้ำต้นเฮ้าส์บาร์ (Namton's House Bar), Wat Ket, Chiang Mai
**Brewer:** พี่เอ็ม (Chaiwoot/Thong Pradit)

---

## Directory Structure

```
landing/
├── src/
│   ├── layouts/BaseLayout.astro       # Base HTML template
│   ├── pages/
│   │   ├── index.astro                # Hero page (5 chapters + philosophy)
│   │   ├── about.astro                # About Oracle, Cat Lab, พี่เอ็ม
│   │   ├── blog.astro                 # Blog post listings
│   │   ├── river-model.astro          # Interactive black hole visualization!
│   │   └── brewing/
│   │       ├── index.astro            # Brewing knowledge hub
│   │       ├── yeast.astro            # Yeast library (3 strains)
│   │       ├── batches.astro          # Batch logs (placeholder)
│   │       ├── calculations.astro     # Brewing math (placeholder)
│   │       ├── timeline.astro         # Live batch tracking (placeholder)
│   │       └── yeast/
│   │           ├── pomona.astro       # LalBrew Pomona
│   │           ├── mango-madness.astro# WHC Mango Madness
│   │           └── us-05.astro        # Safale US-05
│   └── styles/global.css             # Tailwind theme (dark OLED + amber)
├── astro.config.mjs                   # Astro + Cloudflare
├── wrangler.toml                      # CF Workers (2 custom domains)
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5.17 (static) |
| Styling | Tailwind CSS 4 |
| Hosting | Cloudflare Pages + Workers |
| Package Manager | Bun |
| Fonts | Exo (headings), Roboto Mono (code), Sarabun (Thai) |

**Note:** No React, no SIWE auth — pure static Astro. Simpler than Arthur/Phukhao.

---

## Pages & Routes (13 total)

| Route | Description |
|-------|-------------|
| `/` | Hero — 5-chapter story + canvas black hole animation |
| `/about` | Oracle identity, Cat Lab, พี่เอ็ม bio |
| `/blog` | Post listings (2 posts) |
| `/river-model` | Interactive Painlevé-Gullstrand black hole viz! |
| `/brewing` | Knowledge hub (1 batch, 3 yeasts, 80% efficiency target) |
| `/brewing/yeast` | Yeast library with comparison table |
| `/brewing/yeast/pomona` | LalBrew Pomona details |
| `/brewing/yeast/mango-madness` | WHC Mango Madness (Thai climate optimized!) |
| `/brewing/yeast/us-05` | Safale US-05 details |
| `/brewing/batches` | Batch logs (placeholder) |
| `/brewing/calculations` | Brewing math formulas (placeholder) |
| `/brewing/timeline` | Live tracking (placeholder) |

---

## Unique Features

### River Model Physics Visualization
- Interactive canvas rendering of spacetime flowing toward a black hole
- Painlevé-Gullstrand coordinates (Hamilton & Lisle, 2008)
- Controls: mass, flow scale, particle density, display toggles
- Light cones, geodesics, velocity vectors, rotating Kerr core
- 150+ particles with trail rendering
- Metaphor: "Fish swimming against a waterfall"

### Brewing Science
- Detailed yeast strain data: biotransformation enzymes (terpenes, β-glucosidase, thiols)
- Temperature management for Thai climate
- Mango Madness: thermotolerant up to 35°C — no temp control needed in Thailand!
- Newton cooling law, dilution math, efficiency calculations

### Bilingual (English + Thai)
- English for technical/scientific content
- Thai for narrative, philosophy, local context
- Sarabun font optimized for Thai script

---

## Visual Design

- **Dark OLED** — Pure black (#000000) backgrounds
- **Amber/Gold accent** (#F59E0B) — brewing warmth
- **Secondary**: Blue (science), Red (event horizon), Emerald (growth)
- **Typography**: Exo (geometric) + Roboto Mono (technical) + Sarabun (Thai)
- Transparent cards with subtle borders, smooth hover transitions

---

## Comparison with Siblings

| Feature | Xiaoer/Thongpradit | Arthur | Phukhao |
|---------|-------------------|--------|---------|
| Theme | Dark + Amber/Gold | Dark + Gold/Amber | Dark + Cyan/Purple |
| Focus | Brewing science + Physics | Disaster monitoring | Teaching demo |
| Unique | River Model viz, Yeast library | API health dashboard | Audio narration |
| Auth | None (pure static) | SIWE wallet | SIWE wallet |
| Stack | Astro only | Astro + React | Astro + React |
| Pages | 13 routes | 1 + API | 5 + API |

---

## Setup

```bash
cd landing && bun install && bun run dev  # http://localhost:3000
```

Deploy: `bun run build && wrangler deploy`

Domains: `thongpraditxcatlab.buildwithoracle.com` + `xiaoer.buildwithoracle.com`
