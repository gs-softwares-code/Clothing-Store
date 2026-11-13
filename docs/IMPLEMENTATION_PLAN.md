# IMPLEMENTATION PLAN — FORME Fashion Commerce

**Phase 01 deliverable.** Status of each phase is tracked in `PROJECT_STATUS.md`.

---

## 1. Architecture (chosen)

```
app/
  (shop)/                     # storefront routes
    page.tsx                  # homepage
    category/[...slug]/       # PLP (women/, men/, kids/, baby/, sale/, new-arrivals/, collections/ mapped by slug)
    product/[slug]/           # PDP
    search/                   # search results
    cart/                     # full cart page
    checkout/                 # multi-step checkout demo
    order-confirmation/[id]/  # post-checkout screen
    wishlist/
    showcase/                 # GS Softwares case study
  api/v1/                     # versioned API (products, search, categories, collections, cart, wishlist, orders, newsletter)
lib/
  domain/                     # types, catalogue schema, validation (Zod), pricing/stock rules
  data/                       # adapter interface + DemoDataAdapter (active) + PostgresDataAdapter (dormant, Drizzle)
  commerce/                   # cart/wishlist service logic (pure, testable)
  ui/                         # design-system primitives (button, drawer, modal, toast, etc.)
components/                   # feature components (header, mega-menu, product-card, checkout-form…)
db/                           # Drizzle schema, migrations (documented; used only when DATABASE_URL set)
```

- **Server components** for page shells and product data; **client components** only where interactivity is required (drawers, cart, search, filters, checkout forms).
- **State:** Cart/wishlist in React Context persisted to `localStorage`; catalogue from server; orders via API (Demo adapter keeps them in a server-side store; Postgres adapter when configured).
- **API contract:** all mutations server-validated with Zod; prices/subtotals recalculated server-side; never trust client prices.

---

## 2. Data model (domain)

Product { id, slug, name, description, category, subcategory, price, discountPrice?, images[], colors[], sizes[], stock, status, featured, isNew, bestseller, attributes{material, care, fit}, collection?, rating? }

Supporting: categories, collections, promotions, cart items, wishlist items, orders, order items, newsletter subscriptions, customers (mirrors Drizzle tables in `db/schema.ts`).

---

## 3. Database plan (Neon + Drizzle)

Tables: users, customer_profiles, categories, products, product_images, product_variants, product_inventory, collections, collection_products, carts, cart_items, wishlists, wishlist_items, addresses, orders, order_items, promotions, newsletter_subscribers — with FKs, unique constraints, indexes, migrations, transactional order creation.

**Runtime note:** `DATABASE_URL` is unavailable in this environment → the app runs on `DemoDataAdapter`. The Drizzle schema, migration, and adapter are committed and documented; switching = set env var (steps in `DATABASE.md`).

---

## 4. Catalogue plan

- 40+ products across Women/Men/Kids/Baby; all brief fields; multiple colors/sizes/price ranges; selected discounts, new arrivals, best sellers, featured.
- Imagery: pre-verified Unsplash CDN URLs (unique primary image per product; hover/zoom secondary images; fallback placeholder component; `remotePatterns` configured).

---

## 5. Phases & exit criteria

| Phase | Scope | Exit criteria |
|---|---|---|
| **01 Report/Audit** | This plan + audit + reference analysis | Docs present & honest |
| **02 Foundation** | Scaffold Next.js/TS/Tailwind; design tokens; layout; header/footer; mega menu; mobile drawer; search overlay shell | Build passes; nav interactive at 360/768/1024/1440 |
| **03 Homepage** | Announcement, hero, campaigns, category sections, new arrivals, best sellers, editorial, newsletter, footer | Visual polish; no dead controls |
| **04 Catalogue** | Data model, seeds (40+), PLP, filters/sort, cards, PDP | Search/filter works; PDP + gallery + variant selection |
| **05 Commerce** | Search, cart drawer/page, wishlist, checkout demo, confirmation, order persistence (demo adapter) | Full journey works, persists across refresh |
| **06 Backend** | API v1 routes, Zod, server recalculation; Drizzle schema/migrations + adapter | API tests pass; docs updated |
| **07 Showcase** | `/showcase` case study + footer attribution | Page explains stack + capabilities, no fabricated metrics |
| **08 QA** | Vitest unit/integration; Playwright core journeys; responsiveness; a11y; perf | No critical defects; tests green |
| **09 Deploy** | Build, Vercel config, env docs, final verification | Production build passes; deploy steps documented |

---

## 6. Testing strategy

- **Vitest:** catalogue queries, validation, cart/wishlist logic, pricing, order creation, API handlers.
- **Playwright:** home loads; nav/mega menu; PLP filter+sort; search; add-to-cart drawer; qty/remove; wishlist move-to-cart; full checkout → confirmation; mobile nav drawer.
- **Manual checkpoints:** 360/390/768/1366/1440/1920 widths; horizontal overflow, broken images, console errors.

---

## 7. SEO / performance / security

- Metadata API, OG, JSON-LD (Product/Offer/BreadcrumbList); sitemap.ts; robots.
- next/image with dimensions; preload hero; lazy below-fold; minimal client JS.
- Server-side validation, parameterized queries, env protection, no secrets in client, safe errors, rate-limit guard on sensitive endpoints (submit/checkout) via middleware.

---

## 8. Known constraints

- Live UNIQLO reference blocked (documented) — build from documented patterns.
- No Neon/Vercel credentials — demo adapter + deployment docs.
- No client-specific real data — fictional metrics forbidden on showcase page.
