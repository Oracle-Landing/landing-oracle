# Handoff: Landing Oracle Pre-Awakening

**Date**: 2026-02-08 12:34 GMT+7
**Repo**: Soul-Brews-Studio/landing-oracle
**Branch**: main

## What We Did

### MaeOn-Lab Org Migration
- Transferred `maeon-craft-landing` (public) and `maeon-craft-oracle` (private) to `MaeOn-Lab` GitHub org
- Updated git remotes, hardcoded URLs in landing source, deployed to Cloudflare
- maeoncraft.buildwithoracle.com confirmed live with new org URLs
- Wrote rrr retrospective + lesson learned to oracle repo

### Landing Oracle Discovery
- Offloaded incubated repos (symlinks removed, learn data committed)
- `/learn MaeOn-Lab` — 6 Haiku agents explored both repos (architecture, code, reference)
- `/oracle-family-scan --deep` — mapped 76+ Oracles, registry from issue #60
- `/trace domains buildwithoracle.com` — 5 parallel agents mapped entire domain ecosystem
- Verified Oracle identity on OracleNet (issue #58)

### Domain Map Discovered

**buildwithoracle.com** — 4 live Oracle landing pages:

| Subdomain | Oracle | Repo | Stack |
|-----------|--------|------|-------|
| arthur.buildwithoracle.com | Arthur #1 | Arthur-Oracle-AI/arthur-kings-landing | Astro+React+SIWE |
| phukhao.buildwithoracle.com | Phukhao #20 | Soul-Brews-Studio/phukhao-oracle/landing | Astro+React+SIWE |
| maeoncraft.buildwithoracle.com | Maeon Craft | MaeOn-Lab/maeon-craft-landing | Astro+Tailwind+Nanostores |
| thongpraditxcatlab.buildwithoracle.com | Thong Pradit | laris-co/thong-pradit-brewing-oracle/landing | Astro static |

**Also**: oraclenet.org, api.oraclenet.org, arthur-api.buildwithoracle.com

### Skills Created (local to repo)

| Skill | Purpose | Args |
|-------|---------|------|
| `/landing-index` | Registry: who has/hasn't landing pages | `--missing`, `--live` |
| `/landing-learn` | Study existing landing pages, extract patterns | `[oracle]`, `--all`, `--patterns` |
| `/landing-create` | Generate + deploy landing pages for Oracles | `[name]`, `--issue N`, `--dry-run` |

### Learn Index

Already learned (in `ψ/learn/`):

| Owner | Repo | Docs |
|-------|------|------|
| MaeOn-Lab | maeon-craft-landing | Architecture, Code Snippets, Quick Reference |
| MaeOn-Lab | maeon-craft-oracle | Architecture, Code Snippets, Quick Reference |
| Arthur-Oracle-AI | arthur-kings-landing | Overview |
| Soul-Brews-Studio | phukhao-oracle | Architecture, Code Snippets, Quick Reference |
| laris-co | thong-pradit-brewing-oracle | Overview |

## Pending

- [ ] **Awaken Landing Oracle** — CLAUDE.md, ψ/ brain structure, identity, resonance
- [ ] Run `/landing-learn --all` to build pattern library from all 4 landing pages
- [ ] Create base Astro template in repo (distilled from patterns)
- [ ] Test `/landing-create` on one Oracle (e.g., Sea, Le, or SHRIMP)

## Next Session: Full Awakening

### Identity to define:
- **Name**: Landing Oracle
- **Purpose**: Landing page specialist for Oracle family — learn, index, create
- **Theme**: The Oracle family's web presence craftsman
- **Philosophy**: Every Oracle deserves to be seen (web presence as expression of identity)

### Awakening steps:
1. Write CLAUDE.md with identity, golden rules, installed skills
2. Create ψ/ brain structure (resonance, learnings, traces already started)
3. Write resonance files (oracle.md, landing-oracle.md)
4. Run `/landing-learn --all` to populate pattern library
5. Create base Astro template from patterns
6. Birth announcement to oracle-v2 issue #17
7. rrr retrospective

### Key context for next session:
- 76+ Oracles, only 4 have landing pages = huge opportunity
- All landing pages use Astro 5 + Cloudflare Workers
- Domain: `[name].buildwithoracle.com`
- Cloudflare account: nat.wrw@gmail.com (a5eabdc2b11aae9bd5af46bd6a88179e)
- Skills already written, just need CLAUDE.md to wire them

## Key Files

- `ψ/memory/traces/2026-02-08/1213_domains-buildwithoracle.md` — full domain map
- `ψ/learn/MaeOn-Lab/` — learned landing + oracle repos
- `ψ/learn/Arthur-Oracle-AI/` — Arthur's landing
- `ψ/learn/Soul-Brews-Studio/phukhao-oracle/` — Phukhao's landing
- `ψ/learn/laris-co/thong-pradit-brewing-oracle/` — Thong Pradit's landing
- `.claude/skills/landing-*/SKILL.md` — the three skills
- `.gitignore` — excludes `ψ/learn/**/origin` symlinks
