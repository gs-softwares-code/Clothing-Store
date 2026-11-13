import { describe, expect, it } from "vitest";
import { shippingFee, FREE_SHIPPING_THRESHOLD } from "@/lib/domain/shipping";

describe("shipping", () => {
  it("standard delivery is free above the threshold", () => {
    expect(shippingFee("standard", FREE_SHIPPING_THRESHOLD - 1)).toBe(199);
    expect(shippingFee("standard", FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingFee("standard", 5000)).toBe(0);
  });

  it("express delivery always charges", () => {
    expect(shippingFee("express", 5000)).toBe(399);
    expect(shippingFee("express", 0)).toBe(399);
  });

  it("falls back to standard for unknown methods", () => {
    expect(shippingFee("carrier-pigeon", 100)).toBe(199);
  });
});
