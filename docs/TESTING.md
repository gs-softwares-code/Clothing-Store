# Testing — FORME

## Stack

- **Unit tests:** Vitest — `tests/unit/`
- **E2E tests:** Playwright (Chromium, desktop + mobile projects) — `e2e/`

## Running

```bash
npm test            # Vitest (unit)
npm run test:e2e   # Playwright (builds + boots prod server on :3315)
npm run test:all   # both
```

## Coverage

### Unit (21 tests)
- Catalogue: seed size/coverage, uniqueness, slug lookup, subcategory filter,
  sale integrity, collections, related products, search behavior.
- Shipping: threshold logic, express fee, fallback.
- Checkout schema: valid/reject cases (empty cart, qty bounds, email, required fields, method).
- Order store: ids/references, retrieval, createdAt.

### E2E
| Suite | Covers |
|---|---|
| home.spec | hero, sections, announcement, mega-menu hover→subcat, category tiles, footer attribution→/showcase |
| listing.spec | count display, sort→URL, colour filter→URL, mobile filter drawer, empty state |
| pdp.spec | required-size validation, add-with-variant toast, size guide drawer, wishlist persist → wishlist page, related |
| search.spec | overlay open/close, live results, Enter→results page, no-results, empty prompt |
| cart.spec | drawer open, qty update, remove → empty, persistence across reload, cart page totals → checkout |
| checkout.spec | blocked invalid contact, full journey → order reference, demo labels, bag cleared after order |
| mobile.spec | hamburger drawer, no horizontal overflow (390px) across key pages, touch quick-add |

## Manual checkpoints

- Viewports: 360, 390, 768, 1024, 1366, 1440, 1920.
- Checks: horizontal overflow, broken images, grid alignment, typography,
  overlapping nav, console errors (`page.on('console')` assertion in CI).

## Known limitation

- E2E currently asserts content/state; screenshots are captured on failure only.
- Playwright HTML report is generated to `playwright-report/` (gitignored).
