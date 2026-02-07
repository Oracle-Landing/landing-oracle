# Maeon Craft Oracle Landing Page — Architecture Document

**Project**: Maeon Craft Oracle Landing Page
**Date**: 2026-02-07
**Framework**: Astro 5.17.1
**Deployment**: Cloudflare Workers (via @astrojs/cloudflare adapter)
**Status**: Static HTML output with client-side interactivity

---

## Overview

The Maeon Craft Oracle landing page is a static-generated Astro site deployed to Cloudflare Workers. It showcases the philosophical intersection of traditional craftsmanship (beer brewing) and data-driven AI decision-making. The site features rich visual storytelling, dark/light theme support, and interactive fermentation tracking for the Citra Pale Ale brew.

**Core Philosophy**: "Flow like a river, stand like a mountain — Craftsmanship with Data"

---

## Directory Structure & Organization

```
maeon-craft-landing/origin/
├── src/
│   ├── components/              # Reusable Astro components
│   │   ├── Navigation.astro     # Fixed nav bar with theme toggle
│   │   └── ThemeToggle.astro    # Sun/moon icon button (uses nanostores)
│   ├── layouts/
│   │   └── Base.astro          # Root HTML layout with meta tags, fonts, theme init
│   ├── pages/                   # File-based routing (Astro convention)
│   │   ├── index.astro         # Landing page (home)
│   │   └── brewing/
│   │       ├── recipes.astro   # Beer recipes catalog
│   │       └── fermenting.astro # Live fermentation tracker
│   ├── stores/
│   │   └── theme.ts            # Nanostores theme state management
│   └── styles/
│       └── global.css          # Tailwind + custom CSS (theme variables, animations)
├── public/
│   ├── favicon.svg             # Beer mug icon
│   └── .assetsignore           # Asset filtering rules
├── astro.config.mjs            # Astro configuration (Cloudflare adapter)
├── wrangler.toml               # Cloudflare Workers deployment config
├── tsconfig.json               # TypeScript strict mode config
├── package.json                # Dependencies & scripts
└── bun.lock                    # Lock file (using Bun as package manager)
```

---

## Entry Points

### 1. **HTML Entry**: `src/layouts/Base.astro`
- Root layout wrapping all pages
- Initializes theme from localStorage before first paint (FOUC prevention)
- Imports `global.css` (Tailwind + custom theme styles)
- Loads Google Fonts (Inter, Sarabun) via CDN
- Sets up meta tags (OG, viewport, description)
- Inits nanostores theme state via `initTheme()` script

### 2. **Pages** (File-based routing):
- `/` → `src/pages/index.astro` (landing page)
- `/brewing/recipes` → `src/pages/brewing/recipes.astro` (recipe catalog)
- `/brewing/fermenting` → `src/pages/brewing/fermenting.astro` (fermentation tracker)

### 3. **Client-Side Scripts**:
- **Theme init**: Inline script in `<head>` that reads localStorage and applies theme class
- **Scroll reveal observer**: Inline script in `index.astro` using IntersectionObserver to animate sections
- **Live counter**: Inline script in `fermenting.astro` that updates fermentation elapsed time every second

---

## Core Abstractions & Component Relationships

### Component Hierarchy

```
Base.astro (root layout)
├── global.css (styles imported)
└── <slot /> (page content)
    ├── Navigation.astro
    │   └── ThemeToggle.astro (nested component)
    └── Main content (per-page)
        ├── Hero section
        ├── Philosophy cards
        ├── Brewing process cards
        ├── Team cards
        ├── Core principles list
        ├── Oracle family links
        └── Footer
```

### Key Abstractions

#### 1. **Theme System** (`src/stores/theme.ts`)
```typescript
export type Theme = 'light' | 'dark'
export const $theme = atom<Theme>('light')  // Nanostores atom

// Core functions:
- initTheme()    // Read localStorage, apply initial theme
- toggleTheme()  // Switch light ↔ dark
- applyTheme()   // Internal: update atom, localStorage, and DOM classList
```

**Pattern**: Reactive state via nanostores + localStorage persistence + DOM class manipulation

#### 2. **CSS Theme Variables** (`src/styles/global.css`)
Dynamic color/styling swapped at `:root` level:
```css
html.light {
  --theme-bg: #f5f0e8;              /* Cream background */
  --theme-glass-bg: rgba(255,255,255,0.92);
  /* etc. */
}

html.dark {
  --theme-bg: #0a0a07;              /* Nearly black */
  --theme-glass-bg: rgba(15,15,10,0.65);
  /* etc. */
}
```

