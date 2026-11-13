"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/domain/types";
import { useShop } from "@/lib/commerce/shop-context";
import { useToast } from "./ui/toast";
import { Button } from "./ui/button";
import { Drawer, DrawerHeader } from "./ui/drawer";
import { ImageWithFallback } from "./image-with-fallback";
import { cn, formatINR } from "@/lib/utils";
import {
  IconCheck,
  IconHeart,
  IconHeartFilled,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconShield,
  IconTruck,
} from "./ui/icon";

const RECENT_KEY = "forme.recent.v1";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { show } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [colorId, setColorId] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wished = isWishlisted(product.id);
  const onSale = product.discountPrice != null;
  const price = onSale ? product.discountPrice! : product.price;

  // Track recently viewed
  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
      const next = [product.slug, ...recent.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [product.slug]);

  // Low-stock heuristic: render larger sizes unavailable on limited runs
  const unavailableSizes = useUnavailableSizes(product);

  const canQuickAdd = !unavailableSizes.includes(size ?? "");

  const submit = () => {
    if (product.colors.length > 1 && !colorId) {
      setError("Please select a colour.");
      return;
    }
    if (product.sizes.length > 1 && !size) {
      setError("Please select a size.");
      return;
    }
    if (product.sizes.length > 1 && size && unavailableSizes.includes(size)) {
      setError("This size is currently out of stock.");
      return;
    }
    const color = product.colors.find((c) => c.id === colorId);
    addToCart({ productId: product.id, colorId: color?.id, size: size ?? undefined, qty });
    show(
      `Added to bag — ${product.name}${color && size ? ` (${color.name}, ${size})` : ""}`,
    );
    setError(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      {/* ============ GALLERY ============ */}
      <div>
        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
          <ImageWithFallback
            src={product.images[activeImage]}
            alt={`${product.name} — image ${activeImage + 1}`}
            fill
            priority={activeImage === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {onSale && (
              <span className="bg-sale px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                {Math.round((1 - price / product.price) * 100)}% off
              </span>
            )}
            {product.isNew && !onSale && (
              <span className="bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                New
              </span>
            )}
          </div>
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={activeImage === i}
                className={cn(
                  "relative h-20 w-16 overflow-hidden bg-cream border transition-colors",
                  activeImage === i ? "border-ink" : "border-transparent hover:border-line",
                )}
              >
                <ImageWithFallback
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============ BUY BOX ============ */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          <span className="capitalize">{product.category}</span> ·{" "}
          <span className="capitalize">{product.subcategory.replace("-", " ")}</span>
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {product.name}
        </h1>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold text-ink">{formatINR(price)}</span>
          {onSale && (
            <span className="text-sm text-faint line-through">{formatINR(product.price)}</span>
          )}
          {product.rating && (
            <span className="ml-2 text-xs text-muted">★ {product.rating.toFixed(1)}</span>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

        {/* Colour */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink">
              Colour
              {colorId && (
                <span className="ml-2 font-normal normal-case text-muted">
                  {product.colors.find((c) => c.id === colorId)?.name}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setColorId(c.id)}
                aria-label={`Colour: ${c.name}`}
                aria-pressed={colorId === c.id}
                title={c.name}
                className={cn(
                  "relative h-9 w-9 rounded-full border transition-all",
                  colorId === c.id ? "border-ink" : "border-ink/15 hover:border-ink/50",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {colorId === c.id && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <IconCheck size={15} className={isDark(c.hex) ? "text-white" : "text-ink"} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink">
              Size
              {size && <span className="ml-2 font-normal normal-case text-muted">{size}</span>}
            </p>
            {product.sizes.length > 1 && (
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-muted underline underline-offset-4 hover:text-ink"
              >
                Size guide
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const out = unavailableSizes.includes(s);
              return (
                <button
                  key={s}
                  disabled={out}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  title={out ? "Out of stock" : undefined}
                  className={cn(
                    "min-w-12 border px-3 py-2 text-xs transition-colors",
                    size === s
                      ? "border-ink bg-ink text-white"
                      : out
                        ? "cursor-not-allowed border-line text-faint line-through"
                        : "border-line text-ink hover:border-ink",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Qty + CTA */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="flex h-13 items-center border border-line">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-full w-11 items-center justify-center text-ink hover:bg-cream"
            >
              <IconMinus size={15} />
            </button>
            <span aria-live="polite" className="w-10 text-center text-sm tabular-nums">
              {qty}
            </span>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="flex h-full w-11 items-center justify-center text-ink hover:bg-cream"
            >
              <IconPlus size={15} />
            </button>
          </div>
          <Button onClick={submit} className="h-13 flex-1" disabled={!canQuickAdd}>
            Add to bag
          </Button>
          <Button
            variant="outline"
            className="h-13 w-13 shrink-0 px-0"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            onClick={() => toggleWishlist(product.id)}
          >
            {wished ? <IconHeartFilled className="text-sale" /> : <IconHeart />}
          </Button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-sale">
            {error}
          </p>
        )}
        {!canQuickAdd && (
          <p className="mt-3 text-sm text-muted">This size is out of stock.</p>
        )}

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <IconTruck size={16} /> Free delivery over ₹1,999
          </span>
          <span className="inline-flex items-center gap-2">
            <IconRefresh size={16} /> 7-day easy returns
          </span>
          <span className="inline-flex items-center gap-2">
            <IconShield size={16} /> Secured demo checkout
          </span>
        </div>

        {/* Accordions */}
        <div className="mt-6 divide-y divide-line border-y border-line">
          <Accordion title="Materials & care" defaultOpen>
            <p className="text-sm text-muted">
              {product.attributes.material}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
              {product.attributes.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Fit & silhouette">
            <p className="text-sm text-muted">{product.attributes.fit}</p>
          </Accordion>
          <Accordion title="Delivery & returns">
            <p className="text-sm text-muted">
              Standard delivery 3–5 business days. Free on orders above ₹1,999.
              Returns accepted within 7 days in unused condition with tags attached.
            </p>
          </Accordion>
        </div>

        <p className="mt-6 text-xs text-faint">
          This is a demonstration store. No real payment is processed.
        </p>
      </div>

      <SizeGuideDrawer open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} category={product.category} />
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-ink"
      >
        {title}
        <IconPlus
          size={16}
          className={cn("text-muted transition-transform duration-200", open && "rotate-45")}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function useUnavailableSizes(product: Product): string[] {
  if (product.sizes.length <= 1) return [];
  if (product.stock >= 60) return [];
  // Simulated per-variant availability: limited runs drop larger sizes
  const large = product.sizes.filter((s) => s === "XL" || s === "XXL" || s === "10-12Y" || s === "18-24M");
  return large.slice(0, Math.max(1, Math.ceil(product.sizes.length / 3)));
}

function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function SizeGuideDrawer({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category: string;
}) {
  return (
    <Drawer open={open} onClose={onClose} side="right">
      <DrawerHeader id="size-guide-title" title="Size guide" />
      <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-muted">
        {category === "baby" || category === "kids" ? (
          <>
            <p>
              FORME kids’ sizing follows age ranges. Choose the size closest to the
              child’s current age — if between sizes, size up for comfort and growth.
            </p>
            <SizeTable
              rows={[
                ["2-4Y", "92–104 cm", "52–56 cm"],
                ["4-6Y", "104–116 cm", "56–60 cm"],
                ["6-8Y", "116–128 cm", "60–64 cm"],
                ["8-10Y", "128–140 cm", "64–68 cm"],
                ["10-12Y", "140–152 cm", "68–72 cm"],
              ]}
            />
            <p className="mt-4">
              Baby: 0-3M (50-62 cm), 3-6M (62-68 cm), 6-12M (68-80 cm),
              12-18M (80-86 cm), 18-24M (86-92 cm).
            </p>
          </>
        ) : (
          <>
            <p>
              FORME adult sizing runs true to size. If you are between sizes, we
              recommend sizing up for a relaxed fit.
            </p>
            <SizeTable
              rows={[
                ["XS", "84–88 cm", "60–64 cm", "84–88 cm"],
                ["S", "88–92 cm", "64–68 cm", "88–92 cm"],
                ["M", "92–96 cm", "68–72 cm", "92–96 cm"],
                ["L", "96–102 cm", "72–78 cm", "96–102 cm"],
                ["XL", "102–108 cm", "78–84 cm", "102–108 cm"],
                ["XXL", "108–114 cm", "84–90 cm", "108–114 cm"],
              ]}
            />
          </>
        )}
        <p className="mt-4 text-xs text-faint">
          Measurements are garment chest / waist / hip in centimetres.
        </p>
      </div>
    </Drawer>
  );
}

function SizeTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-line text-left text-ink">
            {rows[0].map((_, i) => (
              <th key={i} className="py-2 pr-4 font-semibold uppercase tracking-wider">
                {i === 0 ? "Size" : i === 1 ? "Height" : i === 2 ? "Chest" : "Waist"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/60">
              {r.map((cell, j) => (
                <td key={j} className="py-2 pr-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { RECENT_KEY };
