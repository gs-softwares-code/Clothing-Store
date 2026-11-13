import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { IconCheck, IconPackage } from "@/components/ui/icon";
import { getOrder } from "@/lib/server/orders-store";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

// Order records live in the demo server store; render at request time.
export const instant = false;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return (
    <section className="py-10 md:py-16">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
            <IconCheck size={24} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Thank you — order confirmed
            </h1>
            <p className="mt-1 text-sm text-muted">
              Reference <span className="font-medium text-ink">{order.reference}</span> ·
              placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded border border-accent/30 bg-accent-tint p-4 text-sm text-accent-deep">
          This is a demonstration order — nothing was charged, and no real payment
          data was collected or stored.
        </div>

        <div className="mt-8 border border-line">
          <div className="border-b border-line bg-cream px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
            Items
          </div>
          <ul className="divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-16 w-12 shrink-0 overflow-hidden bg-cream">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.colorId && <span className="capitalize">{item.colorId}</span>}
                    {item.colorId && item.size && <span> · </span>}
                    {item.size && <span>Size {item.size}</span>} · ×{item.qty}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink">
                  {formatINR(item.unitPrice * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-line px-5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatINR(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Discount</dt>
                <dd className="font-medium text-sale">−{formatINR(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery ({order.methodLabel})</dt>
              <dd className="font-medium text-ink">
                {order.shippingFee === 0 ? "Free" : formatINR(order.shippingFee)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="font-display text-base font-semibold text-ink">{formatINR(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="border border-line p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              <IconPackage size={15} /> Delivery
            </p>
            <p className="mt-2 text-sm text-muted">
              {order.shipping.firstName} {order.shipping.lastName}
              <br />
              {order.shipping.line1}
              {order.shipping.line2 ? <><br />{order.shipping.line2}</> : null}
              <br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
              <br />
              {order.shipping.country}
            </p>
          </div>
          <div className="border border-line p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">Contact</p>
            <p className="mt-2 text-sm text-muted">
              {order.customer.email}
              <br />
              {order.shipping.phone}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/">Continue shopping</LinkButton>
          <LinkButton href="/women" variant="outline">Shop women</LinkButton>
        </div>
      </Container>
    </section>
  );
}
