# Architecture — FORME Fashion Commerce

## High-level layering

```
app/                    Next.js App Router (routes + API)
 ├─ layout.tsx          root layout: providers, header, footer
 ├─ page.tsx            homepage
 ├─ [category]/         women | men | kids | baby (PLP)
 ├─ product/[slug]/     PDP
 ├─ collections/        campaign landing pages
 ├─ cart, wishlist, search, checkout, order-confirmation/[]
 ├─ api/v1/             versioned REST API
 ├─ sitemap.ts, robots.ts
components/             feature components (header, cards, listing, detail…)
 ├─ ui/                 design-system primitives (button, drawer, toast…)
lib/
 ├─ domain/             types, categories, navigation, shipping, zod schemas
 ├─ data/               catalogue seed + pure query functions
 ├─ commerce/           client state: cart & wishlist (localStorage-persisted)
 ├─ server/             demo order store (in-memory service)
db/                     Drizzle schema + migrations (Postgres path)
```

## Key decisions

| Concern | Decision |
|---|---|
| Rendering | Server components by default; client islands only where interactive (drawers, cart, checkout, filters). Static generation for catalogue/PLP/PDP via `generateStaticParams`; PPR shells for dynamic params. |
| State | Cart/wishlist live in React Context, persisted to `localStorage` (`forme.cart.v1`, `forme.wishlist.v1`). Catalogue is server data. |
| Data access | Repository-style separation: UI → domain queries (`lib/data/catalog.ts`) → adapter. Demo adapter is the module dataset; Postgres adapter (Drizzle) activates when `DATABASE_URL` is set. |
| API | Versioned `/api/v1/*`; Zod-validation; prices/totals recomputed server-side; client values never trusted. |
| Auth | Not implemented (no accounts in demo). Ownership checks documented for the Postgres path. |
| Images | Unsplash CDN (verified URLs) via `next/image` with `remotePatterns`; `ImageWithFallback` renders a neutral placeholder on failure. |

## Module map

- `lib/domain/types.ts` — Product, CartItem, Order, Category, …
- `lib/domain/categories.ts` — taxonomy + collections metadata
- `lib/domain/navigation.ts` — header/mega-menu model
- `lib/domain/shipping.ts` — delivery methods + fee rules
- `lib/domain/checkout-schema.ts` — shared client/server Zod schemas
- `lib/data/catalog.ts` — 57-product seed + query helpers
- `lib/commerce/shop-context.tsx` — cart/wishlist provider
- `lib/server/orders-store.ts` — demo order service

## Flow: order placement

1. Checkout wizard (client) validates step-by-step with `addressSchema`/card format checks.
2. `POST /api/v1/orders` receives items (ids + qty) and shipping.
3. Server re-fetches products from the catalogue, validates stock/status, recalculates unit prices, subtotal, discount, shipping fee and total.
4. Order stored via `orders-store` (or Postgres adapter) → returns reference.
5. Client clears bag and routes to `/order-confirmation/:id`.
