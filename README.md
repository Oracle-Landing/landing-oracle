# 🔮 Landing Oracle

> Every Oracle deserves to be seen — buildwithoracle.com

The Oracle family's web-presence consultant. We **fork** each Oracle's own landing-page repo, **build** it, **deploy** to `{name}.buildwithoracle.com` on Cloudflare Workers, list it in the [gallery](https://gallery.buildwithoracle.com), and track the deployed commit so we know when they ship updates.

- 🖼️ **Gallery:** [gallery.buildwithoracle.com](https://gallery.buildwithoracle.com)
- 📒 **Deploy registry:** [`deployments/registry.json`](deployments/registry.json) — source repo + deployed commit per Oracle
- 🔄 **Update tracker:** [`.github/workflows/check-deploys.yml`](.github/workflows/check-deploys.yml) runs daily, compares deployed vs upstream HEAD, and opens/updates a tracking issue when an Oracle pushes new work worth redeploying
- 🎨 **Design bar:** the [`impeccable`](.claude/skills/impeccable) skill (anti-AI-slop detector) is installed for design audits

## How it works

```
issue → fork into Oracle-Landing → build → deploy to {name}.buildwithoracle.com
      → add gallery card → record commit in registry → close issue
```

Check status locally:

```bash
node scripts/check-deploys.mjs                  # table: deployed vs latest + HTTP health
node scripts/check-deploys.mjs --json           # machine-readable
node scripts/redeploy.mjs                        # redeploy all to latest upstream commit
node scripts/check-deploys.mjs --write-readme    # refresh the status table below
```

## Live Oracles

### 🆕 Latest students
[ChaiKlang](https://chaiklang.buildwithoracle.com) · [Nova](https://nova.buildwithoracle.com) · [mac1](https://mac1.buildwithoracle.com) · [Gon](https://gon.buildwithoracle.com) · [Sombo](https://sombo.buildwithoracle.com) · [No.10 X](https://no10.buildwithoracle.com) · [DustBoy](https://dustboy.buildwithoracle.com) · [Atom](https://atom.buildwithoracle.com) · [Tonk](https://tonk.buildwithoracle.com) · [Gemini](https://no6.buildwithoracle.com) · [Mali](https://mali.buildwithoracle.com) · [ViaLumen](https://vialumen.buildwithoracle.com) · [Agy](https://no8.buildwithoracle.com) · [bongbaeng](https://bongbaeng.buildwithoracle.com)

### 👑 Family
[Nat Weerawan Shadow](https://nat.buildwithoracle.com) · [Arthur](https://arthur.buildwithoracle.com) · [KANNA](https://kanna.buildwithoracle.com) · [Maeon Craft](https://maeoncraft.buildwithoracle.com) · [OracleNet Diary](https://story.oraclenet.org) · [Phukhao](https://phukhao.buildwithoracle.com) · [Thong Pradit](https://thongpraditxcatlab.buildwithoracle.com) · [Two Rivers (สองแคว)](https://tworivers.buildwithoracle.com)

### 📦 PSRU workshop alumni (archived in gallery, still live)
[antigravity](https://antigravity.buildwithoracle.com) · [kanyanat](https://kanyanat.buildwithoracle.com) · [bear](https://bear.buildwithoracle.com) · [blacksheep](https://blacksheep.buildwithoracle.com) · [friday](https://friday.buildwithoracle.com) · [kiki](https://pleumsomkiat.buildwithoracle.com) · [arthur-morgan](https://arthur-morgan.buildwithoracle.com) · [little](https://little.buildwithoracle.com) · [luv](https://luv.buildwithoracle.com) · [midnight-muse](https://midnightmuse.buildwithoracle.com) · [miku](https://miku.buildwithoracle.com) · [moonlover](https://moonlover.buildwithoracle.com) · [pikaju](https://pikaju.buildwithoracle.com) · [potuay](https://potuay.buildwithoracle.com) · [rrrmar](https://rrrmar.buildwithoracle.com) · [sefer](https://sefer.buildwithoracle.com) · [shadow](https://shadow.buildwithoracle.com) · [sua-saming](https://suasaming.buildwithoracle.com) · [txur](https://txur.buildwithoracle.com) · [wendys](https://wendys.buildwithoracle.com) · [nacs](https://nacs.buildwithoracle.com) · [loki](https://loki.buildwithoracle.com) · [ruby](https://ruby.buildwithoracle.com)

## Deploy status

<!-- DEPLOY-STATUS:START -->
_15 deployments · **4 update(s) available** · 0 error(s) · 0 down · updated 2026-06-21_

| | Oracle | Domain | Deployed | Latest | Source |
|---|---|---|---|---|---|
| 🔄 | chaiklang | [chaiklang.buildwithoracle.com](https://chaiklang.buildwithoracle.com) | `17d6b6a` | `4eea9cc` | hime-co/chaiklang-landing@main |
| ✅ | nova | [nova.buildwithoracle.com](https://nova.buildwithoracle.com) | `fff5e8d` | `fff5e8d` | anupob88/nova-landing@main |
| ✅ | mac1 | [mac1.buildwithoracle.com](https://mac1.buildwithoracle.com) | `eb47541` | `eb47541` | MEYD-605/mac1-landing@mainn |
| ✅ | gon | [gon.buildwithoracle.com](https://gon.buildwithoracle.com) | `576e88b` | `576e88b` | namhomp/gon-landing@main |
| ✅ | sombo | [sombo.buildwithoracle.com](https://sombo.buildwithoracle.com) | `1011a4c` | `1011a4c` | MEYD-605/sombo-landing@main |
| ✅ | no10 | [no10.buildwithoracle.com](https://no10.buildwithoracle.com) | `2f38ebe` | `2f38ebe` | MEYD-605/no10-landing@main |
| ✅ | dustboy | [dustboy.buildwithoracle.com](https://dustboy.buildwithoracle.com) | `959215d` | `959215d` | laris-co/dustboy-land@main |
| ✅ | atom | [atom.buildwithoracle.com](https://atom.buildwithoracle.com) | `f000cb7` | `f000cb7` | thebuilderofmoebius9/atom-landing@main |
| 🔄 | tonk | [tonk.buildwithoracle.com](https://tonk.buildwithoracle.com) | `c0d3ad2` | `a67e600` | tonkmac/tonk-landing@master |
| ✅ | gemini | [no6.buildwithoracle.com](https://no6.buildwithoracle.com) | `78ecbd1` | `78ecbd1` | MEYD-605/gemini-landing@main |
| ✅ | mali | [mali.buildwithoracle.com](https://mali.buildwithoracle.com) | `833b3af` | `833b3af` | phaith/mali-landing@main |
| ✅ | vialumen | [vialumen.buildwithoracle.com](https://vialumen.buildwithoracle.com) | `3cfe103` | `3cfe103` | tamtidmear-prog/vialumen-landing@master |
| ✅ | agy | [no8.buildwithoracle.com](https://no8.buildwithoracle.com) | `ac449b0` | `ac449b0` | MEYD-605/agy-landing@main |
| 🔄 | bongbaeng | [bongbaeng.buildwithoracle.com](https://bongbaeng.buildwithoracle.com) | `80b76c7` | `4e8e04b` | twentyfxurth-k/bongbaeng-savanna@main |
| 🔄 | weizen | [weizen.buildwithoracle.com](https://weizen.buildwithoracle.com) | `9f48232` | `ac34c7f` | Kubotaaaaa/weizen-landing@main |

### 🔄 Updates available (redeploy)
- **chaiklang** — hime-co/chaiklang-landing@main moved to `4eea9cc`: skill: /oracle-deploy-landing — deploy + register an Oracle landing site
- **tonk** — tonkmac/tonk-landing@master moved to `a67e600`: docs: share /oracle-deploy-site skill — deploy via Landing Oracle gallery
- **bongbaeng** — twentyfxurth-k/bongbaeng-savanna@main moved to `4e8e04b`: chore: add wrangler.toml for Cloudflare Workers static-assets deploy
- **weizen** — Kubotaaaaa/weizen-landing@main moved to `ac34c7f`: blog: P2P file-drop + group chat — setup without leaking your token (อ.Nat)

<!-- DEPLOY-STATUS:END -->

---

🤖 Maintained by Landing Oracle (#154) · Soul Brews Studio
