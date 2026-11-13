# FORME — Fashion E-Commerce

A premium, production-quality fashion e-commerce experience, built by
**GS Softwares** as an engineering showcase. FORME is a fictional retail
brand — minimalist, editorial, and fully functional.

> The reference experience is UNIQLO's. The identity is FORME. The
> engineering showcase belongs to GS Softwares.

## Features

- Editorial homepage: campaigns, category tiles, new arrivals, best sellers,
  essentials, brand storytelling, newsletter.
- Complete catalogue: **57 seeded products** across Women / Men / Kids / Baby,
  with colours, sizes, prices, discounts, materials, and verified imagery.
- Product listing pages with breadcrumbs, banners, sorting, and a full
  filter system (colour, size, type, collection, price) — synced to the URL.
- Product detail pages: gallery, colour/size validation, size guide,
  quantity, wishlist, delivery/returns info, related + recently viewed.
- Search overlay with suggestions, live results, and a dedicated results page.
- Cart drawer + cart page with quantities, persistence (localStorage), and
  delivery logic.
- Wishlist with persistent state and move-to-bag.
- Multi-step **demo checkout** (contact → delivery → payment → review →
  confirmation with order reference). Server-side recalculation of every total.
- Versioned API (`/api/v1/*`) with Zod validation.
- GS Softwares `/showcase` case-study page.
- Responsive from 360px; accessible drawers/modals; semantic HTML; sitemap + robots; JSON-LD product data.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Zod · Drizzle (schema/ORM, Postgres-ready) · Vitest · Playwright.

## Running

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npx next start
```

## Testing

```bash
npm test            # unit (Vitest)
npm run test:e2e   # end-to-end (Playwright)
```

## Docs

`docs/` contains: project audit, reference analysis, implementation plan,
architecture, database, API, testing, deployment, and live project status.

## Demo mode

The app runs immediately with an in-memory data adapter. Set `DATABASE_URL`
to enable the included Drizzle/Neon Postgres path (see `docs/DATABASE.md`).

---

⚠️ FORME is a fictional brand and demonstration project. No real products are
sold, no real payment is processed, and no business metrics are claimed.
