import type { Product } from "@/lib/domain/types";
import { ProductCard } from "./product-card";
import { Reveal } from "./ui/reveal";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
  /** Fade each card in with a gentle stagger as it scrolls into view. */
  stagger?: boolean;
}

export function ProductGrid({
  products,
  columns = 4,
  className,
  stagger = false,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3",
        columns === 4 && "xl:grid-cols-4",
        columns === 2 && "md:grid-cols-2",
        className,
      )}
    >
      {products.map((p, i) =>
        stagger ? (
          <Reveal key={p.id} delay={(i % 8) * 55}>
            <ProductCard product={p} />
          </Reveal>
        ) : (
          <ProductCard key={p.id} product={p} />
        ),
      )}
    </div>
  );
}
