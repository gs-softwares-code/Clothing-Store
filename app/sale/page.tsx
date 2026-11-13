import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListing } from "@/components/product-listing";
import { getSaleProducts } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Sale",
  description: "Limited-time reductions across the FORME seasonal edit.",
};

export default function SalePage() {
  const products = getSaleProducts();
  return (
    <>
      <section className="bg-sale-tint">
        <Container className="py-8 md:py-10">
          <Breadcrumbs items={[{ label: "Sale" }]} />
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            The seasonal sale
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            A quietly considered selection — marked down to make room for the next
            season. Reductions up to 30% off.
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
