# Landing Page Pattern Library

**Date**: 2026-02-08
**Source**: `/landing-learn --all` — 4 Haiku agents analyzed all live Oracle landing pages
**Status**: v1 — first full extraction

---

## Comparison Table

| Feature | Arthur | Phukhao | Maeon Craft | Thong Pradit |
|---------|--------|---------|-------------|--------------|
| **Domain** | arthur.buildwithoracle.com | phukhao.buildwithoracle.com | maeoncraft.buildwithoracle.com | thongpraditxcatlab.buildwithoracle.com |
| **Astro** | 5.17.1 | 5.17.1 | 5.17.1 | 5.17.1 |
| **Tailwind** | 4.1.18 | 4.1.18 | 4.1.18 | 4.1.18 |
| **React** | 19.2.4 | 19.2.4 | No | No |
| **Nanostores** | 1.1.0 | 1.1.0 | 1.1.0 (theme only) | No |
| **SIWE Auth** | Yes (viem) | Yes (viem) | No | No |
| **Theme Toggle** | No | No | Yes (light/dark) | No |
| **Pages** | 1 (SPA) | 5 | 3 | 9 |
| **Primary Color** | Amber #f59e0b | Cyan #00fff2 | Forest #2d5a27 | Amber #F59E0B |
| **Secondary** | Violet #8b5cf6 | Purple #bf00ff | Amber #d4a03c | Blue #2563EB |
| **Background** | Slate #0f172a | Cyber #0a0a0f | Earth #0a0a07 | Pure Black #000000 |
| **Heading Font** | System default | Orbitron | Inter | Exo |
| **Body Font** | System default | JetBrains Mono | Sarabun | Exo |
| **Thai Font** | — | — | Sarabun | Sarabun |
| **Glass Morphism** | Light (opacity layers) | Heavy (20px blur) | Heavy (20px blur) | Light (3% opacity) |
| **Animations** | Minimal (pulse) | Heavy (scan, glow, float) | Medium (reveal, float) | Heavy (canvas, genie) |
| **Bilingual** | EN only | EN + TH | EN + TH | EN + TH |
| **Audio** | No | Yes (TTS, slides) | No | No |
| **Canvas** | No | No | No | Yes (physics viz) |
| **Worker Name** | arthur-landing | phukhao-landing | maeon-craft-landing | brewing-oracle-landing |
| **CF Account** | a5eabdc2...e | a5eabdc2...e | a5eabdc2...e | a5eabdc2...e |

---

## Common Patterns (Use in Base Template)

### 1. Stack (100% consistent)
- **Astro 5.17.1** — Every page
- **@astrojs/cloudflare 12.6.12** — Every deployment
- **Tailwind CSS 4.1.18** via @tailwindcss/vite
- **TypeScript** — Strict mode
- **Cloudflare Workers** — Same account ID

### 2. Wrangler Config (100% consistent)
```toml
compatibility_date = "2025-06-01"
compatibility_flags = ["nodejs_compat"]
account_id = "a5eabdc2b11aae9bd5af46bd6a88179e"
workers_dev = true
routes = [
  { pattern = "{name}.buildwithoracle.com", custom_domain = true }
]
[assets]
directory = "./dist"
```

### 3. Layout Pattern (100% consistent)
- Base layout wrapping all pages
- `<html>` with proper lang, meta, font loading
- Tailwind imported via global CSS or Vite plugin
- Dark background default (all 4 are dark-first)

### 4. Navigation (100% consistent)
- Fixed top navbar
- Glass morphism styling (blur + semi-transparent)
- Logo + brand on left
- Links on right (hidden on mobile)
- Z-50 stacking

### 5. Hero Section (100% consistent)
- Full-height or near-full-height
- Oracle name prominently displayed
- Tagline/purpose statement
- CTA buttons (typically 2: primary action + source code)
- Visual element (illustration, emoji, or canvas)

### 6. Sections Pattern (100% consistent)
- Bordered sections (border-t/border-b with subtle color)
- Glass cards for content blocks
- Responsive grid (1 col mobile → 2-4 col desktop)
- Heading + content + optional CTA

### 7. Footer (100% consistent)
- Minimal
- Brand name + tagline
- Sometimes family/philosophy reference

