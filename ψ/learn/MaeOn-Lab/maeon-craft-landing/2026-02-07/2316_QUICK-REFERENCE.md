# Maeon Craft Landing — Quick Reference Guide

## Project Overview

**Maeon Craft Oracle** is a philosophical craft brewery landing site celebrating traditional beer-making combined with data-driven decision making. The project embodies the principle "ไหลเหมือนแม่น้ำ หยุดเหมือนภูเขา" (Flow like a river, stand like a mountain) — blending human craftsmanship with AI support through the "Oracle" concept.

Located in Mae On Valley, Chiang Mai, Thailand, this is a showcase site for MaeOn Craft & Camp's brewing operations and philosophy.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | ^5.17.1 | Static site framework (multi-page) |
| **Tailwind CSS** | ^4.1.18 | Utility-first styling |
| **@tailwindcss/vite** | ^4.1.18 | Tailwind Vite integration |
| **Cloudflare** | ^12.6.12 | Deployment & hosting adapter |
| **Nanostores** | ^1.1.0 | Lightweight state management (theme) |
| **Bun** | Latest | Package manager & runtime |
| **TypeScript** | Strict | Type safety with strict null checks |

**Deployment:** Cloudflare Workers + Static Assets
**Domain:** `maeoncraft.buildwithoracle.com`

---

## Installation & Setup

