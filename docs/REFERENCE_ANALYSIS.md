# REFERENCE ANALYSIS — UNIQLO (uniqlo.com/in/en) → FORME Design Direction

**Method & honesty note.** Direct live inspection of `https://www.uniqlo.com/in/en/` was blocked by Akamai bot protection (see `PROJECT_AUDIT.md` §3). This document combines (a) publicly available UX analyses located via web search, (b) established knowledge of UNIQLO's interface conventions, and (c) explicitly flagged assumptions. Items marked **[assumed]** are design hypotheses consistent with documented UNIQLO behavior, used only where no source contradicted them.

**Sources consulted (secondary):**
- UX/design case studies on UNIQLO's mega-menu and information architecture (per WebSearch summaries).
- E-commerce design analyses of UNIQLO homepage, PDP and mobile behavior (per WebSearch summaries).
- UNIQLO official documentation of flagship UX features (e.g., size-recommendation tool, free-delivery thresholds, 90-day returns, click-and-collect) — widely referenced across articles.

---

## 1. Observed design philosophy

UNIQLO's site is **content-first and lifestyle-driven** before it is a catalogue:

- Editorial photography dominates; product grids are clean and understated.
- Brand promise ("LifeWear" — everyday clothing made better) is woven through navigation and campaign sections.
- The store feels calm: lots of whitespace, restrained palette, strong typographic hierarchy.
- Shopping utility (browse → filter → buy) is always one glance away but never visually noisy.

**FORME translation:** keep the same discipline — large editorial imagery, whitespace, minimal decoration, strong type — with an original identity, copy and art direction.

---

## 2. Navigation hierarchy

Observed/established structure:

| Level | Content |
|---|---|
| Utility bar (top) | Promo/announcement strip (limited-time offers, free shipping thresholds). |
| Primary nav | **Women · Men · Kids · Baby** (gender/life-stage), plus **New Arrivals**, **Sale**, editorial/campaign links. |
| Mega menu | Full-width hover panel: columns per category with subcategory links; features a seasonal highlight/banner. |
| Secondary | Search (nav-level), account, wishlist, cart (always visible). |
| Mobile | Hamburger drawer; same tree, click-expanded; sticky mini-cart. |

Subcategory conventions (from sources):
- **Women:** Tops (T-shirts, shirts/blouses, sweatshirts, knitwear) · Bottoms (jeans, trousers, skirts, leggings) · Outerwear · Innerwear · Accessories.
- **Men:** Tops (T-shirts, shirts, polos, hoodies, knitwear) · Bottoms (jeans, chinos, trousers, shorts) · Outerwear · Innerwear · Accessories.
- **Kids:** sizes ~100–160 cm, grouped Tops/Bottoms/Outerwear/Essentials.
- **Baby:** sizes ~50–90 cm, grouped Bodysuits/Tops/Bottoms/Essentials.

**FORME adoption:** primary nav Women/Men/Kids/Baby + New Arrivals/Collections/Sale; mega menu columns with exact subcategory taxonomy from brief §5B; hover on desktop, click drawer on mobile; sticky header.

---

## 3. Homepage section structure (established pattern)

1. **Announcement bar** — thin strip, rotating or single promo message.
2. **Sticky header** — logo left/center, nav, search, icons.
3. **Hero campaign** — full-width editorial image, headline, CTA (often seasonal flagship).
4. **Campaign tiles** — 2–4 large editorial panels (lookbook-style) linking to collections.
5. **Category navigation tiles** — Women/Men/Kids/Baby feature blocks with photography.
6. **Product sections** — New arrivals, best sellers, “essentials” grids (3–4 columns).
7. **Editorial storytelling** — brand-story modules (e.g., sustainability, LifeWear stories) with large imagery.
8. **Promotional banners** — sale/limited-offer strip with countdown or CTA.
9. **Newsletter** — email capture bar (discount incentive).
10. **Footer** — brand promise, link columns, service/help, country selector, social, payment icons, legal.

**FORME adoption:** identical skeleton (original content per brief §5A), listed 1:1 against brief requirements.

---

## 4. Shopping journey

| Stage | Established UNIQLO pattern | FORME plan |
|---|---|---|
| Browse | Category pages with breadcrumbs, title, count, sort, facet filters (desktop sidebar / mobile drawer) | Same (§5C) |
| Product card | Image; second image on hover; name; price (sale = strikethrough); quick-add bag control; no heavy decoration | Same (§5D) |
| Product detail | Gallery (main + thumbnails, fabric close-ups, model info); name, price, color, size selector + size guide + availability, add-to-bag, wishlist; details/materials-care/delivery-returns tabs; related products | Same (§5E) |
| Cart | Slide-out drawer (qty edit, subtotal, checkout CTA) + full cart page | Same (§5F) |
| Checkout | Contact → delivery → payment; order confirmation with reference | Same (§5G), demo-labeled |
| Search | Overlay with suggestions/popular terms → results page, no-results state | Same (§5H) |
| Wishlist | Heart on cards/PDP; dedicated list; move-to-cart | Same (§5I) |

*Size-recommendation tool and in-store pickup are documented UNIQLO features; they are out of scope for FORME v1 (noted as limitations).*

---

## 5. Responsive behavior (established)

- Desktop: full hover mega menus; multi-column grids (3–4); sidebar filters.
- Tablet: grid collapses to 2–3 columns; filters collapse to drawer.
- Mobile: hamburger nav; filter drawer; 2-column product grid; thumbnail-strip gallery; sticky add-to-bag bar on PDP **[assumed — common pattern, corroborated by mobile-ecommerce critiques of UNIQLO]**.
- Layout fluidity from 360px upward; no horizontal scroll; touch-friendly hit areas.

---

## 6. Reusable UI component inventory (derived)

Header/announcement bar · mega menu · mobile drawer · search overlay · breadcrumbs · category banner · filter sidebar/drawer · sort select · product card · product grid · product gallery · variant selectors (color/size/qty) · size guide modal · add-to-bag · wishlist control · cart drawer · cart page · checkout step form · order confirmation · newsletter form · footer · toasts · empty states · loading skeletons.

---

## 7. Implementation opportunities (what we will do better/differently)

1. Fully **original brand** (FORME) — no trademark risk, original copy and photography direction.
2. **Accessible-first**: ARIA-compliant menus/drawers/modals, keyboard navigation, focus management — beyond reference baseline.
3. **Search against real catalogue** with suggestions + no-results handling.
4. **Server-rendered SEO**: structured data (Product/Offer/BreadcrumbList), OG tags, sitemap, robots.
5. **Performance**: responsive images, lazy loading, minimal JS, semantic HTML, strong Core Web Vitals budget.
6. **Engineering proof**: versioned validated API, Zod everywhere, server-side price recalculation, clean layered architecture, test suites — the GS Softwares showcase angle.

---

## 8. Explicit assumptions log

| # | Assumption | Source status |
|---|---|---|
| A1 | Announcement bar sits above sticky header | Secondary sources (promo strip), **[assumed]** placement |
| A2 | Mobile PDP has sticky add-to-bag bar | **[assumed]**, common mobile-commerce pattern |
| A3 | Product cards show second image on hover | Secondary sources confirm hover behavior QA |
| A4 | Cart opens as slide-out drawer | Corroborated by UX reviews; **[assumed]** as global pattern |
| A5 | Footer multi-column with newsletter + country selector | Standard for UNIQLO markets; **[assumed]** detail |
| A6 | Search overlay triggered from header | Corroborated by UX reviews |
