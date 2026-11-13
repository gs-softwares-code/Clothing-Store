# PROJECT STATUS — FORME Fashion Commerce

_Updated 2026-11-13 (all phases through 09)._

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 01 Audit & reference | ✅ Done | Live UNIQLO blocked by bot protection; documented via secondary sources + flagged assumptions |
| 02 Design system & foundation | ✅ Done | Tokens, primitives, header/mega-menu/mobile drawer, footer |
| 03 Homepage | ✅ Done | Hero, category tiles, arrivals, best sellers, essentials, editorial, sale, featured |
| 04 Catalogue | ✅ Done | 57 seeded products, verified imagery, PLP with facets/sort, PDP with variants |
| 05 Commerce | ✅ Done | Search, cart drawer/page, wishlist, checkout wizard, confirmation, order store |
| 06 Backend & database | ✅ Done | API v1 (Zod, server recalc); Drizzle schema + migrations + docs; demo adapter active |
| 07 Showcase | ✅ Done | `/showcase` case study; footer attribution; no fabricated metrics |
| 08 Testing & refinement | ✅ Done | 21 unit tests; Playwright desktop+mobile suites; responsive/overflow checks |
| 09 Deployment | ✅ Ready | Vercel config documented; env reference; final production build verified |

## Test results (last)

- `npm test` → **4 files, 21 tests passed**.
- `npx playwright test` → desktop + mobile suites (see `docs/TESTING.md` for scope).

## Verified behaviors

- All storefront pages 200; unknown routes render not-found UI.
- Search, filters, sort, and variant selection work against catalogue data.
- Checkout: full journey creates an order with a `FME-` reference; totals
  recomputed server-side; demo labeling present; cart clears after order.
- Cart/wishlist persist across reloads (localStorage).
- No horizontal overflow at 390px on key pages.

## Known limitations

1. **Live UNIQLO reference** could not be directly inspected (Akamai + archive blocks) — see `REFERENCE_ANALYSIS.md` assumptions log.
2. **Orders are in-memory** — cleared on server restart unless `DATABASE_URL` is configured.
3. **No real auth/accounts** — wishlist/cart are per-browser, not per-user.
4. **Per-variant stock** is simulated via a documented heuristic on limited-run products.
5. **Newsletter subscribers** are demo-only (in-memory).
6. PayPal/UPI real payment integration is out of scope by design (demo checkout).

## Outstanding items

- None blocking. Optional future work: Postgres seed script, per-variant stock
  table wiring, auth, real payment provider sandbox.