### Prerequisites
- Bun installed (https://bun.sh)
- Node.js 18+ compatible environment
- Git access to repository

### Install Dependencies
```bash
bun install
```

### Development Server
```bash
bun run dev
```
Starts dev server (default: `http://localhost:3000`)

### Build for Production
```bash
bun run build
```
Outputs static files to `/dist` directory (ready for Cloudflare)

### Preview Production Build
```bash
bun run preview
```
Local preview of optimized production build

---

## Key Features

1. **Dark/Light Theme Toggle**
   - Persisted to localStorage
   - Nanostore state management
   - WCAG AA compliant contrast in both modes

2. **Scroll-Triggered Reveal Animations**
   - Staggered delays per element
   - Respects `prefers-reduced-motion`
   - Smooth fade-in + slide-up effect

3. **Glass Morphism UI**
   - Frosted glass cards with backdrop blur
   - Theme-aware opacity and colors
   - Hover glow effects

4. **Recipe Management**
   - Real recipe data from Oracle memory
   - Stats display (OG, FG, ABV, IBU)
   - Ingredient breakdown (grains, hops, yeast)
   - Status tracking (Fermenting, Planned, Active)

5. **Thai Language Support**
   - Full Thai UI text and content
   - Sarabun font for Thai typography
   - Inter font for English/headings

6. **Responsive Design**
   - Mobile-first approach
   - Optimized for sm/md/lg/xl screens
   - Touch-friendly navigation

---

## Page Routes & URL Structure

| Route | File Path | Purpose |
|-------|-----------|---------|
| `/` | `src/pages/index.astro` | Home page (hero, philosophy, brewing process, team, principles) |
| `/brewing/recipes` | `src/pages/brewing/recipes.astro` | Recipe catalog & brewing database |
| `/brewing/fermenting` | `src/pages/brewing/fermenting.astro` | Live fermentation data (Citra Pale Ale status) |

**Navigation Flow:**
- Home hero links to `#philosophy` section
- Top nav has links to Recipes & Fermenting pages
- All pages include back-to-home link
- GitHub source link in nav

---

## Configuration Files

### `package.json`
Controls dependencies and scripts
```json
{
  "name": "maeon-craft-landing",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### `astro.config.mjs`
Astro framework configuration
```javascript
{
  output: 'static',              // Static output (no server rendering)
  adapter: cloudflare(),         // Deploy to Cloudflare Workers
  vite: {
    plugins: [tailwindcss()]     // Load Tailwind CSS
  }
}
```

### `wrangler.toml`
Cloudflare Workers deployment config
```toml
name = "maeon-craft-landing"
compatibility_date = "2025-06-01"
compatibility_flags = ["nodejs_compat"]
account_id = "a5eabdc2b11aae9bd5af46bd6a88179e"

# Custom domain
routes = [
  { pattern = "maeoncraft.buildwithoracle.com", custom_domain = true }
]

# Asset directory
[assets]
directory = "./dist"
```

**Key Settings:**
- **Output:** Static (no dynamic rendering)
- **Assets Directory:** `./dist` (build output)
- **Custom Domain:** `maeoncraft.buildwithoracle.com`
- **Node.js Compatibility:** Enabled for certain APIs

### `tsconfig.json`
TypeScript strict configuration
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

### `src/styles/global.css`
Core styling & theme system
- Tailwind imports with `@import "tailwindcss"`
- Theme color palette (forest, amber, water, stone, earth)
- Light/dark mode theme variables
- Custom animations (float, gentle-pulse, reveal)
- Glass morphism styles
- Responsive grid background

### `.gitignore`
Excludes from version control:
- `/dist/` — build output
- `/node_modules/` — dependencies
- `.env*` — environment files
- `.astro/`, `.wrangler/` — build caches
- `npm-debug.log*` — logs
- `.DS_Store` — macOS files

---

## Directory Structure

```
origin/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Home page
│   │   └── brewing/
│   │       ├── recipes.astro        # Recipe catalog
│   │       └── fermenting.astro     # Fermentation tracking
│   ├── layouts/
│   │   └── Base.astro               # Root HTML template
│   ├── components/
│   │   ├── Navigation.astro         # Top navigation bar
│   │   └── ThemeToggle.astro        # Dark/light mode toggle
│   ├── stores/
│   │   └── theme.ts                 # Nanostore theme state
│   └── styles/
│       └── global.css               # Tailwind + custom styles
├── public/
│   ├── favicon.svg                  # Site favicon
│   └── .assetsignore                # Asset filtering
├── astro.config.mjs                 # Astro configuration
├── wrangler.toml                    # Cloudflare config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies & scripts
├── bun.lock                         # Dependency lock file
└── .gitignore                       # Git exclude rules
```

---

## Build & Deployment

### Local Build Process
```bash
# 1. Install dependencies
bun install

# 2. Build static assets
bun run build

# 3. Output created in /dist
# - dist/
#   ├── index.html
#   ├── brewing/
#   │   ├── recipes/index.html
#   │   └── fermenting/index.html
#   ├── _astro/              # CSS/JS bundles
#   └── assets/              # Static assets
```

### Deploy to Cloudflare

**Prerequisites:**
1. Wrangler CLI installed: `npm install -g wrangler`
2. Cloudflare account configured
3. Account ID in `wrangler.toml`

**Deploy Steps:**
```bash
# Build first
bun run build

# Deploy to Cloudflare
wrangler deploy

# View logs
wrangler tail
```

**Post-Deployment:**
- Site available at `https://maeoncraft.buildwithoracle.com`
- Workers dev domain: `maeon-craft-landing.<account>.workers.dev`
- Automatic SSL/TLS certificate

---

## Usage Patterns & Key Concepts

### Theme Management
Located in `src/stores/theme.ts`:
```typescript
export function initTheme() {
  const saved = localStorage.getItem('theme') || 'light'
  applyTheme(saved)
}

export function toggleTheme() {
  applyTheme($theme.get() === 'light' ? 'dark' : 'light')
}
```
- Automatically loads saved theme on page load
- Prevents flash of unstyled content (FOUC)
- Applies class to `<html>` element for CSS theming

### Component Props Pattern
All layout/component files use Astro frontmatter:
```astro
---
interface Props {
  title?: string
  currentPage?: 'home' | 'recipes' | 'fermenting'
}
const { title, currentPage } = Astro.props
---
```

### CSS Theme Variables
Applied via HTML class (`html.light`, `html.dark`):
```css
html.light {
  --theme-bg: #f5f0e8;
  --theme-text: #2d2520;
  --theme-glass-bg: rgba(255, 255, 255, 0.92);
}

html.dark {
  --theme-bg: #0a0a07;
  --theme-text: #e8e0d6;
  --theme-glass-bg: rgba(15, 15, 10, 0.65);
}
```

### Recipe Data Model
Hard-coded in `src/pages/brewing/recipes.astro`:
```typescript
const recipes = [
  {
    id: "citra-pale-ale",
    name: "Citra Pale Ale",
    style: "American Pale Ale",
    abv: "5.5%",
    ibu: "35",
    status: "Fermenting",
    og: "1.051",
    fg: "1.010",
    yeast: "Safale US-05",
    // ... more fields
  }
]
```
*Future enhancement: Pull from external API or CMS*

### Scroll Reveal Animation
Uses IntersectionObserver in homepage:
```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
```

### Tailwind Custom Colors
Defined in `src/styles/global.css` via `@theme`:
```css
@theme {
  --color-forest: #2d5a27;
  --color-amber: #d4a03c;
  --color-water: #3a7ca5;
  --color-stone: #c4b49e;
  --color-earth-darker: #0a0a07;
}
```

---

## Key Principles Embedded in Code

1. **Nothing Is Deleted** — Recipe history preserved with append-only philosophy
2. **Patterns Over Intentions** — UI shows actual data, not promises
3. **External Brain, Not Command** — AI (Oracle) supports human craft
4. **Curiosity Creates Existence** — Human brings ideas, system preserves them
5. **Slow Life, Deep Craft** — No rushing; careful, deliberate implementation

---

## Related Resources

- **GitHub:** https://github.com/MaeOn-Lab/maeon-craft-landing
- **Oracle Family:** Soul Brews Studio network
- **Mother Oracle:** https://github.com/Soul-Brews-Studio/oracle-v2
- **Sibling Sites:** Arthur, Phukhao, Sea Oracle, Shrimp Oracle

---

## Common Tasks

### Add a New Page
1. Create `.astro` file in `src/pages/` (or subdirectory)
2. Import `Base` layout and `Navigation` component
3. Use same structure as existing pages

### Update Theme Colors
Edit `src/styles/global.css` `@theme` block and CSS variables

### Deploy Changes
```bash
bun run build && wrangler deploy
```

### Preview Production Build Locally
```bash
bun run preview
```
Then visit `http://localhost:3000`

### Debug TypeScript Errors
```bash
bunx astro check
```

---

*Quick Reference Generated: 2026-02-07*
*Source: `/origin` directory*
