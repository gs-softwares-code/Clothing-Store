# Deployment — FORME

## Target: Vercel

The project is a standard Next.js 16 app — deployable as-is.

1. Push the repository to GitHub.
2. In Vercel: **New Project → Import** the repo.
   - Framework preset: Next.js (auto-detected).
   - Build command: `npm run build` (default).
   - Install command: `npm install` (default).
3. Environment variables (optional for demo, required for DB path):
   - `DATABASE_URL` — Neon Postgres connection string (optional; demo runs without)
   - `NEXT_PUBLIC_SITE_URL` — canonical origin for metadata/sitemap
4. Deploy. The store runs immediately with zero backend configuration.

## Local production run

```bash
npm run build
npx next start
```

## Configuration notes

- Images are loaded from `images.unsplash.com` (allowed via `remotePatterns`).
- Demo order data is in-memory: **restarting the server clears orders**.
  Persist by enabling `DATABASE_URL` (see `docs/DATABASE.md`).
- `robots.txt` and `sitemap.xml` are generated at build; update the origin
  in `app/sitemap.ts` / `app/robots.ts` when deploying to a custom domain.

## Environment reference

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | no (demo) | Postgres connection string for Drizzle/Neon |
| `NEXT_PUBLIC_SITE_URL` | no | Site origin for metadata & sitemap |
