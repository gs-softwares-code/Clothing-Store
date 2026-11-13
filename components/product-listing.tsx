"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/domain/types";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./product-grid";
import { Drawer, DrawerHeader } from "./ui/drawer";
import { Button } from "./ui/button";
import { IconSliders } from "./ui/icon";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "bestselling";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "bestselling", label: "Best selling" },
];

const PRICE_BINS: { id: string; label: string; min: number | null; max: number | null }[] = [
  { id: "p0", label: "Under ₹1,000", min: null, max: 1000 },
  { id: "p1", label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { id: "p2", label: "₹2,000 – ₹4,000", min: 2000, max: 4000 },
  { id: "p3", label: "Above ₹4,000", min: 4000, max: null },
];

interface ProductListingProps {
  products: Product[];
}

function FacetSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-5">
      <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
        {title}
      </legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

export function ProductListing({ products }: ProductListingProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState<SortKey>("featured");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [priceBin, setPriceBin] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Facet options derived from the (static) product pool
  const facets = useMemo(() => {
    const colorMap = new Map<string, string>();
    for (const p of products) for (const c of p.colors) colorMap.set(c.id, c.hex);
    const sizeSet = new Set<string>();
    for (const p of products) for (const s of p.sizes) sizeSet.add(s);
    const colSet = new Set<string>();
    for (const p of products) if (p.collection) colSet.add(p.collection);
    const typeSet = new Set<string>();
    for (const p of products) typeSet.add(p.subcategory);
    return {
      colors: Array.from(colorMap, ([id, hex]) => ({ id, hex })),
      sizes: Array.from(sizeSet),
      collections: Array.from(colSet),
      types: Array.from(typeSet),
    };
  }, [products]);

  // Hydrate from URL on first load / back-forward
  // (sync with external system: URL search params — not a derived cascade)
  const hydrated = useRef(false);
  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSort((sp.get("sort") as SortKey) || "featured");
    setColors(sp.getAll("color"));
    setSizes(sp.getAll("size"));
    setCollections(sp.getAll("collection"));
    setTypes(sp.getAll("type"));
    setPriceBin(sp.get("price"));
    hydrated.current = true;
  }, [searchParams]);

  // Keep URL in sync with local filter state (shareable, deep-linkable)
  useEffect(() => {
    if (!hydrated.current) return;
    const sp = new URLSearchParams();
    if (sort !== "featured") sp.set("sort", sort);
    colors.forEach((v) => sp.append("color", v));
    sizes.forEach((v) => sp.append("size", v));
    collections.forEach((v) => sp.append("collection", v));
    types.forEach((v) => sp.append("type", v));
    if (priceBin) sp.set("price", priceBin);
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [sort, colors, sizes, collections, types, priceBin, pathname, router]);

  const filtered = useMemo(() => {
    let list = products;
    if (colors.length) {
      list = list.filter((p) => p.colors.some((c) => colors.includes(c.id)));
    }
    if (sizes.length) {
      list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    }
    if (collections.length) {
      list = list.filter((p) => p.collection && collections.includes(p.collection));
    }
    if (types.length) {
      list = list.filter((p) => types.includes(p.subcategory));
    }
    if (priceBin) {
      const bin = PRICE_BINS.find((b) => b.id === priceBin);
      if (bin) {
        list = list.filter((p) => {
          const price = p.discountPrice ?? p.price;
          if (bin.min != null && price < bin.min) return false;
          if (bin.max != null && price >= bin.max) return false;
          return true;
        });
      }
    }
    const arr = [...list];
    switch (sort) {
      case "newest":
        arr.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "price-asc":
        arr.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case "price-desc":
        arr.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case "bestselling":
        arr.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
        break;
      default:
        break;
    }
    return arr;
  }, [products, colors, sizes, collections, types, priceBin, sort]);

  const activeFilterCount =
    colors.length + sizes.length + collections.length + types.length + (priceBin ? 1 : 0);

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const FacetContent = (
    <div className="space-y-6">
      <FacetSection title="Colour">
        {facets.colors.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={colors.includes(c.id)}
              onChange={() => setColors((prev) => toggleIn(prev, c.id))}
              className="h-4 w-4 accent-ink"
            />
            <span
              className="h-3.5 w-3.5 rounded-full border border-ink/15"
              style={{ backgroundColor: c.hex }}
            />
            <span className="capitalize">{c.id}</span>
          </label>
        ))}
      </FacetSection>
      <FacetSection title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSizes((prev) => toggleIn(prev, s))}
              aria-pressed={sizes.includes(s)}
              className={cn(
                "min-w-11 border px-2 py-1.5 text-xs transition-colors",
                sizes.includes(s)
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink hover:border-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FacetSection>
      {facets.types.length > 1 && (
        <FacetSection title="Type">
          {facets.types.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={types.includes(t)}
                onChange={() => setTypes((prev) => toggleIn(prev, t))}
                className="h-4 w-4 accent-ink"
              />
              <span className="capitalize">{t.replace("-", " ")}</span>
            </label>
          ))}
        </FacetSection>
      )}
      <FacetSection title="Collection">
        {facets.collections.map((c) => (
          <label key={c} className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={collections.includes(c)}
              onChange={() => setCollections((prev) => toggleIn(prev, c))}
              className="h-4 w-4 accent-ink"
            />
            <span className="capitalize">{c.replace("-", " ")}</span>
          </label>
        ))}
      </FacetSection>
      <FacetSection title="Price">
        {PRICE_BINS.map((b) => (
          <label key={b.id} className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
            <input
              type="radio"
              name="price-bin"
              checked={priceBin === b.id}
              onChange={() => setPriceBin(priceBin === b.id ? null : b.id)}
              className="h-4 w-4 accent-ink"
            />
            <span>{b.label}</span>
          </label>
        ))}
      </FacetSection>
    </div>
  );

  const sortSelect = (
    <select
      aria-label="Sort products"
      value={sort}
      onChange={(e) => setSort(e.target.value as SortKey)}
      className="h-9 border border-line bg-canvas px-3 text-xs text-ink focus:border-ink focus:outline-none"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden"
          >
            <IconSliders size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <p className="text-sm text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setColors([]); setSizes([]); setCollections([]); setTypes([]); setPriceBin(null);
                router.replace(pathname, { scroll: false });
              }}
              className="text-xs text-muted underline underline-offset-2 hover:text-ink"
            >
              Clear all
            </button>
          )}
          {sortSelect}
        </div>
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Refine
          </h2>
          {FacetContent}
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="font-display text-lg font-semibold text-ink">No products match</p>
              <p className="max-w-sm text-sm text-muted">
                Try removing a filter or two — the right piece is probably waiting.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setColors([]); setSizes([]); setCollections([]); setTypes([]); setPriceBin(null);
                  router.replace(pathname, { scroll: false });
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="left">
        <DrawerHeader id="filter-drawer-title" title="Filters" />
        <div className="flex-1 overflow-y-auto px-5 py-5">{FacetContent}</div>
        <div className="border-t border-line p-4">
          <Button fullWidth onClick={() => setMobileFiltersOpen(false)}>
            Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
