import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getOrder, listOrders, storeOrder } from "@/lib/server/orders-store";
import { promises as fs } from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), ".data", "orders.json");

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
  beforeEach(async () => {
    try {
      await fs.rm(FILE, { force: true });
    } catch {
      /* ignore */
    }
  });

  afterEach(async () => {
    try {
      await fs.rm(FILE, { force: true });
    } catch {
      /* ignore */
    }
  });

  it("stores orders and assigns unique ids + references", async () => {
    const a = await storeOrder(base);
    const b = await storeOrder({ ...base, subtotal: 2000 });
    expect(a.id).not.toBe(b.id);
    expect(a.reference).not.toBe(b.reference);
    expect(a.reference).toMatch(/^FME-\d{4}-\d+$/);
    expect(a.demo).toBe(true);
    expect(await getOrder(a.id)).toEqual(a);
  });

  it("returns undefined for missing ids", async () => {
    expect(await getOrder("nope")).toBeUndefined();
  });

  it("tracks createdAt and persists to disk", async () => {
    const o = await storeOrder(base);
    expect(new Date(o.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
    const onDisk = JSON.parse(await fs.readFile(FILE, "utf8"));
    expect(onDisk.some((x: { id: string }) => x.id === o.id)).toBe(true);
    expect((await listOrders()).length).toBe(1);
  });
});
