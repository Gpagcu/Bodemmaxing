# Bordemmaxing

**Repository:** https://github.com/Gpagcu/Bordemmaxing
**Live site:** https://gpagcu.github.io/Bordemmaxing/
**API:** _not yet deployed — running locally at `http://localhost:4000/healthz` during development_

> **This deployment is running in demo mode.** The interface is real; the backend
> is simulated in your browser so the site works without a server. See
> [Demo mode](#demo-mode) below. This notice will be removed once the API is live.

## 1. Overview

Bordemmaxing is a "side quest" app for when you're bored. Instead of picking
from a static list, you spin a gashapon-style machine that draws a random
quest for you to do — anything from "drink a glass of water" to a rare or
"legendary" challenge. Quests are organized by rarity, and you can add your
own quests to the pool alongside the 50 built-in ones. It's for anyone who
wants a small, low-stakes nudge to do something different when they're stuck
in a boredom rut.

## 2. Setup and installation

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A PostgreSQL database — either a local instance or a free hosted one (this
  project currently runs against [Neon](https://neon.tech))
- `npm` (comes with Node.js)

**1. Clone the repo:**
```bash
git clone https://github.com/Gpagcu/Bodemmaxing.git
cd Bodemmaxing
```

**2. Install dependencies:**
```bash
cd server
npm install
cd ../client
npm install
cd ..
```

**3. Environment and configuration**

Copy the example env files and fill them in:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Variables needed in `server/.env`:

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/dbname?sslmode=require` | Your Postgres connection string (local or hosted) |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins, no trailing slash |
| `NODE_ENV` | `development` | Set to `production` on a deployed host |
| `PORT` | _(leave unset locally)_ | The host sets this in production; defaults to `4000` locally |

Variables needed in `client/.env`:

| Variable | Example | Notes |
|---|---|---|
| `VITE_USE_MOCK_API` | `false` | Only the exact string `false` turns off demo mode; unset means the app runs on a simulated in-browser backend |
| `VITE_API_BASE_URL` | `http://localhost:4000` | The Express API's URL, no trailing slash |

**Never commit real credentials.** `.env` files are git-ignored; only the
`.env.example` files (with placeholders) are committed.

**4. Set up and seed the database**

Run the schema, then the seed data, against your Postgres instance (via
`psql`, or a hosted provider's SQL editor):
```bash
psql <your-database-url> -f server/db/schema.sql
psql <your-database-url> -f server/db/seed.sql
```
This creates the `quests` and `quest_history` tables and inserts 50 preset
quests spread across five rarity tiers.

## 3. How to run it

**Start the API:**
```bash
node server/server.js
```
You should see:
```
Bordemmaxing API running on port 4000 (development)
```

**Start the client** (in a separate terminal):
```bash
cd client
npm run dev
```
Open the address Vite prints (typically `http://localhost:5173`).

**Quick check the backend is alive and can reach the database:**
```bash
curl http://localhost:4000/healthz
```
should return `{"status":"ok"}`.

```bash
curl http://localhost:4000/api/quests
```
should return JSON — a list of quests.

## 4. Features and usage

- **Spin for a quest** — draw a random quest from the pool. Presets are
  weighted by rarity (common quests are far more likely than legendary
  ones); if you've added your own quests, there's a separate chance to draw
  one of those instead.
- **Add a quest** — add your own custom quest to the pool. User-added quests
  always get a `unique` rarity, separate from the preset tiers.
- **Complete a quest** — mark a drawn quest as done. Each completion is
  logged, so the same quest can be completed more than once over time.
- **View history** — see a log of everything you've completed and when.

**Main API endpoints:**

| Method | Path | What it does |
|---|---|---|
| `GET` | `/healthz` | Health check — confirms the API is up and can reach the database |
| `GET` | `/api/quests` | List quests (presets, plus your own if a user id is provided) |
| `GET` | `/api/quests/spin` | Draw one random quest (rarity-weighted) |
| `POST` | `/api/quests` | Add a new user quest (`{ text, category }`) |
| `PATCH` | `/api/quests/:id/complete` | Mark a quest as completed |
| `DELETE` | `/api/quests/:id` | Delete a quest you added |
| `GET` | `/api/history` | List your completed-quest history |

## 5. Project structure

```
Bodemmaxing/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # API client: httpApi.js (real), mockApi.js (demo), index.js (switch)
│       ├── components/     # SpinScreen, AddQuestScreen, HistoryScreen, DemoNotice
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── db/
│   │   ├── pool.js         # Postgres connection pool
│   │   ├── schema.sql      # Table definitions
│   │   └── seed.sql        # 50 preset quests
│   ├── questsRepo.js       # Data-access layer + weighted spin logic
│   ├── server.js           # Express app and routes
│   └── .env.example
├── docs/                   # Course-required planning/design docs
├── journal/                # Weekly learning log entries
├── REPORT.md                # Weekly increment reports
├── AI-USAGE.md
└── README.md
```

## 6. Screenshots

<img width="759" height="701" alt="image" src="https://github.com/user-attachments/assets/b16207db-452e-46a4-9378-cc4daabe6763" />
<img width="818" height="738" alt="image" src="https://github.com/user-attachments/assets/778123d3-cfc0-46dc-b888-0834b3020543" />
<img width="702" height="540" alt="image" src="https://github.com/user-attachments/assets/761d2e1f-afac-47de-96c0-6fb79fdcb3d5" />

## Demo mode

This repository can run two ways, chosen by one environment variable at
**build** time.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset, or `true` | The client answers its own requests from `localStorage`. No server, no database, nothing shared between visitors. This is what the GitHub Pages link runs by default. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes real PostgreSQL. |

GitHub Pages serves files and cannot run Node, so the API and database live
elsewhere. Current status:

| Piece | Status |
| --- | --- |
| **Client** | Deployed to GitHub Pages |
| **API** | Built and fully tested locally; hosting (Render/Railway) not yet set up |
| **Database** | Live, hosted on [Neon](https://neon.tech) |

## 7. Known issues and next steps

**Known issues:**
- No authentication — user identity is currently a lightweight per-browser id
  passed as a header, not real login. Fine for this project's scope, but
  worth flagging as a simplification.
- The self-hosted Docker path (`compose.yml`) is untested — development has
  used a hosted Postgres instance (Neon) instead, after running into a
  BIOS-level virtualization block trying to get Docker running locally.
- A couple of seeded preset quests have minor text/spacing typos from an
  earlier copy-paste; not yet cleaned up.
- Frontend is functional but unstyled — no gashapon spin animation or
  rarity-based visual styling yet.

**Next steps:**
- Deploy the Express API to a real host (Render or Railway) so the live
  GitHub Pages site can run against the real database instead of demo mode.
- Style the spin animation and rarity visuals.
- Add real screenshots and a demo video once the UI is polished.
- Clean up the typo'd seed entries and reconsider the tone of a couple of
  the "legendary" tier quests before final submission.

## Architecture

The React client (Vite, deployed to GitHub Pages) talks to an Express API
over HTTP, which is the only thing that talks to PostgreSQL directly. The
database is hosted on Neon. Locally, the client can run against either a
simulated in-browser backend (`mockApi.js`) or the real API (`httpApi.js`) —
chosen by one build-time environment variable — so the interface can be
demoed even before the API is deployed publicly.

## Author

Pagcu, Carl Gaebriel J. (Gpagcu), HAU-6APSI.

## Licence

MIT, see [LICENSE].

---

Parts of this project's setup, debugging, and documentation were assisted by
AI (Claude). See `AI-USAGE.md` for details.
