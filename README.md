# FPL Labs Pan

> **Entity × Time Decision Lab Data Product** for Fantasy Premier League (FPL).  
> Official working title: **FPL Labs Pan** · Aligned with X [@FPLabsPan](https://x.com/FPLabsPan).

---

## 1. Product Thesis

`ajmclab.com` remains the personal research journal and engineering diary.  
**FPL Labs Pan** is the dedicated **entity × time data product** architected for programmatic SEO, reproducible decision science, and verifiable pre-deadline auditability.

We do **not** compete as a commodity player expectation hub (platforms like FPL Review already own raw tabular point screens). Instead, this product leads exclusively with **lab-native artefacts**:

1. **Decision Replay & Policy-Arm Pages (Template D) — PRIMARY MVP**  
   Pre-deadline frozen plans with parallel comparison across three controlled policy arms:
   - **Baseline Heuristic**: Unweighted rolling horizon template consensus.
   - **Optimiser (MILP)**: 5-week discounted mixed-integer linear solver (`HiGHS-MILP-v1.7.2`).
   - **Multi-Objective Agent**: Monte Carlo simulated policy exploring 90th percentile ceiling outcomes.
2. **Chip Horizon Scenario Pages (Template C)**  
   Full-season mathematical solvers calculating opportunity cost and optimal deployment windows for Triple Captain (`tc`), Bench Boost (`bb`), Free Hit (`fh`), and Wildcard (`wc`).

---

## 2. Laboratory Standards & Cryptographic Freeze Protocol

Conventional fantasy content suffers from retroactive rationalisation, survivorship bias, and unverified post-hoc claims. FPL Labs Pan enforces:

- **T-120min Execution Lock**: Model inputs, player projection matrices, and solver parameters are locked exactly two hours prior to the official Premier League deadline.
- **SHA-256 Digest**: Each round produces a canonical JSON snapshot hashed with SHA-256 (e.g. `sha256:7c92b7a2d488...`).
- **Zero Retroactive Edits**: Projections are immutable. Pending fixtures render explicit placeholder states until official settlement.
- **Neutral Product Voice**: No first-person diaries, clickbait narratives, or influencer commentary. Strict adherence to dual variables, shadow prices, and empirical error metrics.

---

## 3. Route Architecture

| Route | Template | Purpose |
|---|---|---|
| `/` | Product Home | Value proposition, comparative architecture vs tip blogs/commodity hubs, latest GW freeze state, quick links |
| `/decisions` | Gameweek Index | Searchable catalog of all gameweeks with freeze timestamps, top arm delta, and completion status |
| `/decisions/gw/[n]` | **Template D** | Validated squad plan (XI, bench, captain, transfers, bank), arms comparison table, projected vs realised points, frozen_at + snapshot hash, related sims |
| `/replays/[season]/gw/[n]/[arm]` | Policy Arm Detail | Arm-specific breakdown: captaincy candidates, solver constraint duals (binding vs slack), sensitivity what-if scenarios, raw JSON export |
| `/chips/[chip]/gw/[n]` | **Template C** | Chip deployment solver table (tc, bb, fh, wc), immediate net gain vs historical benchmark, 38-GW window opportunity cost |
| `/sims` | Simulations Index | Catalog of labelled historical counterfactual simulations grounded in point-in-time frozen priors |
| `/sims/[season]/gw/[n]/[scenario]` | Counterfactual Sim Replay | Dedicated counterfactual page: hypothesis, inputs frozen_at + snapshot_hash, control vs treatment table, delta vs control, labelled sim badge |
| `/methods` | Methods & Calibration | MILP mathematical formulation, freeze protocol rules, grounded simulation pipeline (no fake seasons), and position-by-position RMSE/MAE evaluation table |
| `/about` | Product About | Lab mission, independence, and disclaimers (not financial advice, not affiliated with PL/FPL) |
| `/sitemap.xml` | Programmatic SEO | Dynamic sitemap indexing all gameweeks, policy arms, chip scenarios, counterfactual sims, and core pages |
| `/robots.txt` | Crawler Directives | Standard crawler allowlist and sitemap pointer |

---

## 4. Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (strict types, zero `any` shortcuts)
- **Styling**: Tailwind CSS v4 with custom laboratory theme (`tabular-nums`, high-density typography)
- **Icons**: `lucide-react`
- **Data Engine**: Typed fixture datasets in `data/` (`gameweeks/`, `chips/`, `calibration.json`)
- **SEO & Schema**: JSON-LD (`WebSite`, `BreadcrumbList`, `Dataset`) on every page

---

## 5. Local Setup & Running Instructions

### Prerequisites
- Node.js `v20+` or `v22+` (v22.14.0 tested)
- npm `v10+`

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd fpl-labs-pan

# Install dependencies
npm install
```

### Development Server
```bash
# Run local dev server (default port 3000 or custom port)
npm run dev

# Or bind to custom port:
npm run dev -- -p 34892
```
Navigate to `http://localhost:34892` to view the running application.

### Production Build & Verification
```bash
# Compile and generate all static pages (SSG)
npm run build

# Start the production server
npm start
```

### Linting
```bash
npm run lint
```

---

## 6. Project Structure

```
├── app/
│   ├── layout.tsx                     # Root layout with navbar, footer, demo banner, global JSON-LD
│   ├── page.tsx                       # Home page (Thesis, latest GW freeze, comparison matrix)
│   ├── globals.css                    # Tailwind CSS v4 styling & laboratory variables
│   ├── sitemap.ts                     # Dynamic XML sitemap generation
│   ├── robots.ts                      # Robots.txt configuration
│   ├── decisions/
│   │   ├── page.tsx                   # /decisions index table
│   │   └── gw/[n]/
│   │       └── page.tsx               # Template D (Decision Replay & Policy Arms)
│   ├── replays/[season]/gw/[n]/[arm]/
│   │   └── page.tsx                   # Individual policy arm deep-dive replay
│   ├── chips/[chip]/gw/[n]/
│   │   └── page.tsx                   # Template C (Chip scenario horizon solver)
│   ├── sims/
│   │   ├── page.tsx                   # /sims index catalog of counterfactual replays
│   │   └── [season]/gw/[n]/[scenario]/
│   │       └── page.tsx               # Counterfactual replay detail page with labelled badge
│   ├── methods/
│   │   └── page.tsx                   # Formulation, freeze protocol, simulation pipeline, calibration
│   └── about/
│       └── page.tsx                   # Lab mission, thesis, and legal disclaimers
├── components/
│   ├── Navbar.tsx                     # Global navigation header with active round indicator
│   ├── Footer.tsx                     # Comprehensive footer with legal disclaimers
│   ├── DemoNoticeBanner.tsx           # Pre-production illustrative sample data notification
│   ├── ProvenanceCard.tsx             # Interactive freeze timestamp, model version & SHA-256 hash card
│   ├── ArmsComparisonTable.tsx        # High-density comparative policy arms matrix
│   ├── PitchLineup.tsx                # Tactical Starting XI pitch layout + bench auto-sub priority
│   └── JsonLd.tsx                     # Script injector for Schema.org structured data
├── data/
│   ├── gameweeks/                     # Typed GW1, GW2, GW3 datasets with complete provenance
│   ├── chips/                         # tc.json, bb.json, fh.json, wc.json scenario models
│   ├── sims/                          # Labelled historical sim packs (haaland, chip, baseline)
│   └── calibration.json               # Position-by-position MAE, RMSE, and bias metrics
├── lib/
│   └── data.ts                        # Data loader & typed accessors
└── types/
    └── fpl.ts                         # Complete TypeScript domain contracts
```

---

## 7. Connecting & Deploying to Vercel

The application is structured as a standard zero-configuration Next.js App Router project deployable directly to Vercel from the `main` branch.

### Connecting via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import `Al2800/fpl-labs-pan`.
3. Keep default settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Set Environment Variables (optional override):
   - `NEXT_PUBLIC_SITE_URL`: `https://fpl-labs-pan.vercel.app` (or your production custom domain)
   - `SITE_URL`: `https://fpl-labs-pan.vercel.app`
5. Click **Deploy**. Vercel will build all static pages and deploy previews on PRs and production on merges to `main`.

---

## 8. Legal Disclaimer

FPL Labs Pan is an independent open statistical decision intelligence laboratory. This project is **not** affiliated with, endorsed by, or sponsored by the Football Association Premier League Ltd, Fantasy Premier League, or any Premier League football club. All club insignias, player names, and trademarks belong to their respective owners. Statistical outputs and policy recommendations are strictly for research, decision science evaluation, and entertainment purposes — **not financial, gambling, or betting advice**.
