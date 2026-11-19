# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/faridzafrizal01-ui/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/faridzafrizal01-ui/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Platinum Path** — a complete, offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5. It covers all 55 official trophies (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden) with each trophy's official name, description and grade, plus a guide written for this entry that names its sources (the Official PlayStation trophy list, Exophase's GTA VI PSN trophy list and the PSNProfiles GTA VI Trophy Guide). A four-phase roadmap (story first, post-story clean-up, collectibles and activities, endgame) orders the platinum run, and the 9 missable trophies are flagged with their points of no return. The tracker saves progress in the browser, filters by kind (story, missable, collectibles, activities, online) and grade, offers a spoiler shield that hides unearned story trophies, and exports and imports progress as a JSON file. Everything is static files under `app/` — no build step, no network at run time.

## Run it

```sh
node serve.ts
```

Then open the local address it prints to use the guide. To produce the hand-in exactly as the grader does, run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`, which copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=p1p2xzqh&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
