import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListing } from "@/components/product-listing";
import { getNewArrivals } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest FORME pieces — new colours, new cuts, new season layers.",
};

export default function NewArrivalsPage() {
  const products = getNewArrivals();
  return (
    <>
      <section className="bg-cream">
        <Container className="py-8 md:py-10">
          <Breadcrumbs items={[{ label: "New Arrivals" }]} />
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            New arrivals
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            The newest pieces in the FORME wardrobe — fresh colourways, newly cut
            essentials, and the season’s first layers.
          </p>
        </Container>
      </section>
      <section className="py-10 md:py-12">
        <Container>
          <Suspense fallback={<p className="text-sm text-muted">Loading products…</p>}>
            <ProductListing products={products} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
