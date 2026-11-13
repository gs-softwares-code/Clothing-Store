"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button, LinkButton } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { IconCheck, IconLock } from "@/components/ui/icon";
import { useShop } from "@/lib/commerce/shop-context";
import { getProductById } from "@/lib/data/catalog";
import { SHIPPING_METHODS, shippingFee } from "@/lib/domain/shipping";
import { addressSchema, type AddressInput } from "@/lib/domain/checkout-schema";
import { cn, formatINR } from "@/lib/utils";

const STEPS = ["Contact", "Delivery", "Payment", "Review"] as const;
type Step = (typeof STEPS)[number];

const EMPTY_ADDRESS: AddressInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  state: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useShop();

  const [step, setStep] = useState<Step>("Contact");
  const [address, setAddress] = useState<AddressInput>(EMPTY_ADDRESS);
  const [method, setMethod] = useState("standard");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const lines = useMemo(
    () =>
      cart
        .map((item) => ({ item, product: getProductById(item.productId) }))
        .filter((l) => l.product),
    [cart],
  );

  const subtotal = lines.reduce(
    (s, l) => s + (l.product!.discountPrice ?? l.product!.price) * l.item.qty,
    0,
  );
  const fee = shippingFee(method, subtotal);
  const total = subtotal + fee;

  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((a) => ({ ...a, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validateContact = () => {
    const res = addressSchema.safeParse(address);
    if (!res.success) {
      const flat = res.error.flatten().fieldErrors;
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(flat)) {
        if (v && v.length) next[k] = v[0];
      }
      setErrors(next);
      return false;
    }
    return true;
  };

  const validateCard = () => {
    const next: Record<string, string> = {};
    if (!/^\d{16}$/.test(card.number.replace(/\s/g, ""))) next.cardNumber = "Enter a 16-digit card number";
    if (!card.name.trim()) next.cardName = "Name on card is required";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) next.cardExpiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(card.cvc)) next.cardCvc = "Enter CVC";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (step === "Contact") {
      if (!validateContact()) return;
      setStep("Delivery");
    } else if (step === "Delivery") {
      if (!method) return;
      setStep("Payment");
    } else if (step === "Payment") {
      if (!validateCard()) return;
      setStep("Review");
    }
  };

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.item.productId,
            qty: l.item.qty,
            colorId: l.item.colorId,
            size: l.item.size,
          })),
          shipping: address,
          method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");
      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch {
      setErrors({ _form: "Something went wrong placing the order. Please try again." });
      setSubmitting(false);
    }
  };

  if (lines.length === 0 && step !== "Contact") {
    // side effect guard not needed — render empty state below
  }

  return (
    <section className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Checkout" }]} />

        {lines.length === 0 && !submitting ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <h1 className="font-display text-2xl font-bold text-ink">Your bag is empty</h1>
            <p className="text-sm text-muted">Add something first — then come back.</p>
            <LinkButton href="/women">Start shopping</LinkButton>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* ============ LEFT: STEPS ============ */}
            <div className="lg:col-span-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Checkout
              </h1>
              <p className="mt-1 text-xs text-muted">
                Demonstration environment — no real payment is processed.
              </p>

              {/* Stepper */}
              <ol className="mt-6 flex items-center gap-2">
                {STEPS.map((s, i) => {
                  const idx = STEPS.indexOf(step);
                  const done = i < idx;
                  const active = i === idx;
                  return (
                    <li key={s} className="flex flex-1 items-center gap-2">
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                          done && "border-accent bg-accent text-white",
                          active && "border-ink bg-ink text-white",
                          !done && !active && "border-line text-muted",
                        )}
                      >
                        {done ? <IconCheck size={13} /> : i + 1}
                      </span>
                      <span className={cn("hidden text-xs sm:block", active ? "font-medium text-ink" : "text-muted")}>
                        {s}
                      </span>
                      {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
                    </li>
                  );
                })}
              </ol>

              {errors._form && (
                <p role="alert" className="mt-4 rounded border border-sale/40 bg-sale-tint px-3 py-2 text-sm text-sale">
                  {errors._form}
                </p>
              )}

              {/* STEP: CONTACT */}
              {step === "Contact" && (
                <div className="mt-8">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                    Contact & delivery address
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" error={errors.firstName}>
                      <input value={address.firstName} onChange={set("firstName")} placeholder="Aarav" />
                    </Field>
                    <Field label="Last name" error={errors.lastName}>
                      <input value={address.lastName} onChange={set("lastName")} placeholder="Sharma" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input type="email" value={address.email} onChange={set("email")} placeholder="you@example.com" />
                    </Field>
                    <Field label="Phone" error={errors.phone}>
                      <input type="tel" value={address.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
                    </Field>
                    <Field label="Address line 1" error={errors.line1} full>
                      <input value={address.line1} onChange={set("line1")} placeholder="Flat, building, street" />
                    </Field>
                    <Field label="Address line 2 (optional)" full>
                      <input value={address.line2 ?? ""} onChange={set("line2")} placeholder="Landmark, area" />
                    </Field>
                    <Field label="City" error={errors.city}>
                      <input value={address.city} onChange={set("city")} placeholder="Bengaluru" />
                    </Field>
                    <Field label="State" error={errors.state}>
                      <input value={address.state} onChange={set("state")} placeholder="Karnataka" />
                    </Field>
                    <Field label="Postal code" error={errors.postalCode}>
                      <input value={address.postalCode} onChange={set("postalCode")} placeholder="560001" />
                    </Field>
                    <Field label="Country">
                      <input value={address.country} onChange={set("country")} />
                    </Field>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={next}>Continue to delivery</Button>
                  </div>
                </div>
              )}

              {/* STEP: DELIVERY */}
              {step === "Delivery" && (
                <div className="mt-8">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                    Choose delivery
                  </h2>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((m) => (
                      <label
                        key={m.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-4 border p-4 transition-colors",
                          method === m.id ? "border-ink bg-cream" : "border-line hover:border-ink/40",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="method"
                            checked={method === m.id}
                            onChange={() => setMethod(m.id)}
                            className="h-4 w-4 accent-ink"
                          />
                          <span>
                            <span className="block text-sm font-medium text-ink">{m.label}</span>
                            <span className="block text-xs text-muted">{m.description}</span>
                          </span>
                        </span>
                        <span className="text-sm font-medium text-ink">
                          {m.id === "standard" && subtotal >= 1999
                            ? "Free"
                            : formatINR(shippingFee(m.id, subtotal))}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="ghost" onClick={() => setStep("Contact")}>← Back</Button>
                    <Button onClick={next}>Continue to payment</Button>
                  </div>
                </div>
              )}

              {/* STEP: PAYMENT */}
              {step === "Payment" && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                      Payment
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                      <IconLock size={13} /> Demo — no real card data is used
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Card number" error={errors.cardNumber} full>
                      <input
                        inputMode="numeric"
                        value={card.number}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCard((c) => ({ ...c, number: v.replace(/(\d{4})(?=\d)/g, "$1 ") }));
                          setErrors((er) => ({ ...er, cardNumber: "" }));
                        }}
                        placeholder="4242 4242 4242 4242"
                      />
                    </Field>
                    <Field label="Name on card" error={errors.cardName} full>
                      <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} placeholder="AARAV SHARMA" />
                    </Field>
                    <Field label="Expiry (MM/YY)" error={errors.cardExpiry}>
                      <input
                        value={card.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                          setCard((c) => ({ ...c, expiry: v }));
                          setErrors((er) => ({ ...er, cardExpiry: "" }));
                        }}
                        placeholder="12/28"
                      />
                    </Field>
                    <Field label="CVC" error={errors.cardCvc}>
                      <input
                        type="password"
                        inputMode="numeric"
                        value={card.cvc}
                        onChange={(e) => {
                          setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }));
                          setErrors((er) => ({ ...er, cardCvc: "" }));
                        }}
                        placeholder="123"
                      />
                    </Field>
                  </div>
                  <button
                    onClick={() =>
                      setCard({
                        number: "4242 4242 4242 4242",
                        name: "AARAV SHARMA",
                        expiry: "12/28",
                        cvc: "123",
                      })
                    }
                    className="mt-3 text-xs text-muted underline underline-offset-2 hover:text-ink"
                  >
                    Fill with demo card
                  </button>
                  <div className="mt-6 flex justify-between">
                    <Button variant="ghost" onClick={() => setStep("Delivery")}>← Back</Button>
                    <Button onClick={next}>Review order</Button>
                  </div>
                </div>
              )}

              {/* STEP: REVIEW */}
              {step === "Review" && (
                <div className="mt-8">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                    Review & place order
                  </h2>
                  <div className="divide-y divide-line border-y border-line">
                    <ReviewRow label="Contact" value={`${address.email} · ${address.phone}`} onEdit={() => setStep("Contact")} />
                    <ReviewRow
                      label="Deliver to"
                      value={`${address.firstName} ${address.lastName}, ${address.line1}${address.line2 ? `, ${address.line2}` : ""}, ${address.city} ${address.postalCode}, ${address.state}, ${address.country}`}
                      onEdit={() => setStep("Contact")}
                    />
                    <ReviewRow
                      label="Delivery"
                      value={`${SHIPPING_METHODS.find((m) => m.id === method)?.label} — ${formatINR(fee)}`}
                      onEdit={() => setStep("Delivery")}
                    />
                    <ReviewRow
                      label="Payment"
                      value={`Card ending ${card.number.replace(/\s/g, "").slice(-4)} (demo)`}
                      onEdit={() => setStep("Payment")}
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setStep("Payment")}>← Back</Button>
                    <Button onClick={placeOrder} disabled={submitting} className="min-w-52">
                      {submitting ? "Placing order…" : "Place order — demo"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ============ RIGHT: SUMMARY ============ */}
            <aside className="h-fit border border-line bg-cream p-6">
              <h2 className="font-display text-base font-semibold text-ink">Order summary</h2>
              <ul className="mt-4 space-y-3">
                {lines.map(({ item, product }) => (
                  <li key={item.key} className="flex gap-3">
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-canvas">
                      <ImageWithFallback
                        src={product!.images[0]}
                        alt={product!.name}
                        width={96}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <Link href={`/product/${product!.slug}`} className="font-medium text-ink hover:text-accent">
                        {product!.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {item.colorId && <span className="capitalize">{item.colorId}</span>}
                        {item.colorId && item.size && <span> · </span>}
                        {item.size && <span>Size {item.size}</span>} · ×{item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink">
                      {formatINR((product!.discountPrice ?? product!.price) * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-medium text-ink">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="font-medium text-ink">{fee === 0 ? "Free" : formatINR(fee)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2">
                  <dt className="font-medium text-ink">Total</dt>
                  <dd className="font-display text-base font-semibold text-ink">{formatINR(total)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-center text-xs text-faint">
                Demo checkout — orders are stored in memory only.
              </p>
            </aside>
          </div>
        )}
      </Container>
    </section>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-sale">{error}</span>}
    </label>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <p className="mt-1 text-sm text-ink">{value}</p>
      </div>
      <button onClick={onEdit} className="shrink-0 text-xs text-muted underline underline-offset-2 hover:text-ink">
        Edit
      </button>
    </div>
  );
}
