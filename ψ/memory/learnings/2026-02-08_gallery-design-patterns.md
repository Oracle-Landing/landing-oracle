# Gallery Design Patterns for Oracle Landing Pages

**Date**: 2026-02-08
**Source**: Building gallery.buildwithoracle.com
**Tags**: design, gallery, screenshots, ux, iteration

## Key Lessons

### 1. Data First, Decoration Never
Don't build a hero section for a registry/gallery page. The content IS the hook. Start with the Oracle data (table, cards, gallery) as the first thing visitors see. Every pixel above the data is friction.

### 2. Real Screenshots Beat Abstractions
Gradient canvases, color swatches, and abstract representations of Oracle pages look generic. Actual Playwright screenshots of live pages are immediately compelling — visitors can see what each Oracle's world looks like before clicking.

### 3. Gallery Overlay Discipline
- Screenshots speak for themselves — overlay should be hidden by default
- On hover: macOS-style translucent effect (`backdrop-blur-md bg-black/10 saturate-[2]`)
- White text with `drop-shadow` reads on any background
- Five rounds of "more/less" tuning is normal for overlay opacity

### 4. Symlinks Crash Vite Dev Server
`ψ/learn/` contains origin symlinks to other repos. Vite's file watcher follows them and hits ELOOP. Fix:
```js
// astro.config.mjs
vite: {
  server: { watch: { ignored: ["**/ψ/**"] } }
}
```

### 5. Auto-Rotate Theme Pattern
- Default: rotating ON (6s interval)
- Manual palette click: stops rotation, saves preference
- Dedicated ⟳ toggle to re-enable
- localStorage for both palette and rotate state
- Inline FOUC prevention script in `<head>`

### 6. .assetsignore for Cloudflare Workers
Static Astro output includes `_worker.js/` directory. Wrangler refuses to deploy it as an asset. Put `.assetsignore` in `public/` with `_worker.js` to persist through builds.

### 7. Domain Naming Resonance
`landing-oracle.buildwithoracle.com` = functional but soulless
`gallery.buildwithoracle.com` = what it IS, resonates immediately

### Scaling Question (Open)
At 100+ Oracle landing pages, the 2x2 screenshot gallery won't work. Options to explore:
- Masonry grid with lazy loading
- Search/filter by name, stack, color
- Infinite scroll or pagination
- Category grouping (by org, by stack, by birth date)
- Thumbnail grid → click to expand