#### 3. **Glass Card Pattern**
```css
.glass {
  background: var(--theme-glass-bg);
  backdrop-filter: blur(20px);       /* Frosted glass effect */
  border: 1px solid var(--theme-glass-border);
}

.glass-amber {
  /* Same as .glass but with amber/warm accent tints */
}
```

#### 4. **Tailwind v4 Color Palette** (in `global.css`)
- **Forest**: `#2d5a27` (nature, growth)
- **Amber**: `#d4a03c` (craft, warmth, beer)
- **Water**: `#3a7ca5` (flow, fermentation)
- **Stone**: `#c4b49e` (earth, craft materials)
- **Earth**: `#0a0a07` to `#0f0f0a` (dark background)

#### 5. **Data-Driven Components**
- **Recipes page**: Static array of recipe objects with brewing metadata
- **Fermenting page**: Live timeline + milestones + calculated elapsed time counter

---

## Dependencies (package.json & Lock File)

### Production Dependencies
```json
{
  "@astrojs/cloudflare": "^12.6.12",  // Cloudflare Workers adapter
  "@tailwindcss/vite": "^4.1.18",     // Tailwind CSS v4 Vite plugin
  "astro": "^5.17.1",                 // Static site generator
  "nanostores": "^1.1.0"              // Tiny reactive state library
  "tailwindcss": "^4.1.18"            // Utility-first CSS framework
}
```

### Build & Deploy Tools
- **Astro CLI**: `astro dev | build | preview`
- **Bun**: Package manager (lock file: `bun.lock`)
- **Wrangler**: Cloudflare Workers CLI (via wrangler.toml)

### No External Runtime Dependencies
- ✗ No React, Vue, Svelte, or other frameworks
- ✗ No build-time plugins beyond Tailwind
- Astro handles template syntax + component bundling

---

## Build System & Deployment

### Build Configuration (`astro.config.mjs`)

```javascript
export default defineConfig({
  output: 'static',                    // Pre-render all pages to HTML
  adapter: cloudflare(),               // Cloudflare Workers adapter
  vite: {
    plugins: [tailwindcss()]           // Integrate Tailwind CSS
  }
});
```

**Output Mode**: `static`
- All routes pre-rendered at build time
- No server-side rendering
- All dynamic updates are client-side only (theme toggle, scroll reveal)

### Deployment Configuration (`wrangler.toml`)

```toml
name = "maeon-craft-landing"
compatibility_date = "2025-06-01"
compatibility_flags = ["nodejs_compat"]
account_id = "a5eabdc2b11aae9bd5af46bd6a88179e"
workers_dev = true

# Custom domain routing
routes = [
  { pattern = "maeoncraft.buildwithoracle.com", custom_domain = true }
]

# Asset serving
[assets]
directory = "./dist"
```

**Deployment Target**: Cloudflare Workers (serverless edge platform)
- **Assets**: Served from `./dist/` directory (built by Astro)
- **Custom Domain**: `maeoncraft.buildwithoracle.com`
- **Runtime**: Node.js compatibility enabled

### Build & Serve Commands

```bash
npm run dev       # Local dev: astro dev (hot reload)
npm run build     # Production: astro build → ./dist/
npm run preview   # Preview built site locally
npm run astro     # Direct astro CLI access
```

**Build Output**: `./dist/`
- All `.astro` files compiled to `.html`
- Assets minified & fingerprinted
- Ready for Cloudflare Workers serving

---

## Key Design Patterns Used

### 1. **Astro Islands Architecture**
- Server-rendered static HTML for SEO (all `.astro` components)
- Minimal client-side JavaScript (only interactive features)
- **Interactive zones** (islands):
  - Theme toggle button
  - Scroll reveal observer
  - Live fermentation counter

### 2. **Theme Switching via CSS Variables + DOM Classes**
- **Pattern**: CSS Custom Properties (CSS Variables) + class toggles
- **Benefit**: No page reload needed, instant visual feedback
- **Implementation**:
  1. Store current theme in nanostores atom
  2. Persist to localStorage
  3. Toggle `html.light` / `html.dark` classes
  4. CSS overrides apply via `html.light selector` / `html.dark selector`

