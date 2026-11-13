import { describe, expect, it } from "vitest";
import {
  activeProducts,
  getBestSellers,
  getCollectionProducts,
  getNewArrivals,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySubcategory,
  getRelatedProducts,
  getSaleProducts,
  searchProducts,
} from "@/lib/data/catalog";

describe("catalogue", () => {
  it("seeds at least 40 active products", () => {
    expect(activeProducts.length).toBeGreaterThanOrEqual(40);
  });

  it("covers all four categories", () => {
    for (const c of ["women", "men", "kids", "baby"] as const) {
      expect(getProductsByCategory(c).length).toBeGreaterThan(0);
    }
  });

  it("looks up products by slug and returns undefined for unknown", () => {
    expect(getProductBySlug("relaxed-boxy-cotton-tee")?.id).toBe("w-001");
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });

  it("filters by subcategory", () => {
    const womenTees = getProductsBySubcategory("women", "t-shirts");
    expect(womenTees.length).toBeGreaterThan(0);
    expect(womenTees.every((p) => p.subcategory === "t-shirts")).toBe(true);
  });

  it("every product has unique id, slug, and an image", () => {
    const ids = new Set(activeProducts.map((p) => p.id));
    const slugs = new Set(activeProducts.map((p) => p.slug));
    expect(ids.size).toBe(activeProducts.length);
    expect(slugs.size).toBe(activeProducts.length);
    for (const p of activeProducts) {
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.price).toBeGreaterThan(0);
      expect(p.status).toBe("active");
    }
  });

  it("sale products have a discount below the base price", () => {
    const sale = getSaleProducts();
    expect(sale.length).toBeGreaterThan(0);
    for (const p of sale) {
      expect(p.discountPrice!).toBeLessThan(p.price);
    }
  });

  it("new arrivals and best sellers are non-empty", () => {
    expect(getNewArrivals().length).toBeGreaterThan(0);
    expect(getBestSellers().length).toBeGreaterThan(0);
  });

  it("collection query returns only products of that collection", () => {
    const modern = getCollectionProducts("modern-essentials");
    expect(modern.length).toBeGreaterThan(0);
    expect(modern.every((p) => p.collection === "modern-essentials")).toBe(true);
  });

  it("related products exclude self and cap at limit", () => {
    const p = getProductBySlug("relaxed-boxy-cotton-tee")!;
    const related = getRelatedProducts(p, 4);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.some((r) => r.id === p.id)).toBe(false);
  });

  it("search matches names and material text, case-insensitive", () => {
    expect(searchProducts("SUPIMA").some((p) => p.id === "m-001")).toBe(true);
    expect(searchProducts("cotton tee").length).toBeGreaterThan(0);
    expect(searchProducts("zzz-nothing")).toEqual([]);
    expect(searchProducts("")).toEqual([]);
  });
});
