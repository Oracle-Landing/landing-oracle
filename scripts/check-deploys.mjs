#!/usr/bin/env node
// Compare each deployed commit (deployments/registry.json) against the latest
// upstream commit on the source repo's branch. Reports which Oracles have an
// update available (upstream moved ahead of what we deployed) and a live-site
// HTTP health check. Zero dependencies — uses global fetch (Node 18+).
//
// Usage:
//   node scripts/check-deploys.mjs            # human table
//   node scripts/check-deploys.mjs --json     # machine JSON
//   node scripts/check-deploys.mjs --markdown # markdown report (for CI summary / issue body)
//
// Auth: set GITHUB_TOKEN to raise the API rate limit (CI provides it automatically).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = join(__dirname, "..", "deployments", "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const ghHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "landing-oracle-deploy-check",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function latestUpstreamSha(source, branch) {
  const url = `https://api.github.com/repos/${source}/commits/${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) {
    return { error: `${res.status} ${res.statusText}` };
  }
  const data = await res.json();
  return {
    sha: data.sha,
    date: data.commit?.committer?.date || data.commit?.author?.date || null,
    message: (data.commit?.message || "").split("\n")[0],
  };
}

async function siteStatus(domain) {
  try {
    const res = await fetch(`https://${domain}`, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    return res.status;
  } catch {
    return 0;
  }
}

const rows = [];
for (const d of registry.deployments) {
  const [up, site] = await Promise.all([
    latestUpstreamSha(d.source, d.branch),
    siteStatus(d.domain),
  ]);
  const deployed = d.deployed_commit;
  let state;
  if (up.error) state = "error";
  else if (!up.sha) state = "error";
  else if (up.sha === deployed) state = "current";
  else state = "update-available";
  rows.push({
    oracle: d.oracle,
    domain: d.domain,
    source: d.source,
    branch: d.branch,
    deployed: deployed.slice(0, 7),
    latest: up.sha ? up.sha.slice(0, 7) : (up.error || "?"),
    state,
    http: site,
    latestMessage: up.message || "",
    latestDate: up.date || "",
  });
}

const updates = rows.filter((r) => r.state === "update-available");
const errors = rows.filter((r) => r.state === "error");
const down = rows.filter((r) => r.http !== 200);

const mode = process.argv[2] || "";

const icon = (r) =>
  r.state === "update-available" ? "🔄" : r.state === "error" ? "⚠️" : r.http !== 200 ? "🔴" : "✅";

function buildMarkdown(heading = true) {
  let md = heading ? `## 🔮 Landing Oracle — Deploy Status\n\n` : "";
  md += `_${rows.length} deployments · **${updates.length} update(s) available** · ${errors.length} error(s) · ${down.length} down · updated ${registry.updated}_\n\n`;
  md += `| | Oracle | Domain | Deployed | Latest | Source |\n|---|---|---|---|---|---|\n`;
  for (const r of rows) {
    md += `| ${icon(r)} | ${r.oracle} | [${r.domain}](https://${r.domain}) | \`${r.deployed}\` | \`${r.latest}\` | ${r.source}@${r.branch} |\n`;
  }
  if (updates.length) {
    md += `\n### 🔄 Updates available (redeploy)\n`;
    for (const r of updates) md += `- **${r.oracle}** — ${r.source}@${r.branch} moved to \`${r.latest}\`: ${r.latestMessage}\n`;
  }
  return md;
}

if (mode === "--json") {
  console.log(JSON.stringify({ updated: registry.updated, rows, summary: { total: rows.length, updates: updates.length, errors: errors.length, down: down.length } }, null, 2));
} else if (mode === "--markdown") {
  console.log(buildMarkdown(true));
} else if (mode === "--write-readme") {
  const readmePath = join(__dirname, "..", "README.md");
  const START = "<!-- DEPLOY-STATUS:START -->";
  const END = "<!-- DEPLOY-STATUS:END -->";
  let readme = readFileSync(readmePath, "utf8");
  const block = `${START}\n${buildMarkdown(false)}\n${END}`;
  const re = new RegExp(`${START}[\\s\\S]*?${END}`);
  readme = re.test(readme) ? readme.replace(re, block) : readme + `\n\n${block}\n`;
  writeFileSync(readmePath, readme);
  console.log(`README.md deploy-status block updated (${rows.length} rows, ${updates.length} updates).`);
} else {
  const icon = (r) =>
    r.state === "update-available" ? "🔄" : r.state === "error" ? "⚠️" : r.http !== 200 ? "🔴" : "✅";
  for (const r of rows) {
    console.log(
      `${icon(r)} ${r.oracle.padEnd(12)} ${String(r.http).padEnd(4)} deployed:${r.deployed} latest:${r.latest}  ${r.source}@${r.branch}`
    );
  }
  console.log(`\n${rows.length} deployments · ${updates.length} update(s) available · ${errors.length} error(s) · ${down.length} down`);
}

// Exit non-zero only on hard errors, so CI can still post the summary for updates.
process.exit(errors.length ? 1 : 0);