### 3. **Scroll-Triggered Animations (Reveal Pattern)**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');  // Triggers CSS transition
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
```

**Pattern**: Vanilla JS IntersectionObserver API
- No animation library needed
- Respects `prefers-reduced-motion` setting
- Adds `.visible` class to trigger CSS transitions

### 4. **Color Semantics & Theming**
- **Forest Green**: Represents growth, patience, mountain stillness
- **Amber**: Craft, beer, warmth, human creativity
- **Water**: Flow, fermentation, data streams
- **Stone**: Earth, foundation, traditional materials

**Each color has 2-3 variants** (base, light, dark) for depth & accessibility

### 5. **Layout Patterns**
- **Hero Section**: Full viewport, gradient overlays, floating animations
- **Card Grid**: 2-3 column responsive layouts (glass morphism cards)
- **Typography Hierarchy**: Sarabun (Thai serif) + Inter (sans-serif)
- **Spacing**: Consistent 24px/28px vertical rhythm

### 6. **Data Structures** (Static Content)
- **Recipe data**: Array of objects with brew metadata (OG, FG, ABV, IBU, timeline)
- **Timeline events**: Chronological array traced from LINE chat + Oracle memory
- **Milestones**: Progress states (done, active, upcoming) with dates

### 7. **Accessibility Features**
- WCAG AA contrast ratios (light mode text darkened)
- Focus-visible outlines on all interactive elements
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)
- `prefers-reduced-motion` support (disables animations)
- Alt text on SVG icons (via `aria-label`)
- Proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`)

### 8. **Responsive Design**
- Mobile-first Tailwind classes (`sm:`, `md:`, `lg:`)
- Flexible grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Hidden elements for mobile (`hidden sm:block`)
- Readable on 320px (mobile) to 2560px (ultrawide)

### 9. **Performance Optimizations**
- Static pre-rendering (no runtime JS overhead)
- CSS-only animations (no animation library)
- Font subsetting & async loading (Google Fonts)
- Inline critical CSS (theme init prevents FOUC)
- Zero external API calls (all content static)

### 10. **Code Organization**
- **File-based routing** (Astro convention)
- **Component reusability** (Navigation, ThemeToggle)
- **Centralized styles** (single global.css)
- **Centralized state** (theme.ts as source of truth)
- **Type safety** (TypeScript strict mode)

---

## Architecture Decisions & Rationales

### Why Astro?
- **Pros**:
  - Static output (fast, cheap, CDN-friendly)
  - Component-based (DRY, maintainable)
  - Integrates with Tailwind out-of-box
  - Cloudflare adapter built-in
  - Minimal JavaScript sent to client
- **Cons**: Framework lock-in, limited runtime flexibility

### Why Nanostores (not Context API/Redux)?
- **Pros**:
  - Minimal (~1KB gzipped)
  - Framework-agnostic
  - Perfect for single-use case (theme)
  - Works in `.astro` files with `@ts-check` workarounds
- **Cons**: Overkill for small state; could use localStorage API directly

### Why Tailwind v4?
- **Pros**:
  - Zero config (theme defined in CSS `@theme` block)
  - Vite plugin speeds up dev
  - Custom color palette (forest, amber, water, stone)
  - Responsive utilities built-in
- **Cons**: Large output if not purged (Astro handles this)

### Why Cloudflare Workers?
- **Pros**:
  - Global edge network (low latency)
  - Built-in asset serving
  - Free tier suitable for landing page
  - Wrangler CLI integration
- **Cons**: Vendor lock-in, limited runtime (no Node.js modules)

---

## Static Content & Data Flow

### Landing Page (`index.astro`)
- **Content**: Philosophy, brewing process, team, principles, oracle family
- **Data Source**: Hardcoded JSX/HTML (no CMS)
- **Interactivity**: Scroll reveal animations, theme toggle
- **Routes**: Anchor links (`#philosophy`, `#brewing`, `#team`)

### Recipes Page (`recipes.astro`)
- **Content Source**: Static array in component frontmatter
- **Example Recipes**: 1 active (Citra Pale Ale), 10 planned
- **Data Fields**: Name, style, ABV, IBU, OG, FG, grains, hops, yeast, notes, status
- **No API calls**: All data baked in at build time

### Fermenting Page (`fermenting.astro`)
- **Content Source**: Batch object + timeline array in frontmatter
- **Real Data**: Traced from LINE chat + Oracle memory
- **Live Counter**: Client-side JavaScript calculates elapsed days/hours/minutes/seconds
- **Milestones**: 4-step progress (day 0, 7, 10, 14)
- **Timeline Table**: 13 brew day events from 2026-01-27 to 2026-01-31

---

## Client-Side Interactivity

