"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LinkButton } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { IconBag, IconMinus, IconPlus, IconTrash } from "@/components/ui/icon";
import { useShop } from "@/lib/commerce/shop-context";
import { getProductById } from "@/lib/data/catalog";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useShop();

  const lines = cart
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce(
    (sum, l) => sum + (l.product!.discountPrice ?? l.product!.price) * l.item.qty,
    0,
  );
  const freeShipping = subtotal >= 1999;
  const shipping = subtotal === 0 || freeShipping ? 0 : 199;

  if (lines.length === 0) {
    return (
      <section className="py-12 md:py-20">
        <Container>
          <Breadcrumbs items={[{ label: "Shopping bag" }]} />
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <IconBag size={36} className="text-faint" />
            <h1 className="font-display text-2xl font-bold text-ink">Your bag is empty</h1>
            <p className="max-w-md text-sm text-muted">
              Something from the new season, maybe? Start with the essentials.
            </p>
            <div className="flex gap-3">
              <LinkButton href="/women">Shop women</LinkButton>
              <LinkButton href="/men" variant="outline">Shop men</LinkButton>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Shopping bag" }]} />
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Shopping bag
        </h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="divide-y divide-line border-y border-line">
              {lines.map(({ item, product }) => {
                const unit = product!.discountPrice ?? product!.price;
                return (
                  <li key={item.key} className="flex gap-4 py-5">
                    <Link href={`/product/${product!.slug}`} className="h-32 w-24 shrink-0 overflow-hidden bg-cream">
                      <ImageWithFallback
                        src={product!.images[0]}
                        alt={product!.name}
                        width={192}
                        height={256}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/product/${product!.slug}`} className="text-sm font-medium text-ink hover:text-accent">
                            {product!.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted">
                            {item.colorId && <span className="capitalize">{item.colorId}</span>}
                            {item.colorId && item.size && <span> · </span>}
                            {item.size && <span>Size {item.size}</span>}
                          </p>
                          {product!.discountPrice && (
                            <p className="mt-0.5 text-xs text-sale">
                              {formatINR(product!.price)} → {formatINR(product!.discountPrice)}
                            </p>
                          )}
                        </div>
                        <button
                          aria-label={`Remove ${product!.name}`}
                          onClick={() => removeFromCart(item.key)}
                          className="p-1 text-faint hover:text-sale"
                        >
                          <IconTrash size={17} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-line">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="flex h-9 w-9 items-center justify-center text-ink hover:bg-cream"
                          >
                            <IconMinus size={14} />
                          </button>
                          <span aria-live="polite" className="w-9 text-center text-sm tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="flex h-9 w-9 items-center justify-center text-ink hover:bg-cream"
                          >
                            <IconPlus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-ink">{formatINR(unit * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-center justify-between">
              <LinkButton href="/women" variant="ghost" size="sm">
                ← Continue shopping
              </LinkButton>
              {lines.length > 1 && (
                <button onClick={clearCart} className="text-xs text-muted underline underline-offset-2 hover:text-sale">
                  Clear bag
                </button>
              )}
            </div>
          </div>

          <aside className="h-fit border border-line bg-cream p-6">
            <h2 className="font-display text-base font-semibold text-ink">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium text-ink">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-medium text-ink">
                  {shipping === 0 ? (subtotal === 0 ? "—" : "Free") : formatINR(shipping)}
                </dd>
              </div>
              {!freeShipping && subtotal > 0 && (
                <p className="text-xs text-muted">
                  Add {formatINR(1999 - subtotal)} more for free delivery.
                </p>
              )}
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="font-medium text-ink">Total</dt>
                <dd className="font-display text-base font-semibold text-ink">
                  {formatINR(subtotal + shipping)}
                </dd>
              </div>
            </dl>
            <LinkButton href="/checkout" fullWidth className="mt-5">
              Proceed to checkout
            </LinkButton>
            <p className="mt-3 text-center text-xs text-faint">
              Demo checkout — no real payment is processed.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
