import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListing } from "@/components/product-listing";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { LinkButton } from "@/components/ui/button";
import { getCollection, COLLECTIONS } from "@/lib/domain/categories";
import { getCollectionProducts } from "@/lib/data/catalog";

const IMAGES: Record<string, { hero: string; support: string }> = {
  everyday: {
    hero: "photo-1490481651871-ab68de25d43d",
    support: "photo-1483985988355-763728e1935b",
  },
  "modern-essentials": {
    hero: "photo-1434389677669-e08b4cac3105",
    support: "photo-1503341504253-dff4815485f1",
  },
  "seasonal-layers": {
    hero: "photo-1539533018447-63fcce2678e3",
    support: "photo-1544022613-e87ca75a784a",
  },
  "art-of-simplicity": {
    hero: "photo-1515886657613-9f3515b0c78f",
    support: "photo-1441984904996-e0b6ba687e04",
  },
  "everyday-comfort": {
    hero: "photo-1627225924765-552d49cf47ad",
    support: "photo-1516257984-b1b4d707412e",
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return {
    title: c ? c.label : "Collection",
    description: c?.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection || !IMAGES[slug]) notFound();

  const products = getCollectionProducts(slug);
  const imagery = IMAGES[slug];

  return (
    <>
      {/* Campaign hero */}
      <section aria-label={`${collection.label} hero`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
          <ImageWithFallback
            src={`https://images.unsplash.com/${imagery.hero}?w=1600&q=80&auto=format&fit=crop`}
            alt={collection.label}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <Breadcrumbs items={[{ label: "Collections", href: "/collections" }, { label: collection.label }]} />
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              FORME collection
            </p>
            <h1 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              {collection.label}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              {collection.description}
            </p>
          </Container>
        </div>
      </section>

      {/* Supporting editorial band */}
      <section className="py-12 md:py-16">
        <Container className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-cream">
            <ImageWithFallback
              src={`https://images.unsplash.com/${imagery.support}?w=1000&q=80&auto=format&fit=crop`}
              alt={`${collection.label} — supporting imagery`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              The idea
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              {collection.label}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {collection.description} Every piece in this edit shares a design
              language — considered materials, precise cuts, and nothing that
              doesn’t need to be there.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/women">Shop women</LinkButton>
              <LinkButton href="/men" variant="outline">Shop men</LinkButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="pb-14 md:pb-20">
        <Container>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Pieces in this collection</h2>
            <span className="text-sm text-muted">{products.length} products</span>
          </div>
          <Suspense fallback={<p className="text-sm text-muted">Loading products…</p>}>
            <ProductListing products={products} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