### Theme Toggle System
1. User clicks sun/moon button → `ThemeToggle.astro` script fires
2. `toggleTheme()` → `applyTheme()`
3. Nanostores atom updated → localStorage persisted
4. DOM classes toggled: `html.light` ↔ `html.dark`
5. CSS rules reapply theme variables
6. Icon visibility updated (sun/moon swap)

**Zero page reload**: Entire theme switch is instant

### Scroll Reveal Animations
1. Observer watches elements with `.reveal` class
2. When 10% visible, adds `.visible` class
3. CSS transition triggers: opacity 0→1, transform translateY(24px)→0
4. 0.1s-0.3s staggered delay per element (`.reveal-delay-1/2/3`)

**Performance**: Uses IntersectionObserver (efficient, native)

### Live Fermentation Counter
```javascript
// Updates every 1 second
const diffMs = now.getTime() - brew.getTime();
days = Math.floor(diffMs / 86400);
hours = Math.floor((diffMs % 86400) / 3600);
// ... minutes, seconds
```

**Timezone**: Brew date hardcoded as `2026-01-31T15:00:00+07:00` (Bangkok time)

---

## Type Safety & Configuration

### TypeScript (`tsconfig.json`)
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

**Strict Mode Enabled**:
- No implicit `any`
- Null/undefined checking required
- Better IDE autocompletion

### Component Props (Typed Interfaces)
```typescript
// Base.astro
interface Props {
  title?: string
  description?: string
}

// Navigation.astro
interface Props {
  currentPage?: 'home' | 'recipes' | 'fermenting' | 'timeline'
}
```

---

## Security & Content Integrity

### No External Scripts
- ✗ No Google Analytics, Sentry, Mixpanel, etc.
- ✗ No third-party widgets or embeds
- Only Google Fonts CDN (static resources)

### No User Input Processing
- ✗ No forms, contact endpoints, API calls
- All content static and pre-rendered
- Theme preference stored client-side only (localStorage)

### Content Validation
- All recipe/timeline data hardcoded (typed)
- No dynamic content injection
- No template interpolation vulnerabilities

---

## Maintenance & Future Extensibility

### How to Add Content
1. **New page**: Create `.astro` file in `src/pages/`
2. **New recipe**: Add object to recipes array in `recipes.astro`
3. **New component**: Create `.astro` file in `src/components/`, import in pages
4. **New style**: Add class to `global.css` or use Tailwind utilities

### How to Update Deployment
```bash
# Local test
npm run build
npm run preview

# Deploy
wrangler deploy
```

### How to Modify Theme Colors
Edit `@theme` block in `src/styles/global.css`:
```css
@theme {
  --color-forest: #2d5a27;
  /* ... */
}
```

Then use Tailwind utilities: `text-forest`, `bg-forest-light`, `border-forest-dark`

---

## Performance Metrics & Optimization

### What's Included
- **Critical Path**: Minimal CSS (Tailwind purged), 0 render-blocking JS
- **Fonts**: Preconnect + async load (no FOUT/FOUC)
- **Images**: None (all SVG icons)
- **Third-party**: None (Google Fonts only)

### Estimated Performance
- **First Contentful Paint (FCP)**: <1.5s (Cloudflare edge)
- **Largest Contentful Paint (LCP)**: <2s
- **Cumulative Layout Shift (CLS)**: 0 (no dynamic elements above fold)
- **Time to Interactive (TTI)**: <2.5s

### No JavaScript Performance Impact
- Theme toggle: <5ms
- Scroll observer: <1ms per event
- Live counter: <1ms per second update

---

## Related Ecosystem

### Oracle Family
The landing page is part of a larger "Oracle Network":
- **Mother Oracle**: Central data & decision engine
- **Arthur**: Another Oracle instance
- **Phukhao**: Another Oracle instance
- **Sea Oracle**: Ocean/marine focused
- **Shrimp Oracle**: Aquaculture focused
- **Maeon Craft** (this site): Brewing + craftsmanship focus

All instances share philosophical principles: "Nothing Is Deleted", "Patterns Over Intentions", "External Brain Not Command", etc.

---

## Summary

**Maeon Craft Oracle** is a lean, philosophy-driven landing page that exemplifies:
- **Performance**: Static generation, minimal JS
- **Accessibility**: WCAG AA contrast, semantic HTML
- **Maintainability**: Component-based, typed, single responsibility
- **User Experience**: Instant theme switching, smooth animations, responsive design
- **Philosophy Alignment**: Data-driven craft, human-AI partnership, slow life principles

The architecture prioritizes **content clarity** and **user experience** over complexity, using battle-tested web standards (Tailwind, Astro, vanilla JS) without unnecessary abstraction layers.
