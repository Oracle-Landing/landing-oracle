# Lesson: nodejs_compat Is Not Needed for Astro + Cloudflare Workers

**Date**: 2026-02-08
**Source**: rrr: landing-oracle
**Tags**: cloudflare, wrangler, nodejs_compat, astro, deployment

## Finding

All 4 Oracle landing pages had `compatibility_flags = ["nodejs_compat"]` in their wrangler.toml, but none actually needed it:

- **Arthur & Phukhao**: Have SIWE wallet auth using `viem`, which relies on Web Crypto API (`crypto.subtle`), not Node.js `crypto`. Web Crypto is natively available in Cloudflare Workers.
- **Maeon Craft & Thong Pradit**: Purely static sites with no server-side Node.js API usage.

## Why It Was There

Likely cargo-culted from early Astro + Cloudflare templates or added "just in case" during initial setup. The `@astrojs/cloudflare` adapter doesn't require it for basic static + SSR builds.

## Impact of Removal

- All 4 pages build, deploy, and serve correctly without it
- Slightly smaller worker bundle (no Node.js polyfill shims)
- Cleaner config that accurately reflects actual dependencies

## Rule

**Only add `nodejs_compat` when you import from `node:*` modules** (e.g., `node:crypto`, `node:buffer`, `node:stream`). If using Web APIs (`crypto.subtle`, `fetch`, `Request`, `Response`), you don't need it.
