# API Reference — forme (v1)

Base: `/api/v1`

All responses are JSON. Mutations validate with Zod and return
`422` + flatten() details on invalid input. Prices, discounts, and
totals are always recalculated server-side.

## Products

### `GET /api/v1/products`
Query params (all optional): `category=women|men|kids|baby`, `subcategory=<slug>`,
`sale=true|false`.

```json
{ "products": [ { "id": "w-001", "slug": "relaxed-boxy-cotton-tee", "name": "…", "price": 1290, … } ], "count": 57 }
```

### `GET /api/v1/products/:slug`
Returns `{ "product": Product }`, or `404` when unknown.

## Search

### `GET /api/v1/search?q=<text>[&limit=12]`
Text search over name, description, category, subcategory, collection,
materials, and colours. Returns `{ query, results, count }`.

## Catalog metadata

### `GET /api/v1/categories`
Returns `{ categories: [{ id, label, blurb, subcategories, productCount }], collections: [...] }`.

## Cart (demo contract)

Cart state is client-side (localStorage) in this demo. The intended
server contract (for the Postgres path) is:

- `GET /api/v1/cart` — current user’s cart
- `POST /api/v1/cart/items` — add variant+qty (validates variant, stock)
- `PATCH /api/v1/cart/items/:id` — update qty
- `DELETE /api/v1/cart/items/:id` — remove line

These are documented but not yet exposed; the demo client uses the
local store. The order API below is fully implemented.

## Orders

### `POST /api/v1/orders`
Body:

```json
{
  "items": [{ "productId": "w-001", "qty": 2, "colorId": "black", "size": "M" }],
  "method": "standard",
  "shipping": {
    "firstName": "Aarav", "lastName": "Sharma", "email": "a@b.com",
    "phone": "+91 98765 43210", "line1": "12 MG Road", "city": "Bengaluru",
    "postalCode": "560001", "state": "Karnataka", "country": "India"
  }
}
```

Server recalculates: unit prices (sale-aware), subtotal, discount total,
shipping fee (standard free ≥ ₹1,999), final total. Returns
`201 { order }` with `reference` like `FME-2026-1001`.

### `GET /api/v1/orders/:id`
Returns the stored order or `404`. Orders are demo-only (in-memory).

## Newsletter

### `POST /api/v1/newsletter`
Body `{ "email": "…" }` → `201` subscribed / `200` already subscribed /
`422` invalid email. Demo subscribers kept in memory.
