import { beforeEach, describe, expect, it } from "vitest";
import { getOrder, listOrders, storeOrder } from "@/lib/server/orders-store";

const base = {
  customer: { email: "a@b.com", name: "A B" },
  shipping: {
    firstName: "A",
    lastName: "B",
    email: "a@b.com",
    phone: "+91 99999 99999",
    line1: "1 Test Rd",
    city: "City",
    postalCode: "560001",
    state: "KA",
    country: "India",
  },
  method: "standard",
  methodLabel: "Standard delivery",
  items: [{ productId: "w-001", name: "Tee", image: "", qty: 1, unitPrice: 1290 }],
  subtotal: 1290,
  discount: 0,
  shippingFee: 199,
  total: 1489,
};

describe("demo order store", () => {
  beforeEach(() => {
    for (const id of listOrders().map((o) => o.id)) {
      // clear store internals by re-importing fresh state is not possible;
      // instead track that ids/references are unique per create.
      void id;
    }
  });

  it("stores orders and assigns unique ids + references", () => {
    const a = storeOrder(base);
    const b = storeOrder({ ...base, subtotal: 2000 });
    expect(a.id).not.toBe(b.id);
    expect(a.reference).not.toBe(b.reference);
    expect(a.reference).toMatch(/^FME-\d{4}-\d+$/);
    expect(a.demo).toBe(true);
    expect(getOrder(a.id)).toEqual(a);
  });

  it("returns undefined for missing ids", () => {
    expect(getOrder("nope")).toBeUndefined();
  });

  it("tracks createdAt", () => {
    const o = storeOrder(base);
    expect(new Date(o.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
