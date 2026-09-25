# SEO handoff: FPL Replay

Updated: 2026-09-25

Repository: [Al2800/fpl-labs-pan](https://github.com/Al2800/fpl-labs-pan)  
Production site: https://www.fplreplay.com  
Canonical host: `www.fplreplay.com`

## Current search snapshot

The latest figures supplied for this handoff are from Google Search Console for the 28 days through 2026-09-20. They were not refreshed during the 2026-09-24 work.

- Site: 2 clicks, 228 impressions, average position 13.8.
- `/chips/triple-captain`: 1 click, 95 impressions.
- 33 of 53 known URLs were indexed. The report showed a large discovered-but-not-indexed group.
- Query-level counts were not supplied.

Definitional chip queries are the priority: “what is triple captain in fpl”, “bench boost”, “free hit”, “wildcard fpl meaning”, and “when to play chips”. Map current GSC queries to existing URLs before making content changes. The main targets are the four `/chips/*` pages, `/chips`, and `/guides/when-to-play-fpl-chips`. “FPL gameweek 37” maps to the 2025/26 season page and its GW37 replay.

## Work completed on 2026-09-24

- Added source-linked scenario cards to the Triple Captain, Bench Boost, Free Hit, and Wildcard hubs.
- Added a short GW37 result note to the 2025/26 season page.
- Corrected copy that had attributed the GW34 eight-point hit to the template. The optimiser took the hit; the template held and scored 33.
- Recorded the supplied queries and GSC snapshot in `SEO_CHANGELOG.md`.
- Vercel reported success. The seven affected live pages returned HTTP 200 and showed the updated copy.
- IndexNow accepted a 12-URL submission for canonical `www` URLs: the four chip pages, `/chips`, `/guides/when-to-play-fpl-chips`, `/guides/2025-26-season-review`, `/guides`, `/seasons/2025-26`, GW34, GW37, and the homepage.
- The key file returned HTTP 200 on `www`; the apex redirected to `www` and returned HTTP 200 after following the redirect.
- The user asked for this update to go directly to `main`, so it has no PR. The normal SEO workflow below calls for a PR and merge. Follow the user's latest instruction for future work.

## Replay data and provenance

Use these repository files when citing 2025/26 replay results:

| Use | Source | Recorded values |
| --- | --- | --- |
| Season total | `data/seasons/2025-26/index.json` | Optimiser 2,010; template 1,990; `chipsPlayed` is empty. These totals do not measure chip value. |
| GW34 hit | `data/seasons/2025-26/gw-34.json` | Optimiser made 3 transfers with 1 free transfer available, took an 8-point hit, and scored 28 net. The template held and scored 33. |
| GW37 captain and bench | `data/seasons/2025-26/gw-37.json` | Optimiser scored 70, template 63. Gabriel scored 6 points as captain at a 2x multiplier. The four listed bench scores were 0, 6, 0, 0. The optimiser made no transfers and used no chip. |

The GW37 Triple Captain card's 18 captain points and six-point increase are illustrative arithmetic from Gabriel's recorded 6 points. The Bench Boost card's 76-point total adds the recorded 6 bench points to the replay's 70. Neither chip was used in the replay. Keep those examples labelled as calculations, not observed chip results or timing advice. The GW34 data does not support saying the template took the hit.

The 2025/26 pages describe a reconstructive replay, not a live two-hour freeze. The 2026/27 pages are illustrative samples. Keep those limits visible when describing the data.

## Weekday workflow

1. Read the latest entries in `SEO_CHANGELOG.md` before editing a page.
2. Pull current GSC query and page reports, map queries to live URLs, and record the date range and numbers used.
3. Deepen the existing chip hubs and guides before creating URLs. Answer definition queries directly in the first sentence, then refine the title, meta description, lead, and FAQs.
4. Tie every replay number to a source file or snapshot link. Do not invent community chip usage percentages or present an unmodelled chip outcome as a result.
5. Draft the copy, rewrite it in a plain human voice, then check for clichés and em dashes. The site writing rule is zero em dashes. Avoid these terms and phrases in published copy: “delve”, “landscape”, “robust”, “seamless”, “leverage”, “unlock”, “elevate”, “empower”, “fast-paced”, “in this guide”, “game-changer”, and “Whether you”.
6. For SEO page changes, open a PR, add an entry to the top of `SEO_CHANGELOG.md` in that PR, then merge. Include the date, PR link, page URLs, queries, GSC figures or “not recorded”, change summary, and a blank Result line.
7. On the same day, submit changed priority URLs to IndexNow, Bing Webmaster Tools, and GSC Request indexing within quota. The repository helper is `npm run indexnow`; it defaults to chip hubs and core guides. Pass URLs with `npm run indexnow -- <url> ...` to submit a specific set.

## Next actions

- On the next workday, get fresh GSC query, page, and indexing reports. The current figures above are only the supplied 2026-09-20 snapshot.
- Prioritise the chip cluster and unindexed hub pages for indexing. Recheck the key URL if IndexNow reports a key error.
- GSC Request indexing and a separate Bing Webmaster submission were not completed on 2026-09-24 because those connectors were unavailable in that session. Complete them when account access is available; do not treat the successful IndexNow response as a GSC request.
- Review the 2026-09-22 and 2026-09-24 changelog entries about four weeks after their changes, around 2026-10-20 and 2026-10-22.

Useful files: `SEO_CHANGELOG.md`, `lib/content/chips.ts`, `lib/content/guides.ts`, `app/chips/[chip]/page.tsx`, `app/seasons/[season]/page.tsx`, and `scripts/submit_indexnow.mjs`.
