---
name: landing-create
description: Create a landing page for an Oracle — generate Astro project, configure Cloudflare, deploy. Use when user says "landing create", "create landing page", "build landing for [oracle]".
---

# /landing-create — Create Oracle Landing Page

Generate and deploy a landing page for any Oracle in the family.

## Usage

```
/landing-create [oracle-name]          # Create by name
/landing-create --issue [number]       # Create from birth issue
/landing-create --repo [owner/repo]    # Create from Oracle repo
/landing-create --dry-run              # Generate but don't deploy
```

## Step 0: Timestamp + Setup

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
ROOT="$(pwd)"
```

---

## Step 1: Gather Oracle Identity

### From birth issue:
```bash
gh api "repos/Soul-Brews-Studio/oracle-v2/issues/[NUMBER]" --jq '.body'
```

### From Oracle repo (CLAUDE.md + resonance):
```bash
cat [REPO]/CLAUDE.md
cat [REPO]/ψ/memory/resonance/*.md
```

### Extract:
| Field | Source |
|-------|--------|
| Name | Birth issue title / CLAUDE.md |
| Emoji | Birth issue |
| Human | Birth issue |
| Theme/tagline | Resonance files |
| Philosophy | CLAUDE.md principles |
| Color hints | Theme description (nature=green, fire=red, ocean=blue) |

---

## Step 2: Generate Astro Project

Create in a temp directory or directly in the target repo.

### Base stack (same as all Oracle landings):
- Astro 5.x
- @astrojs/cloudflare adapter
- Tailwind CSS 4.x
- TypeScript strict

### Files to generate:

```
[oracle]-landing/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── wrangler.toml           # [name].buildwithoracle.com
├── public/
│   └── .assetsignore
├── src/
│   ├── layouts/
│   │   └── Base.astro      # HTML shell, fonts, meta
│   ├── components/
│   │   └── Navigation.astro
│   ├── pages/
│   │   └── index.astro     # Hero + Philosophy + About
│   └── styles/
│       └── global.css       # Tailwind + design tokens
```

### wrangler.toml template:
```toml
name = "[oracle-slug]-landing"
compatibility_date = "2025-04-01"
compatibility_flags = ["nodejs_compat"]
[assets]
directory = "./dist"
routes = [
  { pattern = "[subdomain].buildwithoracle.com", custom_domain = true }
]
```

### Design token mapping:
| Oracle Theme | Primary | Secondary | Accent |
|-------------|---------|-----------|--------|
| Nature/Forest | forest greens | earth browns | amber |
| Ocean/Water | deep blues | teals | white foam |
| Fire/Energy | reds/oranges | dark grays | gold |
| Mountain/Earth | stone grays | forest greens | sky blue |
| Tech/Digital | navy/indigo | slate | electric blue |

Map Oracle's theme description to a color palette. Use `ψ/memory/learnings/` pattern library if available.

---

## Step 3: Build + Test

```bash
cd [project-dir]
bun install
bun run build
```

Verify build succeeds before deploying.

---

## Step 4: Deploy (unless --dry-run)

```bash
npx wrangler deploy
```

Verify:
```bash
curl -s -o /dev/null -w "%{http_code}" "https://[subdomain].buildwithoracle.com"
```

---

## Step 5: Register

After successful deploy:
1. Add to the known domains list in `/landing-index`
2. Update `ψ/memory/traces/` with the new landing

---

## Notes

- All landing pages share Cloudflare account `a5eabdc2b11aae9bd5af46bd6a88179e`
- Domain pattern: `[name].buildwithoracle.com`
- DNS must be configured in Cloudflare dashboard (CNAME to workers)
- Template evolves as `/landing-learn --all` discovers new patterns
