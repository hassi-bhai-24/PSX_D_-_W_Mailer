# PSX AlphaBrief — Pakistan Stock Exchange Automated Financial Intelligence

A Vite + React + TypeScript web app with an Express server that builds PSX
market digests and emails them to subscribers: a daily KSE-100 digest, a
weekly portfolio radar, a weekday news update, and a welcome email on signup.

> **Important — read before expecting emails:** email sending is real only
> when the server is configured with a Resend API key and a verified sender
> address (see [Email setup](#email-setup-resend)) **and** the server process
> is running when a scheduled send is due (see [DEPLOYMENT.md](DEPLOYMENT.md)).
> Without those, subscriptions are saved but no email is sent, and the
> pipelines report the failure instead of claiming success.

## What it does

| Email | Schedule (Asia/Karachi) | Content |
| --- | --- | --- |
| Daily digest | Mon–Fri, 08:00 | KSE-100 session summary, top gainers/losers/volume, LLM narrative |
| Weekly radar | Sat, 10:00 | 3-bullet macro brief, screened "worth watching" and "be careful with" lists, labelled market outlook |
| News update | Mon–Fri, 17:00 | Financial press headlines + LLM-generated macro context |
| Welcome | On signup (new subscribers only) | Confirms the subscription and lists the schedules above |

There is no login or account system in this app, so there are no login or
password emails. Subscribing only needs an email address; unsubscribing is
available from every email and from `POST /api/unsubscribe`.

## How to run it

```sh
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev            # development: tsx server.ts (Vite middleware, port 3000)
npm run build          # production frontend build (vite build -> dist/)
npm start              # production: tsx server.ts serving dist/ (port 3000)
npm run lint           # typecheck: tsc --noEmit
```

The server listens on port 3000. The frontend calls the same origin
(`/api/...`), so no separate API URL is needed.

## Configuration

Environment variables (see `.env.example` for placeholders — never commit a
real `.env`):

| Variable | Required? | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes, for any email | Resend API key. Set as an env var/secret on the host. |
| `EMAIL_FROM` | Yes, for any email | Sender address, e.g. `PSX AlphaBrief <updates@example.com>`. Must be verified in Resend. |
| `GEMINI_API_KEY` | No | Gemini key for LLM narratives/summaries. Without it, built-in fallback summaries are used. |
| `APP_URL` | No | Public URL of the hosted app. |
| `RESEND_BASE_URL` | No | Tests only: point the dispatcher at a local mock Resend server. |

## Email setup (Resend)

1. Create a free account at Resend and verify a sender: either verify your
   sending domain, or add a single sender email address and confirm it.
   Resend rejects mail from unverified senders — this is the most common
   reason a correctly configured send still fails.
2. Create an API key in Resend (sending access only is enough).
3. On the host, set `RESEND_API_KEY` to that key and `EMAIL_FROM` to the
   verified sender address. Never put the key in code, in `.env.example`,
   or in git.
4. Test with one real subscriber: start the server, subscribe with your own
   email, and check that the welcome email arrives. Then trigger the daily
   pipeline manually: `POST /api/pipeline/run-daily` and check
   `GET /api/pipeline/status` for a `success` log. If a send fails, the
   pipeline log and the API response say so with the provider's error —
   check the Resend dashboard for the rejection reason.

## Manual pipeline triggers

| Endpoint | Purpose |
| --- | --- |
| `POST /api/pipeline/run-daily` | Run the daily digest now |
| `POST /api/pipeline/run-weekly` | Run the weekly radar now |
| `POST /api/pipeline/run-news` | Run the news update now |
| `GET /api/pipeline/status` | Cron schedules + recent execution logs |
| `GET /api/preview/daily-html`, `/api/preview/weekly-html`, `/api/preview/news-html` | Preview the email HTML in a browser |

## Data & known limits — please read

- **Market data is simulated when live feeds are unreachable.** The scraper
  attempts the PSX Data Portal, but the live response is not parsed; quotes
  are generated deterministically from a fixed component list. News comes
  from RSS feeds when reachable, otherwise from a stored archive that the
  news email labels as archive, not current news. Do not treat figures in
  these emails as live market prices.
- **The weekly "Buy"/"Avoid" lists are mechanical screens**, not
  recommendations and not verified research. Risk labels on individual
  stocks are screen labels, not findings about any company. The outlook
  section in the weekly email is LLM-generated (or fallback text), is not a
  prediction, is not a guarantee, and is not personal investment advice.
- **Subscribers are stored in a local JSON file** (`.data_store.json`) on
  the machine running the server. That file is git-ignored going forward
  and must not be committed — it contains subscribers' email addresses.
  On first run with no store file, the app seeds a small list of subscriber
  addresses (pre-existing behaviour). **Before enabling real sending,
  review `.data_store.json` and remove any seeded addresses that did not
  actually subscribe.** Use a persistent volume or a real database before
  relying on this file in production; redeploying without one loses the
  subscriber list.
- **The server must stay running** for scheduled sends. `node-cron` only
  fires while the process is alive. A static-only deployment (frontend
  files with no running Node process) sends nothing. See
  [DEPLOYMENT.md](DEPLOYMENT.md).
- **No authentication exists.** Anyone who can reach the subscribe form
  can add an address, and anyone can trigger the manual pipeline endpoints.
  Do not expose the server publicly without adding auth/rate-limiting
  in front of it if that matters for your deployment.
- Email sending uses the Resend REST API directly via `fetch`; there is no
  SMTP configuration and no SendGrid support (the old code referenced a
  SendGrid key but never used it).

## Project layout

```
server.ts                     Express server + API endpoints + static serving
src/App.tsx                   React frontend entry (reports, subscribe form)
src/components/               UI components (EmailCapture, PipelineRunner, ...)
src/server/cron/scheduler.ts  node-cron schedules + the 3 pipelines
src/server/data/              PSX scraper (simulated fallback) + news RSS scraper
src/server/db/store.ts        JSON-file store: subscribers, reports, logs
src/server/email/dispatcher.ts  Real Resend sending (see Email setup)
src/server/llm/               Gemini prompts + engine (optional key, fallbacks)
src/server/templates/         Email HTML: daily, weekly, news, welcome
src/types/index.ts            Shared types
src/utils/rules.ts            Email validation, movers, sector + pick screens
```
