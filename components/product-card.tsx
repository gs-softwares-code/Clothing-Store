"use client";

import Link from "next/link";
import type { Product } from "@/lib/domain/types";
import { useShop } from "@/lib/commerce/shop-context";
import { useToast } from "./ui/toast";
import { formatINR } from "@/lib/utils";
import { ImageWithFallback } from "./image-with-fallback";
import { IconBag, IconHeart, IconHeartFilled } from "./ui/icon";
import { NewBadge, SaleBadge } from "./ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { show } = useToast();
  const wished = isWishlisted(product.id);
  const onSale = product.discountPrice != null;
  const price = onSale ? product.discountPrice! : product.price;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors[0];
    const size = product.sizes[0];
    addToCart({
      productId: product.id,
      colorId: color?.id,
      size: size,
      qty: 1,
    });
    show(
      `Added to bag — ${product.name}${color && size ? ` (${color.name}, ${size})` : ""}`,
    );
  };

  return (
    <div className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="block"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {product.images[1] && (
            <ImageWithFallback
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {onSale && <SaleBadge>Sale</SaleBadge>}
            {product.isNew && !onSale && <NewBadge>New</NewBadge>}
          </div>

          {/* Quick add — desktop reveal on hover, always visible on touch */}
          <div className="absolute inset-x-3 bottom-3">
            <button
              onClick={quickAdd}
              aria-label={`Add ${product.name} to bag`}
              className="flex h-10 w-full translate-y-1 items-center justify-center gap-2 bg-white/95 text-xs font-medium uppercase tracking-[0.12em] text-ink opacity-0 shadow-sm backdrop-blur transition-all duration-200 hover:bg-ink hover:text-white focus:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
            >
              <IconBag size={15} />
              Add to bag
            </button>
          </div>
        </div>

        <div className="pt-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
            {product.subcategory.replace("-", " ")}
          </p>
          <h3 className="mt-0.5 line-clamp-1 text-sm font-medium text-ink">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-medium text-ink">{formatINR(price)}</span>
            {onSale && (
              <span className="text-xs text-faint line-through">{formatINR(product.price)}</span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.id}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="h-3.5 w-3.5 rounded-full border border-ink/10"
              />
            ))}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wished}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors ${
          wished ? "text-sale" : "text-ink hover:text-sale"
        }`}
      >
        {wished ? <IconHeartFilled size={17} /> : <IconHeart size={17} />}
      </button>
    </div>
  );
}