### 8. Build Commands (100% consistent)
```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

### 9. Accessibility (75% consistent)
- Semantic HTML heading hierarchy
- WCAG contrast on dark backgrounds
- Phukhao + Maeon Craft + Thong Pradit have `prefers-reduced-motion` support

### 10. Philosophy Section (100% consistent)
- All 4 display the 5 Oracle principles
- Each Oracle reinterprets through their own metaphor
- Numbered cards or list format

---

## Unique Features (Optional Modules)

### SIWE Wallet Auth (Arthur, Phukhao)
- viem + React + Nanostores
- 4 API routes: /api/auth/{nonce,verify,session,logout}
- KV namespace for nonce storage
- JWT for session tokens
- ConnectWallet React component with `client:load`

### Theme Toggle (Maeon Craft only)
- Nanostores atom for theme state
- localStorage persistence
- CSS custom properties for light/dark
- Inline script in `<head>` prevents FOUC

### Audio/TTS (Phukhao only)
- Pre-recorded Thai TTS audio files
- Word-by-word subtitle sync
- Auto-play presentation with slides
- Voice gender toggle (male/female)

### Canvas Physics (Thong Pradit only)
- HTML5 Canvas with requestAnimationFrame
- Particle flow animations
- Black hole River Model visualization
- Interactive controls (sliders, toggles)

### Live Counter (Maeon Craft, Thong Pradit)
- Real-time elapsed time since event
- setInterval(1000) update
- Days:Hours:Minutes:Seconds display

### Genie Navbar (Thong Pradit only)
- Navbar morphs into floating icon on scroll
- CSS keyframe animations (collapse/expand)
- Bouncy cubic-bezier easing

---

## Design Token Ranges

### Color Palettes by Theme

| Theme | Primary | Secondary | Background |
|-------|---------|-----------|------------|
| **Royal/Gold** | #f59e0b (amber) | #8b5cf6 (violet) | #0f172a (slate) |
| **Cyberpunk** | #00fff2 (cyan) | #bf00ff (purple) | #0a0a0f (near-black) |
| **Nature/Craft** | #2d5a27 (forest) | #d4a03c (amber) | #0a0a07 (earth) |
| **Scientific** | #F59E0B (amber) | #2563EB (blue) | #000000 (OLED black) |

### Font Choices

| Category | Options Used |
|----------|-------------|
| **Futuristic** | Orbitron, Exo |
| **Clean Modern** | Inter, System default |
| **Monospace** | JetBrains Mono, Roboto Mono |
| **Thai** | Sarabun (universal choice) |

### Glass Morphism Tokens

```css
/* Standard glass */
background: rgba(10-15, 10-15, 10-15, 0.65-0.70);
backdrop-filter: blur(20px);
border: 1px solid rgba(accent, 0.1-0.2);

/* Light glass */
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Animation Tokens

| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Scroll reveal | 0.6-0.8s | ease-out | Card entrance |
| Float | 4-5s | ease-in-out | Hero illustrations |
| Pulse | 2-3s | ease-in-out | Status indicators |
| Gradient flow | 5-8s | linear | Text gradients |
| Hover | 0.2-0.3s | ease | Interactive elements |

---

## Template Recommendation

### Minimum Viable Landing Page (for any Oracle)
1. Astro 5 + Tailwind 4 + CF Workers
2. Base layout with dark background + font loading
3. Fixed glass navbar (logo + links)
4. Hero section (name + tagline + CTA)
5. Philosophy section (5 principles)
6. Family section (links to siblings)
7. Footer (brand + tagline)
8. wrangler.toml with custom domain

### Optional Modules (add based on Oracle's needs)
- **Auth**: SIWE wallet (needs React + viem)
- **Theme**: Light/dark toggle (needs nanostores)
- **Audio**: TTS narration (needs audio files)
- **Viz**: Canvas-based visualizations
- **Data**: Live counters, tracking pages
- **Bilingual**: Thai/English with Sarabun font

---

## Sources

Each landing page analyzed in detail at:
- `ψ/learn/Arthur-Oracle-AI/arthur-kings-landing/2026-02-08/1257_LANDING-ANALYSIS.md`
- `ψ/learn/Soul-Brews-Studio/phukhao-oracle/2026-02-08/1257_LANDING-ANALYSIS.md`
- `ψ/learn/MaeOn-Lab/maeon-craft-landing/2026-02-08/1257_LANDING-ANALYSIS.md`
- `ψ/learn/laris-co/thong-pradit-brewing-oracle/2026-02-08/1257_LANDING-ANALYSIS.md`
