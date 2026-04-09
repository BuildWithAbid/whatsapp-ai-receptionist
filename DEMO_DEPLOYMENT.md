# Demo Deployment Guide

This guide is for creating a safe public demo or portfolio deployment of the project.

## Goal

Create a demo link that helps others evaluate the app without exposing real customer data or accidentally sending messages from a production business account.

## Recommended Demo Stack

- App runtime: Vercel
- Database: Neon or Supabase Postgres
- Source repo: GitHub
- Demo data: Prisma seed script
- WhatsApp: Meta sandbox or a dedicated non-production business number only

## Demo Safety Rules

- Do not connect a real production WhatsApp number to a public demo.
- Do not use real customer data in the seed database.
- Do not expose admin credentials in the README or client-side code.
- Do not commit actual `.env` files.
- Keep outbound automation disabled unless you are using a safe sandbox environment.

## Option A: UI-Only Public Demo

This is the safest option if you only want a live portfolio link.

### Recommended setup

1. Deploy the app to Vercel.
2. Create a hosted Postgres database.
3. Run Prisma push and the seed script.
4. Use demo credentials known only to you.
5. Leave `WHATSAPP_ACCESS_TOKEN` empty.
6. Leave `OPENAI_API_KEY` empty if you do not want live AI calls in the demo.
7. Show the UI, settings, seeded leads, and seeded bookings without live message traffic.

### Why this is good

- Safe to share publicly
- No risk of accidental outbound WhatsApp sends
- Still demonstrates the product structure and UX

## Option B: Controlled Interactive Demo

Use this only if you want to demonstrate real webhook flow.

### Recommended setup

1. Create a dedicated Meta sandbox or non-production WhatsApp app.
2. Use a separate phone number and business account identifiers for the demo.
3. Seed a dedicated demo workspace.
4. Keep all demo traffic isolated from any production workspace.
5. Monitor logs carefully.
6. Consider setting `autoReplyEnabled` to true only for the demo workspace.

### Additional protections

- Add a banner to the demo environment saying it is a sample workspace.
- Rotate credentials if the environment is shared broadly.
- Avoid sharing any admin account password publicly.

## Vercel Demo Deployment Steps

1. Import the GitHub repository into Vercel.
2. Add environment variables from `.env.example`.
3. Set:

```txt
DATABASE_URL=...
NEXTAUTH_URL=https://your-demo-domain.vercel.app
NEXTAUTH_SECRET=...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=...
OPENAI_API_KEY=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_APP_SECRET=...
```

4. Trigger a deploy.
5. Run database setup commands:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

If you are using Vercel, run the Prisma commands through your preferred migration/deployment workflow or a CI job.

## Suggested Demo Experience

For a public link, keep the demo simple:

- landing page
- sign-in page
- seeded dashboard
- settings pages with sample business data
- seeded leads and booking requests

This gives visitors a reliable view of the product without creating operational risk.

## Optional Enhancements

- Add a `DEMO_MODE=true` environment flag later for:
  - obvious demo banners
  - disabled destructive actions
  - fake-safe webhook responses
  - outbound send blocking

## Final Recommendation

If the goal is open-source discoverability and portfolio credibility, ship a UI-first public demo first. Add live WhatsApp interactivity only when you can isolate it safely.
