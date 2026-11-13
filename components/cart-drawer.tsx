"use client";

import Link from "next/link";
import { Drawer, DrawerHeader } from "./ui/drawer";
import { Button, LinkButton } from "./ui/button";
import { IconMinus, IconPlus, IconTrash } from "./ui/icon";
import { ImageWithFallback } from "./image-with-fallback";
import { useShop } from "@/lib/commerce/shop-context";
import { getProductById } from "@/lib/data/catalog";
import { formatINR } from "@/lib/utils";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, updateQty, removeFromCart } = useShop();

  const lines = cart
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce(
    (sum, l) => sum + (l.product!.discountPrice ?? l.product!.price) * l.item.qty,
    0,
  );

  return (
    <Drawer open={open} onClose={onClose} side="right">
      <DrawerHeader id="cart-drawer-title" title="Shopping bag" sub={`${cart.length} item${cart.length === 1 ? "" : "s"}`} />
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-display text-xl font-semibold text-ink">Your bag is empty</p>
          <p className="text-sm text-muted">Discover pieces designed for every day.</p>
          <Button variant="outline" onClick={onClose}>
            Continue shopping
          </Button>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map(({ item, product }) => (
              <li key={item.key} className="flex gap-4 py-4">
                <Link href={`/product/${product!.slug}`} onClick={onClose} className="h-24 w-[76px] shrink-0 overflow-hidden bg-cream">
                  <ImageWithFallback
                    src={product!.images[0]}
                    alt={product!.name}
                    width={152}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${product!.slug}`} onClick={onClose} className="text-sm font-medium text-ink hover:text-accent">
                        {product!.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {item.colorId && <span className="capitalize">{item.colorId}</span>}
                        {item.colorId && item.size && <span> · </span>}
                        {item.size && <span>Size {item.size}</span>}
                      </p>
                    </div>
                    <button
                      aria-label={`Remove ${product!.name} from bag`}
                      onClick={() => removeFromCart(item.key)}
                      className="p-1 text-faint hover:text-sale"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-line">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-cream"
                      >
                        <IconMinus size={14} />
                      </button>
                      <span aria-live="polite" className="w-8 text-center text-sm tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-cream"
                      >
                        <IconPlus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      {formatINR((product!.discountPrice ?? product!.price) * item.qty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-display text-base font-semibold text-ink">{formatINR(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-muted">
              Delivery and discounts calculated at checkout.
            </p>
            <div className="flex gap-3">
              <LinkButton href="/cart" variant="outline" className="flex-1" onClick={onClose}>
                View bag
              </LinkButton>
              <LinkButton href="/checkout" className="flex-1" onClick={onClose}>
                Checkout
              </LinkButton>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
