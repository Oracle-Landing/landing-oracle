---
name: landing-index
description: Oracle landing page registry — who has a landing page, who doesn't, health check live sites. Use when user says "landing index", "who has landing", "landing status", "check landing pages".
---

# /landing-index — Oracle Landing Page Registry

Check which Oracles have landing pages and which don't.

## Usage

```
/landing-index                # Full status — all Oracles, has/hasn't landing
/landing-index --missing      # Only Oracles without a landing page
/landing-index --live         # Health check all deployed landing pages
```

## Step 0: Timestamp

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

---

## Mode 1: Default (Full Status)

### Step 1: Get Oracle Family Registry

```bash
REPO="Soul-Brews-Studio/oracle-v2"
gh api "repos/$REPO/issues/60/comments" --jq '.[0].body' | head -200
```

### Step 2: Get Known Landing Pages

```bash
for domain in \
  "arthur.buildwithoracle.com" \
  "phukhao.buildwithoracle.com" \
  "maeoncraft.buildwithoracle.com" \
  "thongpraditxcatlab.buildwithoracle.com" \
  "xiaoer.buildwithoracle.com"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain" --max-time 5)
  echo "$domain → $STATUS"
done
```

Also search for new landing repos:

```bash
gh search repos "landing" --owner Soul-Brews-Studio --json name --limit 20 2>/dev/null
gh search repos "landing" --owner MaeOn-Lab --json name --limit 20 2>/dev/null
```

### Step 3: Cross-reference and output

```markdown
## 🌐 Oracle Landing Page Index

**Updated**: [timestamp]
**Total Oracles**: 76+
**With Landing Pages**: [N]
**Coverage**: [N]%

### ✅ Live Landing Pages

| Oracle | # | Domain | Repo | Stack |
|--------|---|--------|------|-------|

### ❌ No Landing Page

| Oracle | # | Human | Birth Issue |
|--------|---|-------|-------------|
```

---

## Mode 2: --missing

Same as default but ONLY show Oracles without landing pages.

---

## Mode 3: --live

Health check all deployed landing pages with curl.

```markdown
## 🏥 Landing Page Health Check

| Domain | Status | Response |
|--------|--------|----------|
```

---

## Known Domains

| Subdomain | Oracle | Repo |
|-----------|--------|------|
| arthur.buildwithoracle.com | Arthur #1 | Arthur-Oracle-AI/arthur-kings-landing |
| phukhao.buildwithoracle.com | Phukhao #20 | Soul-Brews-Studio/phukhao-oracle/landing |
| maeoncraft.buildwithoracle.com | Maeon Craft | MaeOn-Lab/maeon-craft-landing |
| thongpraditxcatlab.buildwithoracle.com | Thong Pradit | laris-co/thong-pradit-brewing-oracle/landing |
| xiaoer.buildwithoracle.com | Thong Pradit (alias) | (same as above) |

## Data Sources

- Issue #60 @ Soul-Brews-Studio/oracle-v2 (Oracle Family Registry)
- `ψ/memory/traces/` (domain trace results)
- wrangler.toml files (custom domain configs)
