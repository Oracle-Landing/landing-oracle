---
name: landing-learn
description: Study existing Oracle landing pages — extract patterns, design tokens, layout structure. Use when user says "landing learn", "study landing page", "analyze landing".
---

# /landing-learn — Study Oracle Landing Pages

Analyze existing landing pages to extract patterns for the template library.

## Usage

```
/landing-learn [oracle]        # Study one Oracle's landing page
/landing-learn --all           # Study all existing landing pages
/landing-learn --patterns      # Show current pattern library (no fetch)
```

## Step 0: Timestamp

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
ROOT="$(pwd)"
```

## Known Landing Pages

| Oracle | Domain | Repo |
|--------|--------|------|
| Arthur | arthur.buildwithoracle.com | Arthur-Oracle-AI/arthur-kings-landing |
| Phukhao | phukhao.buildwithoracle.com | Soul-Brews-Studio/phukhao-oracle/landing |
| Maeon Craft | maeoncraft.buildwithoracle.com | MaeOn-Lab/maeon-craft-landing |
| Thong Pradit | thongpraditxcatlab.buildwithoracle.com | laris-co/thong-pradit-brewing-oracle/landing |

---

## Mode 1: Single Oracle (default)

### Step 1: Resolve Oracle to repo

Match argument to known landing pages above. If repo not in `ψ/learn/`, clone via ghq first.

### Step 2: Launch 1 Haiku agent — Landing Page Analyst

**Agent prompt (use LITERAL paths):**
```
You are analyzing an Oracle landing page.

READ source code from: [REPO_PATH]
WRITE your analysis to: [ROOT]/ψ/learn/[owner]/[repo]/[TODAY]/[TIME]_LANDING-ANALYSIS.md

Extract:

## Identity
- Oracle name, emoji, tagline
- Color palette (hex values)
- Typography (fonts)
- Visual theme

## Structure
- Page routes
- Sections per page (hero, philosophy, team, etc.)
- Navigation pattern

## Tech Stack
- Framework, CSS, client JS, auth, special features

## Deployment
- wrangler.toml config (worker name, custom domain, bindings)
- Build command

## Design Tokens
- Primary/secondary/accent colors
- Font families
- Border radius, glass/blur values
- Animation patterns
```

### Step 3: Summary output

---

## Mode 2: --all

Run Mode 1 for ALL known landing pages in parallel (4 Haiku agents).

After all complete, generate a comparison table and write to:
`ψ/memory/learnings/[TODAY]_landing-page-patterns.md`

```markdown
## 📊 Landing Page Comparison

| Feature | Arthur | Phukhao | Maeon Craft | Thong Pradit |
|---------|--------|---------|-------------|--------------|

### Common Patterns (use in template)
### Unique Features (optional)
```

---

## Mode 3: --patterns

No fetching. Read existing analyses from `ψ/learn/` and `ψ/memory/learnings/` and display the current pattern library.

---

## Notes

- Analyses stored in `ψ/learn/[owner]/[repo]/` alongside `/learn` docs
- Pattern library stored in `ψ/memory/learnings/`
- This skill feeds into `/landing-create` — patterns become templates
