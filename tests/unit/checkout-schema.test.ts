import { describe, expect, it } from "vitest";
import { orderSchema } from "@/lib/domain/checkout-schema";

const validOrder = {
  items: [{ productId: "w-001", qty: 2, colorId: "white", size: "M" }],
  shipping: {
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    line1: "12 MG Road",
    city: "Bengaluru",
    postalCode: "560001",
    state: "Karnataka",
    country: "India",
  },
  method: "standard",
};

describe("order schema", () => {
  it("accepts a valid order", () => {
    const res = orderSchema.safeParse(validOrder);
    expect(res.success).toBe(true);
  });

  it("rejects an empty cart", () => {
    const res = orderSchema.safeParse({ ...validOrder, items: [] });
    expect(res.success).toBe(false);
  });

  it("rejects qty outside 1–10", () => {
    expect(orderSchema.safeParse({ ...validOrder, items: [{ productId: "w-001", qty: 0 }] }).success).toBe(false);
    expect(orderSchema.safeParse({ ...validOrder, items: [{ productId: "w-001", qty: 11 }] }).success).toBe(false);
  });

  it("rejects invalid email and missing required fields", () => {
    expect(
      orderSchema.safeParse({ ...validOrder, shipping: { ...validOrder.shipping, email: "nope" } }).success,
    ).toBe(false);
    expect(
      orderSchema.safeParse({ ...validOrder, shipping: { ...validOrder.shipping, city: "" } }).success,
    ).toBe(false);
  });

  it("rejects unknown shipping methods", () => {
    expect(orderSchema.safeParse({ ...validOrder, method: "teleport" }).success).toBe(false);
  });
});
