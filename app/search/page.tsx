import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListing } from "@/components/product-listing";
import { LinkButton } from "@/components/ui/button";
import { searchProducts } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the FORME catalogue.",
};

// Search reads request-time query params; keep this a blocking route
// (opts out of instant-navigation shell validation).
export const instant = false;

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchProducts(query, 40) : [];

  return (
    <section className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Search" }]} />
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {query ? <>Results for “{query}”</> : "Search"}
        </h1>
        {query && (
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"} found
          </p>
        )}

        {!query ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">Type a search term above to explore the catalogue.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              No products match “{query}”
            </p>
            <p className="max-w-md text-sm text-muted">
              Check the spelling, or try a broader term — “tee”, “denim”, “coat”.
            </p>
            <div className="flex gap-3">
              <LinkButton href="/women" variant="outline">Shop women</LinkButton>
              <LinkButton href="/men" variant="outline">Shop men</LinkButton>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <Suspense fallback={<p className="text-sm text-muted">Loading products…</p>}>
              <ProductListing products={results} />
            </Suspense>
          </div>
        )}
      </Container>
    </section>
  );
}
