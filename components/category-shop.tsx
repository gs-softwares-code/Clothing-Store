import { Suspense } from "react";
import { Container } from "./ui/container";
import { Breadcrumbs } from "./breadcrumbs";
import { ProductListing } from "./product-listing";
import { ImageWithFallback } from "./image-with-fallback";
import { getCategory, getSubcategory } from "@/lib/domain/categories";
import {
  getProductsByCategory,
  getProductsBySubcategory,
} from "@/lib/data/catalog";
import { subcatHref } from "@/lib/domain/navigation";
import type { Category } from "@/lib/domain/types";

const BANNERS: Record<string, string> = {
  women: "photo-1524504388940-b1c1722653e1",
  men: "photo-1507003211169-0a1dd7228f2d",
  kids: "photo-1516627145497-ae6968895b74",
  baby: "photo-1503919545889-aef636e10ad4",
};

export function CategoryShop({ categoryId, subId }: { categoryId: string; subId?: string }) {
  const cat = getCategory(categoryId);
  if (!cat) return null;

  const sub = subId ? getSubcategory(categoryId, subId) : undefined;
  if (subId && !sub) return null;

  const products = sub
    ? getProductsBySubcategory(categoryId as Category, sub.id)
    : getProductsByCategory(categoryId as Category);

  const banner = BANNERS[cat.id];
  const title = sub ? sub.label : cat.label;

  return (
    <>
      <section aria-label={`${title} banner`} className="bg-cream">
        <Container className="grid items-center gap-6 py-6 md:grid-cols-2 md:py-8">
          <div>
            <Breadcrumbs
              items={[
                { label: cat.label, href: `/${cat.id}` },
                ...(sub ? [{ label: sub.label }] : []),
              ]}
            />
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              {sub
                ? `${cat.blurb} Within ${cat.label.toLowerCase()} — ${sub.label.toLowerCase()}.`
                : cat.blurb}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative aspect-[16/9] overflow-hidden">
              <ImageWithFallback
                src={`https://images.unsplash.com/${banner}?w=900&q=80&auto=format&fit=crop`}
                alt={`${cat.label} collection`}
                fill
                sizes="(min-width: 768px) 50vw, 0vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <Suspense fallback={<p className="text-sm text-muted">Loading products…</p>}>
            <ProductListing products={products} title={title} description={cat.blurb} />
          </Suspense>
        </Container>
      </section>

      {!sub && (
        <section className="pb-12">
          <Container>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              Browse {cat.label.toLowerCase()} by type
            </h2>
            <div className="flex flex-wrap gap-2">
              {cat.subcategories.map((s) => (
                <a
                  key={s.id}
                  href={subcatHref(cat.id, s.id)}
                  className="border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
