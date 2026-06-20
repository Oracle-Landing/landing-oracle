#!/usr/bin/env node
// Deploy a single registration/deploy-request issue end-to-end:
// parse issue body → verify source repo → fork into Oracle-Landing → build →
// deploy static site to {sub}.buildwithoracle.com → add gallery card + registry
// entry → comment + close the issue.
//
// Usage: node scripts/deploy-issue.mjs <issueNumber>
// Env:   CLOUDFLARE_ACCOUNT_ID (defaults to Nat.wrw), GITHUB_TOKEN via gh.
//
// Guards (skip, do NOT close, on failure): no source repo found, repo not
// public/accessible, no *.buildwithoracle.com subdomain, build fails. Prints a
// single-line JSON result so the loop can summarize.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const REPO = "Oracle-Landing/landing-oracle";
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || "a5eabdc2b11aae9bd5af46bd6a88179e";
const TODAY = new Date().toISOString().slice(0, 10);
const WORK = "/tmp/landing-deploys";

const issueNum = process.argv[2];
if (!issueNum) { console.error("usage: deploy-issue.mjs <issueNumber>"); process.exit(2); }

const sh = (cmd, opts = {}) =>
  execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT }, ...opts });

function done(result) { console.log(JSON.stringify(result)); process.exit(result.ok ? 0 : 1); }

// 1. Fetch issue
let body, title;
try {
  const j = JSON.parse(sh(`gh issue view ${issueNum} --repo ${REPO} --json body,title`));
  body = j.body || ""; title = j.title || "";
} catch (e) { done({ issue: issueNum, ok: false, skip: "issue-fetch-failed" }); }

