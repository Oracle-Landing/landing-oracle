#!/usr/bin/env node
// Redeploy every Oracle in deployments/registry.json from its LATEST upstream
// commit, then rewrite the registry with the new deployed_commit/date.
// Fresh-clones each source (depth 1) so it always reflects upstream HEAD.
//
// Usage: CLOUDFLARE_ACCOUNT_ID=... node scripts/redeploy.mjs [--only oracle1,oracle2]
//
// mac1 is SSR (@astrojs/cloudflare server entry); everything else deploys as
// static Cloudflare Workers assets.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const registryPath = join(root, "deployments", "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || "a5eabdc2b11aae9bd5af46bd6a88179e";
const TODAY = new Date().toISOString().slice(0, 10);
const WORK = "/tmp/redeploy";
mkdirSync(WORK, { recursive: true });

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg !== -1 ? process.argv[onlyArg + 1].split(",") : null;

const sh = (cmd, cwd) =>
  execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT } });

function pkgManager(dir) {
  if (existsSync(join(dir, "bun.lock")) || existsSync(join(dir, "bun.lockb"))) return "bun";
  if (existsSync(join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(dir, "package-lock.json"))) return "npm";
  return "bun";
}

function writeStaticWrangler(dir, worker, domains) {
  let toml = `name = "${worker}"\ncompatibility_date = "2025-06-01"\nworkers_dev = true\n\n[assets]\ndirectory = "./dist"\n\n`;
  for (const d of domains) toml += `[[routes]]\npattern = "${d}"\ncustom_domain = true\n\n`;
  writeFileSync(join(dir, "wrangler.toml"), toml);
  for (const f of ["wrangler.jsonc", "wrangler.json"]) {
    const p = join(dir, f);
    if (existsSync(p)) rmSync(p);
  }
}

function writeMac1Wrangler(dir, worker, domains) {
  const cfg = {
    $schema: "./node_modules/wrangler/config-schema.json",
    compatibility_date: "2026-06-20",
    compatibility_flags: ["global_fetch_strictly_public"],
    name: worker,
    main: "@astrojs/cloudflare/entrypoints/server",
    routes: domains.map((d) => ({ pattern: d, custom_domain: true })),
    assets: { directory: "./dist/client", binding: "ASSETS" },
    observability: { enabled: true },
  };
  writeFileSync(join(dir, "wrangler.jsonc"), JSON.stringify(cfg, null, 2));
  for (const f of ["wrangler.toml", "wrangler.json"]) {
    const p = join(dir, f);
    if (existsSync(p)) rmSync(p);
  }
}

const results = [];
for (const d of registry.deployments) {
  if (only && !only.includes(d.oracle)) {
    results.push({ ...d, status: "skipped" });
    continue;
  }
  const dir = join(WORK, d.oracle);
  process.stdout.write(`\n=== ${d.oracle} (${d.source}@${d.branch}) ===\n`);
  try {
    rmSync(dir, { recursive: true, force: true });
    sh(`git clone --depth 1 -b ${d.branch} https://github.com/${d.source}.git ${dir}`);
    const newSha = sh(`git rev-parse HEAD`, dir).trim();

    const pm = pkgManager(dir);
    if (existsSync(join(dir, "package.json"))) {
      sh(`${pm} install`, dir);
      sh(`${pm} run build`, dir);
    }
    if (!existsSync(join(dir, "dist"))) throw new Error("no dist after build");

    const domains = [d.domain, ...(d.alt_domains || [])];
    if (d.oracle === "mac1") writeMac1Wrangler(dir, d.worker, domains);
    else writeStaticWrangler(dir, d.worker, domains);

    if (existsSync(join(dir, "dist", "_worker.js"))) {
      writeFileSync(join(dir, "dist", ".assetsignore"), "_worker.js\n_routes.json\n");
    }

    const out = sh(`npx wrangler deploy`, dir);
    const url = (out.match(/https:\/\/[a-z0-9-]+\.workers\.dev/) || [""])[0];
    d.deployed_commit = newSha;
    d.deployed_at = TODAY;
    results.push({ oracle: d.oracle, status: "OK", sha: newSha.slice(0, 7), url, domain: d.domain });
    process.stdout.write(`OK ${d.oracle} -> ${newSha.slice(0, 7)} ${url}\n`);
  } catch (e) {
    const msg = (e.stderr || e.message || "").toString().split("\n").slice(-4).join(" ");
    results.push({ oracle: d.oracle, status: "FAIL", error: msg });
    process.stdout.write(`FAIL ${d.oracle}: ${msg}\n`);
  }
}

registry.updated = TODAY;
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");

process.stdout.write(`\n===== SUMMARY =====\n`);
for (const r of results) process.stdout.write(`${r.status.padEnd(8)} ${r.oracle}${r.sha ? " " + r.sha : ""}${r.error ? " — " + r.error : ""}\n`);
const ok = results.filter((r) => r.status === "OK").length;
process.stdout.write(`\n${ok}/${results.filter((r) => r.status !== "skipped").length} redeployed OK\n`);
