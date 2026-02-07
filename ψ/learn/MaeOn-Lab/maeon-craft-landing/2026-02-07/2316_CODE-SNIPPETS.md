# Maeon Craft Landing - Code Snippets & Analysis

**Date:** 2026-02-07
**Project:** MaeOn Craft Oracle Landing Page
**Tech Stack:** Astro 5.17.1, Tailwind CSS 4.1.18, Nanostores 1.1.0, TypeScript
**Framework:** Static site generation with Cloudflare adapter

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Main Entry Point](#main-entry-point)
3. [Layout & Components](#layout--components)
4. [Theme System (Nanostores)](#theme-system-nanostores)
5. [Styling Approach](#styling-approach)
6. [Page Components](#page-components)
7. [Notable Patterns & Idioms](#notable-patterns--idioms)

---

## Architecture Overview

This is an **Astro-based static site** with the following characteristics:

- **Output Mode:** Static generation (no server)
- **Adapter:** Cloudflare Pages
- **Styling:** Tailwind CSS 4.x via Vite plugin
- **State Management:** Nanostores for theme persistence
- **Language:** TypeScript with strict null checking
- **Theme Support:** Dual light/dark mode with CSS custom properties

**Key Files:**
- `astro.config.mjs` - Build configuration
- `src/pages/` - Route pages (index, recipes, fermenting)
- `src/layouts/Base.astro` - Root HTML layout
- `src/components/` - Reusable UI components
- `src/stores/theme.ts` - Global theme state
- `src/styles/global.css` - Design tokens & custom utilities

---

## Main Entry Point

### `astro.config.mjs` - Build Configuration

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  }
});
```

**What it does:**
- Configures Astro to produce static HTML
- Registers Tailwind CSS 4 as a Vite plugin (replaces PostCSS config)
- Uses Cloudflare adapter for deployment
- Enables TypeScript checking with `// @ts-check`

### `package.json` - Dependencies

```json
{
  "name": "maeon-craft-landing",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.6.12",
    "@tailwindcss/vite": "^4.1.18",
    "astro": "^5.17.1",
    "nanostores": "^1.1.0",
    "tailwindcss": "^4.1.18"
  }
}
```

**Tech Stack Rationale:**
- Minimal dependencies (only essential tools)
- Nanostores chosen for lightweight state management (no Redux/Zustand overhead)
- Tailwind CSS 4 with Vite for fast builds
- Cloudflare for edge deployment

---

## Layout & Components

### `src/layouts/Base.astro` - Root Layout with Theme Initialization

```astro
---
import '../styles/global.css'

interface Props {
  title?: string
  description?: string
}

const {
  title = 'Maeon Craft Oracle — Craftsmanship with Data',
  description = 'Slow Life Nature + Technical AI + Craftsmanship — MaeOn Craft & Camp, แม่ออน, เชียงใหม่'
} = Astro.props
---

<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />

    <!-- Google Fonts: Inter (English) + Sarabun (Thai) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Sarabun:wght@300;400;500;700&display=swap" rel="stylesheet">

    <title>{title}</title>

    <!-- Prevent FOUC: apply theme class before first paint -->
    <script is:inline>
      (function() {
        var t = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.add(t);
      })();
    </script>
  </head>
  <body class="min-h-screen antialiased nature-grid">
    <slot />

    <!-- Initialize nanostore theme state -->
    <script>
      import { initTheme } from '../stores/theme';
      initTheme();
    </script>
  </body>
</html>
```

**Key Features:**
- **Dual Font System:** Inter (technical/English), Sarabun (organic/Thai)
- **FOUC Prevention:** Inline script runs before render to avoid theme flash
- **Lazy Init:** Nanostores initialize after page load (safe for Astro static)
- **Nature Grid:** CSS background pattern (see styling section)
- **Custom Props:** Title & description templated per-page

---

### `src/components/Navigation.astro` - Fixed Header Navigation

```astro
---
import ThemeToggle from './ThemeToggle.astro'

interface Props {
  currentPage?: 'home' | 'recipes' | 'fermenting' | 'timeline'
}
const { currentPage = 'home' } = Astro.props
---

<nav class="fixed top-4 left-4 right-4 z-50 glass rounded-2xl border border-forest/20">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-3 group cursor-pointer">
      <svg class="w-7 h-7 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <!-- Beer mug icon SVG -->
      </svg>
      <span class="text-xl font-bold text-gradient-flow">Maeon Craft</span>
    </a>

    <!-- Navigation Links -->
    <div class="flex items-center gap-1 sm:gap-2 text-sm">
      <a href="/brewing/recipes"
         class:list={["px-3 py-2 rounded-lg transition-colors cursor-pointer hidden sm:block",
           currentPage === 'recipes' ? "text-amber bg-amber/10" : "text-stone-light/70 hover:text-amber hover:bg-amber/5"]}>
        Recipes
      </a>
      <a href="/brewing/fermenting"
         class:list={["px-3 py-2 rounded-lg transition-colors cursor-pointer hidden sm:block",
           currentPage === 'fermenting' ? "text-forest-light bg-forest/10" : "text-stone-light/70 hover:text-amber hover:bg-amber/5"]}>
        Fermenting
      </a>
      <a href="https://github.com/MaeOn-Lab/maeon-craft-landing"
         class="ml-2 px-4 py-2 glass rounded-lg hover-glow text-forest-light cursor-pointer hidden sm:flex items-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">...</svg>
        SOURCE
      </a>
      <ThemeToggle />
    </div>
  </div>
</nav>
```

**Pattern: Dynamic Classes**
Uses Astro's `class:list` directive for conditional styling:
```astro
class:list={[
  "base-classes",
  currentPage === 'recipes' ? "active-state" : "inactive-state"
]}
```

---

### `src/components/ThemeToggle.astro` - Light/Dark Theme Toggle

```astro
---
// ThemeToggle — sun/moon toggle button
// Uses nanostores $theme atom to stay in sync
---

<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle light/dark theme"
  class="p-2 rounded-lg transition-colors duration-200 hover:bg-forest/10 text-stone-muted hover:text-amber cursor-pointer"
>
  <!-- Sun icon (shown in dark mode → click to go light) -->
  <svg id="icon-sun" class="w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"/>
    <!-- ... sun rays ... -->
  </svg>

  <!-- Moon icon (shown in light mode → click to go dark) -->
  <svg id="icon-moon" class="w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>

<script>
  import { $theme, toggleTheme } from '../stores/theme';

  function updateIcons(theme: string) {
    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    if (!sun || !moon) return;

    if (theme === 'dark') {
      sun.classList.remove('hidden');
      moon.classList.add('hidden');
    } else {
      sun.classList.add('hidden');
      moon.classList.remove('hidden');
    }
  }

  // Set initial icon state
  updateIcons($theme.get());

  // Subscribe to theme changes
  $theme.subscribe(updateIcons);

  // Toggle on click
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
</script>
```

**Pattern: Reactive UI with Nanostores**
- Gets initial state via `$theme.get()`
- Subscribes to changes with `$theme.subscribe(callback)`
- Calls `toggleTheme()` to trigger updates
- Icons shown/hidden via class toggle (no heavy re-renders)

---

## Theme System (Nanostores)

### `src/stores/theme.ts` - Global Theme State

```typescript
import { atom } from 'nanostores'

export type Theme = 'light' | 'dark'
export const $theme = atom<Theme>('light')

export function initTheme() {
  const saved = localStorage.getItem('theme') as Theme | null
  applyTheme(saved || 'light')
}

export function toggleTheme() {
  applyTheme($theme.get() === 'light' ? 'dark' : 'light')
}

function applyTheme(theme: Theme) {
  $theme.set(theme)
  localStorage.setItem('theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.classList.toggle('light', theme === 'light')
}
```

**Design Patterns:**
1. **Single Source of Truth:** `$theme` atom holds all state
2. **Persistence:** localStorage saves theme preference
3. **DOM Sync:** CSS classes on `<html>` enable conditional styling
4. **Pure Functions:** `initTheme()` and `toggleTheme()` have clear contracts

**How It Works:**
- `initTheme()` called once at page load
- Reads saved preference from localStorage
- Sets `dark` or `light` class on `<html>` element
- All CSS custom properties respond to these classes

---

## Styling Approach

### `src/styles/global.css` - Design Tokens & Custom Utilities

```css
@import "tailwindcss";

/* ── Color Palette (Tailwind 4 @theme) ── */
@theme {
  --color-forest: #2d5a27;
  --color-forest-light: #4a8c3f;
  --color-forest-dark: #1a3518;
  --color-amber: #d4a03c;
  --color-amber-light: #e8c468;
  --color-amber-dark: #b8842a;
  --color-water: #3a7ca5;
  --color-water-light: #5ba3d9;
  --color-stone: #c4b49e;
  --color-stone-light: #d8cdb8;
  --color-stone-muted: #9a8a74;
  --color-earth-dark: #0f0f0a;
  --color-earth-darker: #0a0a07;
}

/* ── Theme-Specific CSS Custom Properties ── */
html.light {
  --theme-bg: #f5f0e8;
  --theme-text: #2d2520;
  --theme-glass-bg: rgba(255, 255, 255, 0.92);
  --theme-glass-border: rgba(45, 90, 39, 0.18);
  --theme-nature-grid-1: rgba(45, 90, 39, 0.05);
}

html.dark {
  --theme-bg: #0a0a07;
  --theme-text: #e8e0d6;
  --theme-glass-bg: rgba(15, 15, 10, 0.65);
  --theme-glass-border: rgba(45, 90, 39, 0.15);
  --theme-nature-grid-1: rgba(45, 90, 39, 0.03);
}

/* ── Base Styles ── */
html {
  scroll-behavior: smooth;
}

body {
  background: var(--theme-bg);
  color: var(--theme-text);
  line-height: 1.6;
}

/* ── Nature Grid Background ── */
.nature-grid {
  background-image:
    linear-gradient(var(--theme-nature-grid-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--theme-nature-grid-2) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Glass Cards (Frosted Glass Effect) ── */
.glass {
  background: var(--theme-glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--theme-glass-border);
}

.glass-amber {
  background: var(--theme-glass-amber-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--theme-glass-amber-border);
}

html.dark .glass,
html.dark .glass-amber {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Light mode: layered natural shadow for depth */
html.light .glass,
html.light .glass-amber {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 12px 32px rgba(45, 90, 39, 0.04);
}

/* ── Gradient Text ── */
.gradient-text-nature {
  background: linear-gradient(135deg, #4a8c3f, #d4a03c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Animated flow gradient for logo */
.text-gradient-flow {
  background: linear-gradient(90deg, #4a8c3f, #d4a03c, #3a7ca5, #4a8c3f);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 8s linear infinite;
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

/* ── Animations ── */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.float {
  animation: float 5s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.gentle-pulse {
  animation: gentle-pulse 3s ease-in-out infinite;
}

/* ── Scroll-Triggered Reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }

/* ── Accessibility ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}

a:focus-visible, button:focus-visible {
  outline: 2px solid #4a8c3f;
  outline-offset: 2px;
}
```

**Styling Patterns:**

1. **Tailwind @theme:** Defines custom color palette (Tailwind 4 feature)
2. **CSS Custom Properties:** Light/dark theme variants via `--theme-*` variables
3. **Frosted Glass:** `backdrop-filter: blur(20px)` + semi-transparent background
4. **Gradient Animation:** Infinite flowing gradient for visual interest
5. **Scroll Reveal:** `.reveal` + JS observer for entrance animations
6. **WCAG Compliance:** Focus-visible rings, reduced-motion respects

---

## Page Components

### `src/pages/index.astro` - Hero Landing Page (Excerpt)

```astro
---
import Base from '../layouts/Base.astro'
import Navigation from '../components/Navigation.astro'
---

<Base>
  <Navigation currentPage="home" />
  <main class="relative pt-20">

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <!-- Background gradients -->
      <div class="absolute inset-0 bg-gradient-to-b from-earth-darker via-[#0f120a] to-earth-darker"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-forest/5 via-transparent to-transparent"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-forest/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl"></div>

      <div class="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-20">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="space-y-8">
            <!-- Pill Badge -->
            <div class="inline-flex items-center gap-3 px-4 py-2 glass rounded-full">
              <span class="w-2 h-2 bg-forest-light rounded-full gentle-pulse"></span>
              <span class="text-sm text-forest-light tracking-wider">Slow Life Oracle</span>
            </div>

            <!-- Headline: Multi-color -->
            <h1 class="space-y-3">
              <span class="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                <span class="text-white">Maeon</span> <span class="gradient-text-nature">Craft</span>
              </span>
              <span class="block text-2xl sm:text-3xl text-stone/90 font-light">
                Craftsmanship with Data
              </span>
            </h1>

            <!-- Thai Philosophy -->
            <p class="text-lg sm:text-xl text-stone-muted leading-relaxed max-w-xl">
              <span class="text-amber glow-text-amber">ไหลเหมือนแม่น้ำ หยุดเหมือนภูเขา</span><br/>
              <span class="text-stone">Craftsmanship with Data</span>
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4">
              <a href="#philosophy" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-forest to-forest-light rounded-xl font-bold text-white hover:from-forest-light hover:to-forest">
                <svg class="w-5 h-5">...</svg>
                Explore Philosophy
              </a>
              <a href="https://github.com/MaeOn-Lab/maeon-craft-landing" class="inline-flex items-center gap-2 px-8 py-4 glass rounded-xl font-bold text-forest-light hover-glow">
                <svg class="w-5 h-5">...</svg>
                View Source
              </a>
            </div>
          </div>

          <!-- Hero Illustration: Beer Mug -->
          <div class="relative flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-forest/20 to-amber/20 rounded-3xl blur-2xl"></div>
              <div class="relative glass-amber rounded-3xl p-10 sm:p-12">
                <div class="text-center space-y-6">
                  <div class="float">
                    <svg class="w-32 h-32 sm:w-40 sm:h-40 mx-auto text-amber" viewBox="0 0 24 24">
                      <!-- Beer mug SVG -->
                    </svg>
                  </div>
                  <div class="text-sm text-stone-muted">
                    <div>MaeOn Craft & Camp</div>
                    <div class="text-amber mt-1">แม่ออน, เชียงใหม่</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy Cards Section -->
    <section id="philosophy" class="relative py-24 border-y border-forest/10">
      <div class="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div class="text-center mb-16 reveal">
          <h2 class="text-sm text-forest-light tracking-[0.3em] mb-4">PHILOSOPHY</h2>
          <p class="text-3xl sm:text-4xl font-bold text-white">ปรัชญาของช่างฝีมือ</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div class="glass rounded-2xl p-8 hover-glow text-center reveal reveal-delay-1">
            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-water/20 to-water-light/10 flex items-center justify-center">
              <!-- Water icon -->
            </div>
            <h3 class="text-xl font-bold text-amber mb-3">ไหลเหมือนแม่น้ำ</h3>
            <p class="text-stone leading-relaxed">Flow like a river. Adapt to change. Let data guide the current. Never force — observe and respond.</p>
          </div>
          <!-- More philosophy cards... -->
        </div>
      </div>
    </section>

  </main>

  <!-- Scroll reveal observer -->
  <script>
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
  </script>
</Base>
```

**Key Pattern: Intersection Observer for Scroll Reveal**

Uses native browser API for entrance animations without heavy libraries:

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
```

This triggers `.reveal.visible` CSS class when elements enter viewport, enabling fade-in + slide-up animations.

---

### `src/pages/brewing/recipes.astro` - Recipe Cards with Data

```astro
---
import Base from '../../layouts/Base.astro'
import Navigation from '../../components/Navigation.astro'

// Real recipe data from Maeon Craft Oracle (ψ/memory/recipes/)
const recipes = [
  {
    id: "citra-pale-ale",
    name: "Citra Pale Ale",
    style: "American Pale Ale",
    abv: "5.5%",
    ibu: "35",
    status: "Fermenting",
    description: "Single-hop Citra bomb — tropical fruit aroma (orange, mango, passion fruit). All Citra hops with a 120g whirlpool at 80°C for maximum aroma. Brewed on Hopcat 65L system.",
    og: "1.051",
    fg: "1.010",
    yeast: "Safale US-05",
    hops: "Citra (120g whirlpool + 15.5g boil)",
    grains: "Inter Pale Malt (5.45kg), Caramunich I (250g)",
    batchSize: "25L",
    brewDate: "2026-01-31",
    brewer: "Toto (โตโต้)",
    notes: "Workshop brew day กับ Toto — OG hit target 1.051 ✅"
  }
];

const statusColors: Record<string, string> = {
  "Active": "bg-forest/20 text-forest-light border-forest/30",
  "Fermenting": "bg-water/20 text-water-light border-water/30",
  "Planned": "bg-stone/20 text-stone-muted border-stone/30",
};
---

<Base title="Recipes — Maeon Craft Oracle">
  <Navigation currentPage="recipes" />
  <main class="relative pt-24 pb-16 min-h-screen">
    <div class="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">

      <div class="mb-12">
        <p class="text-amber text-sm font-medium tracking-widest mb-4">NOTHING IS DELETED</p>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Recipes</h1>
        <p class="text-stone text-lg max-w-2xl">
          ทุกสูตรถูกบันทึก — ทั้งสูตรที่สำเร็จและที่กำลังทดลอง ล้วนเป็นครู
        </p>
      </div>

      <!-- Recipe Cards -->
      <div class="space-y-6">
        {recipes.map((recipe) => (
          <div class="glass-amber rounded-2xl p-6 sm:p-8 hover-glow transition-all">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-amber">{recipe.name}</h2>
                <p class="text-stone-muted text-sm">
                  {recipe.brewDate} &bull; {recipe.style}
                  {recipe.brewer && <span> &bull; Brewer: {recipe.brewer}</span>}
                </p>
              </div>
              <span class:list={["px-4 py-1.5 text-sm rounded-full border", statusColors[recipe.status] || "bg-stone/20 text-stone"]}>
                {recipe.status}
              </span>
            </div>

            <p class="text-stone mb-6 leading-relaxed">{recipe.description}</p>

            <!-- Stats Grid: OG, FG, ABV, IBU -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div class="bg-earth-darker/50 rounded-lg p-3">
                <p class="text-stone-muted text-xs mb-1">OG</p>
                <p class="text-lg font-mono text-amber">{recipe.og}</p>
              </div>
              <div class="bg-earth-darker/50 rounded-lg p-3">
                <p class="text-stone-muted text-xs mb-1">FG</p>
                <p class="text-lg font-mono text-stone">{recipe.fg}</p>
              </div>
              <div class="bg-earth-darker/50 rounded-lg p-3">
                <p class="text-stone-muted text-xs mb-1">ABV</p>
                <p class="text-lg font-mono text-amber">{recipe.abv}</p>
              </div>
              <div class="bg-earth-darker/50 rounded-lg p-3">
                <p class="text-stone-muted text-xs mb-1">IBU</p>
                <p class="text-lg font-mono text-stone">{recipe.ibu}</p>
              </div>
            </div>

            <!-- Ingredients: Grains, Hops, Yeast -->
            <div class="grid sm:grid-cols-3 gap-3 mb-4">
              <div class="bg-earth-darker/30 rounded-lg p-3">
                <p class="text-forest-light text-xs mb-1">Grains</p>
                <p class="text-stone text-sm">{recipe.grains}</p>
              </div>
              <div class="bg-earth-darker/30 rounded-lg p-3">
                <p class="text-forest-light text-xs mb-1">Hops</p>
                <p class="text-stone text-sm">{recipe.hops}</p>
              </div>
              <div class="bg-earth-darker/30 rounded-lg p-3">
                <p class="text-forest-light text-xs mb-1">Yeast</p>
                <p class="text-stone text-sm">{recipe.yeast}</p>
              </div>
            </div>

            <p class="text-stone-muted text-sm">{recipe.notes}</p>

            {recipe.status === "Fermenting" && (
              <a href="/brewing/fermenting" class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-forest/10 border border-forest/30 text-forest-light text-sm rounded-lg hover:bg-forest/20 transition-colors cursor-pointer">
                View Live Fermentation &rarr;
              </a>
            )}
          </div>
        ))}
      </div>

    </div>
  </main>
</Base>
```

**Pattern: Data-Driven Template**

Uses `.map()` over array of recipe objects to generate cards. Status color mapping via `Record<string, string>` type for maintainability.

---

### `src/pages/brewing/fermenting.astro` - Live Fermentation Counter

```astro
---
import Base from '../../layouts/Base.astro'
import Navigation from '../../components/Navigation.astro'

const batch = {
  id: "citra-pale-ale",
  name: "Citra Pale Ale",
  brewDate: "2026-01-31",
  og: "1.051",
  targetFg: "1.010",
  abv: "5.5%",
  yeast: "Safale US-05",
  brewer: "Toto (โตโต้)",
  team: ["Toto", "Nat", "Oracle"],
  fermentationSchedule: {
    day0: "Pitch US-05 @ 18°C — OG 1.051 confirmed ✅",
    day1_3: "Active fermentation @ 18°C — CO2 bubbling",
    day7: "Mid-fermentation — peak activity expected",
    day10: "Gravity check — approaching target FG 1.010",
    day14: "Final gravity check — fermentation complete",
    package: "Cold crash → keg or bottle → carbonate 2.4 CO2-vol"
  }
};

const milestones = [
  { day: 0, date: "2026-01-31", status: "done", label: "Brew day + pitch", detail: "OG 1.051" },
  { day: 7, date: "2026-02-07", status: "active", label: "Mid-fermentation", detail: "Day 7 — peak activity" },
  { day: 10, date: "2026-02-10", status: "upcoming", label: "FG check", detail: "Approaching 1.010?" },
  { day: 14, date: "2026-02-14", status: "upcoming", label: "Fermentation complete", detail: "Ready for packaging" },
];
---

<Base title="Fermenting: Citra Pale Ale">
  <Navigation currentPage="fermenting" />
  <main class="relative pt-24 pb-16 min-h-screen">
    <div class="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">

      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">{batch.name}</h1>

      <!-- Live Counter + Stats -->
      <div class="grid md:grid-cols-2 gap-6 mb-12">
        <!-- Day Counter: Updates live via JavaScript -->
        <div class="glass rounded-2xl p-8 flex flex-col items-center justify-center" id="live-counter-box" data-brew-date={batch.brewDate}>
          <p id="current-day" class="text-7xl md:text-8xl font-black text-forest-light tabular-nums">—</p>
          <p class="text-forest-light/60 text-lg font-medium tracking-widest mt-1">DAYS</p>
          <div class="mt-4 flex gap-3 text-center">
            <div>
              <p id="live-hours" class="text-2xl font-bold text-forest-light tabular-nums">--</p>
              <p class="text-forest-light/40 text-xs">HRS</p>
            </div>
            <p class="text-forest-light/20 text-2xl">:</p>
            <div>
              <p id="live-mins" class="text-2xl font-bold text-forest-light tabular-nums">--</p>
              <p class="text-forest-light/40 text-xs">MIN</p>
            </div>
            <p class="text-forest-light/20 text-2xl">:</p>
            <div>
              <p id="live-secs" class="text-2xl font-bold text-amber tabular-nums">--</p>
              <p class="text-amber/40 text-xs">SEC</p>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3">
          <div class="glass-amber rounded-xl p-4 text-center">
            <p class="text-2xl font-mono text-amber">{batch.og}</p>
            <p class="text-stone-muted text-xs mt-1">OG</p>
          </div>
          <!-- More stat cards... -->
        </div>
      </div>

      <!-- Milestones Timeline -->
      <div class="mb-12">
        <h2 class="text-xl font-bold text-white mb-6">Fermentation Milestones</h2>
        <div class="space-y-3">
          {milestones.map((m) => (
            <div class="glass rounded-xl p-5 flex items-center gap-5">
              <span class:list={["px-3 py-1.5 text-xs rounded-full border font-mono shrink-0",
                m.status === "done" ? "bg-forest/20 text-forest-light border-forest/30" :
                m.status === "active" ? "bg-amber/20 text-amber border-amber/30" :
                "bg-stone/10 text-stone-muted border-stone/20"
              ]}>
                Day {m.day}
              </span>
              <div class="flex-1">
                <p class="text-white font-medium">{m.label}</p>
                <p class="text-stone-muted text-sm">{m.detail}</p>
              </div>
              <p class="text-stone-muted text-xs shrink-0">{m.date}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </main>

  <!-- Live Counter JavaScript -->
  <script>
    const box = document.getElementById('live-counter-box');
    const brewDateStr = box?.dataset.brewDate;

    const update = () => {
      if (!brewDateStr) return;
      // Parse brew date in Asia/Bangkok timezone
      const brew = new Date(brewDateStr + 'T15:00:00+07:00');
      const now = new Date();
      const diffMs = now.getTime() - brew.getTime();
      const totalSecs = Math.max(0, Math.floor(diffMs / 1000));

      const days = Math.floor(totalSecs / 86400);
      const rem = totalSecs % 86400;
      const hrs = Math.floor(rem / 3600);
      const mins = Math.floor((rem % 3600) / 60);
      const secs = rem % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');

      const dayEl = document.getElementById('current-day');
      const hrsEl = document.getElementById('live-hours');
      const minsEl = document.getElementById('live-mins');
      const secsEl = document.getElementById('live-secs');

      if (dayEl) dayEl.textContent = `${days}`;
      if (hrsEl) hrsEl.textContent = pad(hrs);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    };

    update();
    setInterval(update, 1000); // Update every second
  </script>
</Base>
```

**Pattern: Live Counter**

Uses `setInterval()` to update elapsed time since brew date:
- Stores brew date as data attribute: `data-brew-date="2026-01-31"`
- Calculates difference in milliseconds
- Updates DOM every 1 second with formatted time
- Uses `font-mono` + `tabular-nums` for smooth digit transitions

---

## Notable Patterns & Idioms

### 1. **Astro Components vs Client Scripts**

```astro
<!-- Server-side rendering (Astro component) -->
---
const items = await fetchData(); // Runs at build time
---
<div>
  {items.map(item => <ItemCard item={item} />)}
</div>

<!-- Client-side interactivity (script tag) -->
<script>
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
</script>
```

**Philosophy:** Use Astro for static/SEO content, use `<script>` for interactive elements. Keeps bundle size minimal.

---

### 2. **Class Binding with `class:list`**

```astro
<!-- Cleaner than string concatenation -->
<div class:list={[
  "base-classes px-4 py-2 rounded",
  isActive ? "bg-amber text-white" : "bg-stone/10 text-stone"
]}>
  Content
</div>
```

**Benefit:** Type-safe, readable condition handling. Works with objects too:

```astro
class:list={[
  { "active": isActive },
  { "disabled": isDisabled }
]}
```

---

### 3. **Nanostores for Minimal State**

```typescript
// store.ts
import { atom } from 'nanostores'

export const $theme = atom<'light' | 'dark'>('light')
export const $count = atom(0)

// component.ts
import { $theme } from './store'

$theme.subscribe(theme => {
  console.log('theme changed:', theme)
})

$theme.set('dark')
```

**Why Nanostores?**
- Tiny (~1KB)
- No Context API boilerplate
- Works in Astro static generation
- Simple atoms (no redux-style reducers)

---

### 4. **Intersection Observer for Scroll Reveal**

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.1,           // Trigger when 10% visible
    rootMargin: '0px 0px -40px 0px' // Offset bottom by -40px
  }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
```

**CSS Animation Pair:**
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Benefit:** No animation library needed. Smooth entrance animations. Respects `prefers-reduced-motion`.

---

### 5. **CSS Custom Properties for Theming**

```css
/* Define tokens once */
html.light {
  --theme-bg: #f5f0e8;
  --theme-glass-bg: rgba(255, 255, 255, 0.92);
}

html.dark {
  --theme-bg: #0a0a07;
  --theme-glass-bg: rgba(15, 15, 10, 0.65);
}

/* Use everywhere */
body {
  background: var(--theme-bg);
}

.glass {
  background: var(--theme-glass-bg);
}
```

**Advantages:**
- Single source of truth
- No CSS-in-JS overhead
- Instant theme switching (no re-render)
- Works without JavaScript

---

### 6. **Glass Morphism Pattern**

```css
.glass {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 90, 39, 0.18);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

**Key Ingredients:**
- Semi-transparent background (92% opacity = visible but blurred)
- `backdrop-filter: blur(20px)` (frosted glass effect)
- Subtle border (color tone-on-tone)
- Soft shadow for depth

---

### 7. **Gradient Text with Background Clip**

```css
.gradient-text-nature {
  background: linear-gradient(135deg, #4a8c3f, #d4a03c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**How It Works:**
1. Create gradient as background
2. Clip background to text shape with `background-clip: text`
3. Make text transparent so gradient shows through
4. `-webkit-` prefix for Safari support

---

### 8. **Tailwind 4 @theme Tokens**

```css
@import "tailwindcss";

@theme {
  --color-forest: #2d5a27;
  --color-forest-light: #4a8c3f;
  --color-amber: #d4a03c;
}
```

**Benefit:** Integrates custom colors into Tailwind's entire system. Use via `text-forest`, `bg-amber`, etc.

---

## Summary

This Maeon Craft landing page demonstrates:

- **Minimal, focused tech stack** (Astro + Tailwind + Nanostores)
- **Dual theme system** with zero JavaScript overhead
- **Scroll-triggered animations** using native browser APIs
- **Data-driven templates** with Astro's `.map()` pattern
- **Accessible interactive elements** (focus states, reduced motion)
- **Rich gradient/glass design** using modern CSS features
- **Thai + English typography** with intentional font choices
- **Live counter** for fermentation progress tracking
- **Static site performance** optimized for Cloudflare edge

**File Structure:**
```
src/
├── pages/
│   ├── index.astro              (Hero landing)
│   └── brewing/
│       ├── recipes.astro        (Recipe catalog)
│       └── fermenting.astro     (Live fermentation)
├── layouts/
│   └── Base.astro               (HTML + theme init)
├── components/
│   ├── Navigation.astro         (Fixed nav bar)
│   └── ThemeToggle.astro        (Light/dark toggle)
├── stores/
│   └── theme.ts                 (Nanostores state)
└── styles/
    └── global.css               (Design tokens & utilities)
```

**Key Takeaways for Other Projects:**
- Use CSS custom properties + `class` toggle for themes (no library needed)
- Intersection Observer is plenty for scroll animations
- Astro components + minimal client scripts = fast, SEO-friendly sites
- Nanostores works great for simple state management
- Design with accessibility from the start (focus states, motion preferences)
