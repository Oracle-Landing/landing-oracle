#!/usr/bin/env bash
# One landing-oracle auto-loop tick:
#  1. redeploy any Oracle whose source moved ahead of the registry
#  2. auto-deploy any new open deploy-request issue (not the tracker #35 / workshop #10)
#  3. rebuild+deploy the gallery if new cards were added
#  4. commit registry.json + gallery cards (NOT README — the Action owns it) and push
# Prints a concise SUMMARY block. Safe to run repeatedly; deploy-issue.mjs skips
# malformed issues (leaves them open) and only closes on success.
set -uo pipefail
cd /opt/Code/github.com/Oracle-Landing/landing-oracle || exit 1
export GITHUB_TOKEN="$(gh auth token 2>/dev/null)"
export CLOUDFLARE_ACCOUNT_ID="a5eabdc2b11aae9bd5af46bd6a88179e"

SUMMARY=""

# 1. Redeploy stale ------------------------------------------------------------
STALE=$(node scripts/check-deploys.mjs --json 2>/dev/null \
  | node -e "const d=JSON.parse(require('fs').readFileSync(0));process.stdout.write(d.rows.filter(r=>r.state==='update-available').map(r=>r.oracle).join(','))")
if [ -n "$STALE" ]; then
  node scripts/redeploy.mjs --only "$STALE" >/tmp/loop-tick-redeploy.log 2>&1
  OKN=$(grep -cE '^OK +[a-z][a-z0-9-]* -> ' /tmp/loop-tick-redeploy.log)
  SUMMARY="${SUMMARY}redeployed stale: ${STALE} (${OKN} ok)\n"
else
  SUMMARY="${SUMMARY}stale: none (all current)\n"
fi

# 2. Auto-deploy new issues ----------------------------------------------------
# Skip: #10 workshop hub, #35 tracker, #44 dustboy manual tracker (pending owner PR merge + SESSION_SECRET)
NEW=$(gh issue list --repo Oracle-Landing/landing-oracle --state open --limit 100 --json number \
  --jq '.[].number | select(. != 10 and . != 35 and . != 44)')
DEPLOYED_NEW=""
for n in $NEW; do
  RES=$(node scripts/deploy-issue.mjs "$n" 2>/tmp/loop-tick-issue-$n.err)
  OK=$(printf '%s' "$RES" | node -e "try{const r=JSON.parse(require('fs').readFileSync(0));console.log(r.ok?('OK '+r.oracle+' '+(r.sha||'')):('SKIP #'+r.issue+' '+(r.skip||'')))}catch(e){console.log('ERR #$n')}")
  SUMMARY="${SUMMARY}issue #${n}: ${OK}\n"
  case "$OK" in OK*) DEPLOYED_NEW="yes";; esac
done

# 3. Rebuild + deploy gallery if new cards were added --------------------------
if [ -n "$(git status --porcelain src/data/oracles/ 2>/dev/null)" ]; then
  bun run build >/tmp/loop-tick-gallery.log 2>&1
  [ -d dist/_worker.js ] && cp public/.assetsignore dist/.assetsignore 2>/dev/null
  npx wrangler deploy >>/tmp/loop-tick-gallery.log 2>&1 && SUMMARY="${SUMMARY}gallery rebuilt+deployed\n"
fi

# 4. Commit registry + gallery cards (never README) + push --------------------
git stash push -m tmp CLAUDE.md >/dev/null 2>&1
git add deployments/registry.json src/data/oracles/ >/dev/null 2>&1
if ! git diff --cached --quiet; then
  git -c user.name="Nat" -c user.email="oracle.wavep@gmail.com" commit -m "chore: auto-loop — redeploy stale + deploy new issues" >/dev/null 2>&1
  git pull --rebase origin main >/tmp/loop-tick-pull.log 2>&1 || {
    # self-heal README conflict (Action owns it)
    git checkout --ours README.md 2>/dev/null
    git add README.md 2>/dev/null
    git -c core.editor=true rebase --continue >/dev/null 2>&1
  }
  git push origin main >/dev/null 2>&1 && SUMMARY="${SUMMARY}committed + pushed\n" || SUMMARY="${SUMMARY}push FAILED\n"
else
  SUMMARY="${SUMMARY}nothing to commit\n"
fi
git stash pop >/dev/null 2>&1

printf "===== LOOP TICK SUMMARY =====\n%b" "$SUMMARY"
