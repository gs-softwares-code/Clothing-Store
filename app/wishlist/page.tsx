"use client";

import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { LinkButton } from "@/components/ui/button";
import { useShop } from "@/lib/commerce/shop-context";
import { getProductById } from "@/lib/data/catalog";
import { IconHeart } from "@/components/ui/icon";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const products = wishlist.map(getProductById).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Wishlist" }]} />
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Your wishlist
        </h1>
        <p className="mt-1 text-sm text-muted">
          {products.length} {products.length === 1 ? "piece" : "pieces"} saved
        </p>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <IconHeart size={36} className="text-faint" />
            <p className="font-display text-lg font-semibold text-ink">
              Nothing saved yet
            </p>
            <p className="max-w-md text-sm text-muted">
              Tap the heart on any product to keep it here for later.
            </p>
            <LinkButton href="/women">Start browsing</LinkButton>
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={products} />
          </div>
        )}
      </Container>
    </section>
  );
}