// 2. Parse source repo (first github.com/owner/name that isn't Oracle-Landing/buildwithoracle)
const repoMatches = [...body.matchAll(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:[)\s.#]|$)/g)]
  .map((m) => `${m[1]}/${m[2]}`.replace(/\.git$/, ""))
  .filter((r) => !/^Oracle-Landing\//i.test(r) && !/buildwithoracle/i.test(r) && !/\/(issues|discussions|pull)$/i.test(r));
const source = repoMatches[0];
if (!source) done({ issue: issueNum, ok: false, skip: "no-source-repo" });

// 3. Parse requested subdomain (first *.buildwithoracle.com, ignore gallery/landing)
const subs = [...body.matchAll(/\b([a-z0-9][a-z0-9-]*)\.buildwithoracle\.com/gi)]
  .map((m) => m[1].toLowerCase())
  .filter((s) => !["gallery", "landing", "www"].includes(s));
const sub = [...new Set(subs)][0];
if (!sub) done({ issue: issueNum, ok: false, skip: "no-subdomain" });
const altSub = [...new Set(subs)][1]; // optional secondary domain
const domains = [`${sub}.buildwithoracle.com`, ...(altSub ? [`${altSub}.buildwithoracle.com`] : [])];

// 4. Verify repo accessible + default branch
let branch;
try {
  const j = JSON.parse(sh(`gh repo view ${source} --json visibility,defaultBranchRef`));
  if (j.visibility !== "PUBLIC") done({ issue: issueNum, ok: false, skip: "repo-not-public", source });
  branch = j.defaultBranchRef?.name || "main";
} catch (e) { done({ issue: issueNum, ok: false, skip: "repo-not-accessible", source }); }

// 5. Parse identity for the gallery card
const hexes = [...body.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0]);
const primary = hexes[0] || "#6366f1";
const secondary = hexes[1] || "#22d3ee";
const background = hexes[2] || "#0a0a14";
let name = (title || sub)
  .replace(/^[^A-Za-z฀-๿0-9]+/, "")
  .replace(/\b(register|deploy|request|landing\s*page|oracle\s*landing\s*page)\b/gi, "")
  .replace(/[—:|].*$/, "")
  .replace(/buildwithoracle\.com/gi, "")
  .trim() || sub;
const numMatch = body.match(/(?:number|#)\s*[:#]?\s*(\d{1,4})\b/i);
const number = numMatch ? numMatch[1] : null;
const fork = source.split("/")[1].replace(/\.git$/, "");
const worker = fork;
const slug = sub.replace(/[^a-z0-9-]/g, "");

// 6. Fork + clone (idempotent)
mkdirSync(WORK, { recursive: true });
const dir = join(WORK, fork);
try {
  try { sh(`gh repo fork ${source} --org Oracle-Landing --clone=false --fork-name ${fork}`); } catch {}
  sh(`sleep 3`, { shell: "/bin/bash" });
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  sh(`gh repo clone Oracle-Landing/${fork} ${dir} -- -q`);
} catch (e) { done({ issue: issueNum, ok: false, skip: "fork-clone-failed", source }); }

// 7. Build (bun if package.json; static-html otherwise)
let deployDir = "dist";
try {
  if (existsSync(join(dir, "package.json"))) {
    sh(`bun install`, { cwd: dir });
    sh(`bun run build`, { cwd: dir });
    if (!existsSync(join(dir, "dist"))) {
      if (existsSync(join(dir, "docs"))) deployDir = "docs";
      else throw new Error("no dist after build");
    }
  } else {
    deployDir = existsSync(join(dir, "docs")) ? "docs" : ".";
  }
} catch (e) {
  const msg = (e.stderr || e.message || "").toString().split("\n").slice(-2).join(" ");
  done({ issue: issueNum, ok: false, skip: "build-failed", source, error: msg });
}

// 8. Write static wrangler + deploy
let toml = `name = "${worker}"\ncompatibility_date = "2025-06-01"\nworkers_dev = true\n\n[assets]\ndirectory = "./${deployDir}"\n\n`;
for (const d of domains) toml += `[[routes]]\npattern = "${d}"\ncustom_domain = true\n\n`;
writeFileSync(join(dir, "wrangler.toml"), toml);
for (const f of ["wrangler.jsonc", "wrangler.json"]) { const p = join(dir, f); if (existsSync(p)) rmSync(p); }
if (existsSync(join(dir, deployDir, "_worker.js")))
  writeFileSync(join(dir, deployDir, ".assetsignore"), "_worker.js\n_routes.json\n");

let deployedSha;
try {
  sh(`npx wrangler deploy`, { cwd: dir });
  deployedSha = sh(`git rev-parse HEAD`, { cwd: dir }).trim();
} catch (e) {
  const msg = (e.stderr || e.message || "").toString().split("\n").slice(-3).join(" ");
  done({ issue: issueNum, ok: false, skip: "deploy-failed", source, error: msg });
}

// 9. Gallery card (skip if one already exists for this slug)
const galleryPath = join(root, "src", "data", "oracles", `${slug}.md`);
if (!existsSync(galleryPath)) {
  const fm = [
    "---",
    `name: ${name}`,
    ...(number ? [`number: "${number}"`] : []),
    `domain: ${domains[0]}`,
    ...(domains[1] ? [`alt_domains: ["${domains[1]}"]`] : []),
    `primary: "${primary}"`,
    `secondary: "${secondary}"`,
    `background: "${background}"`,
    `stack: ["Astro 5", "CF Workers"]`,
    "status: live",
    `added: "${TODAY}"`,
    "---",
    "",
    `${name} — deployed via Landing Oracle auto-loop.`,
    "",
  ].join("\n");
  writeFileSync(galleryPath, fm);
}

// 10. Registry entry (append if not present)
const registryPath = join(root, "deployments", "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
if (!registry.deployments.some((d) => d.oracle === slug)) {
  registry.deployments.push({
    oracle: slug, domain: domains[0], ...(domains[1] ? { alt_domains: [domains[1]] } : {}),
    source, branch, fork: `Oracle-Landing/${fork}`, worker, deployed_commit: deployedSha, deployed_at: TODAY,
  });
} else {
  const e = registry.deployments.find((d) => d.oracle === slug);
  e.deployed_commit = deployedSha; e.deployed_at = TODAY;
}
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");

// 11. Comment + close
const comment = `## 🚀 Deployed — ${name} is live!\n\n**https://${domains[0]}**${domains[1] ? ` · https://${domains[1]}` : ""}\n\nFork \`Oracle-Landing/${fork}\` → build → Cloudflare Workers → custom domain bound. Added to gallery + deploy registry (auto-tracked for updates). ยินดีต้อนรับครับ ✨ — Landing Oracle (auto-loop)`;
try {
  writeFileSync("/tmp/_deploy_comment.md", comment);
  sh(`gh issue comment ${issueNum} --repo ${REPO} --body-file /tmp/_deploy_comment.md`);
  sh(`gh issue close ${issueNum} --repo ${REPO} --reason completed`);
} catch (e) { /* deployed fine; closing is best-effort */ }

done({ issue: issueNum, ok: true, oracle: slug, name, domains, source, sha: deployedSha.slice(0, 7) });
