# Deployment — PSX AlphaBrief

This app is a long-running Node server. It is **not** a static website:
the schedules (daily 08:00, weekly Saturday 10:00, news weekdays 17:00,
all Asia/Karachi) are `node-cron` jobs inside the server process. If the
process is not running at the scheduled time, that send simply does not
happen. Deploying only the `vite build` output sends nothing.

## Requirements

- Node.js 20+ (the repo was built with Node 24; `tsx` runs the TypeScript
  server directly — no separate compile step is needed to start it).
- An always-on host: Render, Railway, Fly.io, a VPS, or any host that
  keeps one Node process alive. A free tier that sleeps after inactivity
  will miss scheduled sends; use a host/plan that stays awake, or accept
  that sends only happen while the process is up.
- Environment variables set as secrets on the host (never in git):
  `RESEND_API_KEY`, `EMAIL_FROM` (verified sender — see README), and
  optionally `GEMINI_API_KEY` and `APP_URL`.

## Steps (any always-on Node host)

1. Build the frontend once on the host (or in CI):
   `npm install && npm run build`.
2. Start the server with `npm start` (runs `tsx server.ts`, port 3000).
   In production (`NODE_ENV=production`) it serves the `dist/` build and
   the `/api/*` endpoints from the same process.
3. Set the env vars above on the host. Restart after changing them.
4. Give the process persistent storage for `.data_store.json` (a
   persistent disk/volume mounted at the app directory), or subscribers
   and report history are lost on every redeploy/restart. Before the
   first real send, open `.data_store.json` on the host and remove any
   seeded subscriber addresses that did not actually subscribe (see
   README, "Data & known limits").
5. Verify, in order:
   - `GET /api/pipeline/status` returns the three cron schedules.
   - Subscribe with your own email and confirm the welcome email arrives.
   - `POST /api/pipeline/run-news` returns success and the news email
     arrives; check the Resend dashboard if it does not.
   - Leave the process running until the next scheduled time and confirm
     the digest arrives.

## If emails do not arrive

1. Check `GET /api/pipeline/status`: a `failed` log names the provider
   error. A missing log at the scheduled time usually means the process
   was not running.
2. Check the Resend dashboard (Emails / Logs) for the rejection reason —
   the usual cause is an unverified `EMAIL_FROM` sender or a missing /
   wrong `RESEND_API_KEY`.
3. Check spam/junk, and confirm the subscriber is still `active` in
   `.data_store.json` (the unsubscribe endpoint sets `unsubscribed`).
4. Never put a real API key in code, `.env.example`, or a commit. Rotate
   any key that was ever committed or pasted in chat.

## What not to do

- Do not deploy this as a static site (GitHub Pages / Netlify Drop /
  Vercel static export): there is no server, so no API, no cron, and no
  email is ever sent.
- Do not commit `.env` or `.data_store.json`. `.data_store.json` is now
  git-ignored; a copy committed earlier remains in git history.
- Do not expose the manual pipeline endpoints (`POST /api/pipeline/*`)
  publicly without authentication — anyone who can reach them can trigger
  a bulk send.
