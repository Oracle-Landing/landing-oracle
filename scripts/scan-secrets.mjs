#!/usr/bin/env node
// Scan a built site directory for LEAKED SECRET VALUES before publishing.
// Flags real assigned secrets / known token formats / private keys — NOT the
// mere mention of words like "AUTH_KEY" in prose (educational blog posts about
// token-safety must pass). Exit 1 + print findings if anything looks real.
//
// Usage: node scripts/scan-secrets.mjs <dir>   (default: ./dist)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const target = process.argv[2] || "dist";
const TEXT_EXT = new Set([".html", ".js", ".mjs", ".cjs", ".json", ".css", ".txt", ".xml", ".svg", ".map", ""]);
const SKIP_DIR = new Set(["node_modules", ".git", "_worker.js"]); // worker bundles inline framework noise

// High-signal patterns for ACTUAL secrets (value present), low false-positive.
const RULES = [
  { name: "private-key-block", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/ },
  { name: "aws-access-key-id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "github-token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: "slack-token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "openai-key", re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { name: "google-api-key", re: /\bAIza[0-9A-Za-z_\-]{35}\b/ },
  { name: "stripe-key", re: /\b[rs]k_(?:live|test)_[A-Za-z0-9]{20,}\b/ },
  { name: "jwt", re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/ },
  // Assignment of a secret-named var to a long high-entropy literal value.
  { name: "assigned-secret", re: /\b(?:AUTH_KEY|SESSION_SECRET|API_?KEY|SECRET(?:_KEY)?|ACCESS_TOKEN|PRIVATE_KEY|CF_API_TOKEN|CLOUDFLARE_API_TOKEN|PASSWORD)\b\s*[:=]\s*["'`]?([A-Za-z0-9+/_\-]{20,})["'`]?/ },
];
// Obvious placeholders that should NOT trip the assigned-secret rule.
const PLACEHOLDER = /^(your[_-]|example|placeholder|xxx+|<.*>|\$\{|process\.env|import\.meta|changeme|todo|redacted|dummy|sample|test[_-]?key|abc123)/i;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIR.has(e)) continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (TEXT_EXT.has(extname(e).toLowerCase()) && s.size < 5_000_000) out.push(p);
  }
  return out;
}

let files;
try { files = walk(target); }
catch (e) { console.error(`scan-secrets: cannot read ${target}: ${e.message}`); process.exit(2); }

const findings = [];
for (const f of files) {
  let text;
  try { text = readFileSync(f, "utf8"); } catch { continue; }
  const lines = text.split("\n");
  for (const rule of RULES) {
    for (let i = 0; i < lines.length; i++) {
      const m = rule.re.exec(lines[i]);
      if (!m) continue;
      const captured = m[1] || m[0];
      if (rule.name === "assigned-secret" && PLACEHOLDER.test(captured)) continue;
      findings.push({ rule: rule.name, file: f.replace(target, "").replace(/^\//, ""), line: i + 1, sample: m[0].slice(0, 60) });
    }
  }
}

if (findings.length) {
  console.log(`🔴 SECRETS FOUND (${findings.length}) in ${target} — DO NOT DEPLOY:`);
  for (const x of findings) console.log(`  [${x.rule}] ${x.file}:${x.line}  ${x.sample}`);
  process.exit(1);
}
console.log(`✅ clean — no leaked secrets in ${target} (${files.length} files scanned)`);
process.exit(0);
