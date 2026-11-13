"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, subcatHref } from "@/lib/domain/navigation";
import { COLLECTIONS } from "@/lib/domain/categories";
import { ImageWithFallback } from "./image-with-fallback";
import { IconArrowRight } from "./ui/icon";

interface MegaMenuProps {
  openKey: string | null;
  onNavigate: () => void;
}

const FEATURE_IMAGES: Record<string, string> = {
  women: "photo-1524504388940-b1c1722653e1",
  men: "photo-1507003211169-0a1dd7228f2d",
  kids: "photo-1516627145497-ae6968895b74",
  baby: "photo-1519238263530-99bdd11df2ea",
  collections: "photo-1441984904996-e0b6ba687e04",
};

export function MegaMenu({ openKey, onNavigate }: MegaMenuProps) {
  const item = NAV_ITEMS.find((i) => i.key === openKey);
  if (!item) return null;

  const isCategory = Boolean(item.columns && item.columns.length > 1);
  const collectionHref =
    item.key === "collections"
      ? `/collections/${COLLECTIONS[0].id}`
      : undefined;

  return (
    <div
      onMouseLeave={onNavigate}
      className="absolute inset-x-0 top-full z-40 hidden lg:block animate-[fadeIn_160ms_ease]"
    >
      <div className="border-t border-line bg-canvas shadow-[0_24px_48px_-24px_rgba(24,24,22,0.18)]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-12 py-10">
          <div className="col-span-7">
            <Link
              href={isCategory ? `/${item.key}` : item.href}
              onClick={onNavigate}
              className="mb-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:border-ink/40"
            >
              Shop all {item.label}
              <IconArrowRight size={14} />
            </Link>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
              {item.columns?.map((col, ci) => (
                <ul key={ci} className="space-y-2.5">
                  {col.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={
                          item.key === "collections"
                            ? `/collections/${sub.id}`
                            : subcatHref(item.key, sub.id)
                        }
                        onClick={onNavigate}
                        className="text-sm text-ink/80 transition-colors hover:text-accent"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div className={cn("col-span-5", !isCategory && "col-span-5")}>
            {collectionHref ? (
              <Link
                href={collectionHref}
                onClick={onNavigate}
                className="group block overflow-hidden bg-cream"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/${FEATURE_IMAGES.collections}?w=900&q=80&auto=format&fit=crop`}
                    alt="FORME collection"
                    width={900}
                    height={563}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-ink">Featured collection</p>
                    <p className="text-xs text-muted">The Everyday Collection</p>
                  </div>
                  <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ) : (
              <Link
                href={`/${item.key}`}
                onClick={onNavigate}
                className="group block overflow-hidden bg-cream"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/${FEATURE_IMAGES[item.key]}?w=900&q=80&auto=format&fit=crop`}
                    alt={`${item.label} collection`}
                    width={900}
                    height={563}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-ink">Explore {item.label}</p>
                    <p className="text-xs text-muted">{item.label === "Baby" ? "0–24 months" : "New season pieces"}</p>
                  </div>
                  <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
