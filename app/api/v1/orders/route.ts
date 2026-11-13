import { NextResponse } from "next/server";
import { getProductById } from "@/lib/data/catalog";
import { shippingFee, SHIPPING_METHODS } from "@/lib/domain/shipping";
import { orderSchema } from "@/lib/domain/checkout-schema";
import { storeOrder } from "@/lib/server/orders-store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { items, shipping, method } = parsed.data;

  // Recalculate prices & totals server-side — never trust the client.
  const lines = items.map((item) => {
    const product = getProductById(item.productId);
    if (!product || product.status !== "active") {
      throw new Error(`Unknown product ${item.productId}`);
    }
    if (product.stock <= 0) {
      throw new Error(`Out of stock: ${product.name}`);
    }
    const unitPrice = product.discountPrice ?? product.price;
    return {
      productId: product.id,
      name: product.name,
      image: product.images[0],
      colorId: item.colorId,
      size: item.size,
      qty: item.qty,
      unitPrice,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const discount = items
    .map((item, i) => {
      const product = getProductById(item.productId)!;
      return product.discountPrice ? (product.price - product.discountPrice) * item.qty : 0;
    })
    .reduce((a, b) => a + b, 0);
  const fee = shippingFee(method, subtotal);
  const total = subtotal + fee;

  const methodLabel =
    SHIPPING_METHODS.find((m) => m.id === method)?.label ?? "Standard delivery";

  const order = storeOrder({
    customer: { email: shipping.email, name: `${shipping.firstName} ${shipping.lastName}` },
    shipping,
    method,
    methodLabel,
    items: lines,
    subtotal,
    discount,
    shippingFee: fee,
    total,
  });

  return NextResponse.json({ order }, { status: 201 });
}

// Demo: protected against trivial abuse (single-process store)
const rateLimit = new Map<string, number[]>();
export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const hits = (rateLimit.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (hits.length > 30) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  hits.push(now);
  rateLimit.set(ip, hits);

  const { listOrders } = await import("@/lib/server/orders-store");
  return NextResponse.json({ orders: listOrders() });
}
