---
query: "domains buildwithoracle.com"
target: "landing-oracle"
mode: deep
timestamp: 2026-02-08 12:13
---

# Trace: domains buildwithoracle.com

**Target**: landing-oracle
**Mode**: deep (5 parallel agents)
**Time**: 2026-02-08 12:13 GMT+7

## Domain Ecosystem

### Primary Domains

| Domain | Purpose | Hosting |
|--------|---------|---------|
| **buildwithoracle.com** | Oracle family hub | Cloudflare Workers |
| **oraclenet.org** | Oracle Network (Resonance) | Cloudflare Workers |
| **soulbrewsgroup.com** | Email routing only | Cloudflare Email |

### Cloudflare Account

- **Account**: nat.wrw@gmail.com
- **Account ID**: `a5eabdc2b11aae9bd5af46bd6a88179e`
- **Hub repo**: `laris-co/buildwithoracle`

---

## buildwithoracle.com Subdomains

### Hub Routes (in laris-co/buildwithoracle wrangler.toml)

| Subdomain | Purpose |
|-----------|---------|
| buildwithoracle.com | Root hub |
| www.buildwithoracle.com | WWW redirect |
| nat.buildwithoracle.com | Human perspective |
| oracle.buildwithoracle.com | Oracle AI |
| sage.buildwithoracle.com | Sage AI |
| arthur.buildwithoracle.com | Arthur AI |
| gemini.buildwithoracle.com | Gemini AI |

### Oracle Landing Pages (individual wrangler.toml per repo)

| Subdomain | Oracle | Repo | Stack | Status |
|-----------|--------|------|-------|--------|
| arthur.buildwithoracle.com | Arthur #1 | Arthur-Oracle-AI/arthur-kings-landing | Astro + React + SIWE | Live |
| phukhao.buildwithoracle.com | Phukhao #20 | Soul-Brews-Studio/phukhao-oracle/landing | Astro + React + SIWE | Live |
| maeoncraft.buildwithoracle.com | Maeon Craft | MaeOn-Lab/maeon-craft-landing | Astro + Tailwind + Nanostores | Live |
| thongpraditxcatlab.buildwithoracle.com | Thong Pradit (เสี่ยวเอ้อ) | laris-co/thong-pradit-brewing-oracle/landing | Astro static | Live |
| xiaoer.buildwithoracle.com | Thong Pradit (alias) | (same as above) | Astro static | Live |

### Referenced but NOT yet deployed

| Subdomain | Oracle | Status |
|-----------|--------|--------|
| le.buildwithoracle.com | Le #2 | Referenced in docs, no repo |
| jarvis.buildwithoracle.com | Jarvis #5 | Referenced in docs, no repo |
| momo.buildwithoracle.com | Momo #6 | Referenced in docs, no repo |
| sea.buildwithoracle.com | Sea #21 | Referenced in docs, no repo |

---

## oraclenet.org Subdomains

| Subdomain | Repo | Purpose |
|-----------|------|---------|
| oraclenet.org | Oracle-Net-The-resonance-network/oracle-net-web | OracleNet web app |
| api.oraclenet.org | Oracle-Net-The-resonance-network/oracle-universe-api | OracleNet API |

---

## Other Cloudflare Workers (non-landing)

| Worker | Domain | Purpose |
|--------|--------|---------|
| arthur-oracle-api | arthur-api.buildwithoracle.com | Arthur API |
| siwe-service | (workers.dev only) | SIWE auth service |
| siwer | siwer.larisara.workers.dev | SIWE for OracleNet |
| cf-worker-mailhook-discord | soulbrewsgroup.com | Email → Discord |
| carbon-api | (workers.dev only) | Carbon offset |
| pocket-pet-cron-hono | (workers.dev only) | Cron job |

---

## Landing Page Tech Stack Patterns

| Feature | Arthur | Phukhao | Maeon Craft | Thong Pradit |
|---------|--------|---------|-------------|--------------|
| Framework | Astro 5 | Astro 5 | Astro 5 | Astro 5 |
| CSS | Tailwind | Tailwind | Tailwind v4 | Tailwind |
| React | Yes | Yes | No | No |
| SIWE Auth | Yes | Yes | No | No |
| Theme Toggle | No | No | Yes (Nanostores) | No |
| Bilingual | EN | EN+TH | EN+TH | EN+TH |
| Deploy | CF Workers | CF Workers | CF Workers | CF Workers |

---

## Summary

**4 live Oracle landing pages** on buildwithoracle.com subdomains.
**4+ referenced** subdomains with no landing page yet.
**76+ Oracles** in the family — vast majority have NO landing page.

All use: Astro 5 + Cloudflare Workers + `{ pattern: "X.buildwithoracle.com", custom_domain: true }` in wrangler.toml.

Landing Oracle's mission: learn these patterns, templatize them, help the other 70+ siblings get their own subdomain.
