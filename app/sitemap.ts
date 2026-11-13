import type { MetadataRoute } from "next";
import { products, activeProducts } from "@/lib/data/catalog";
import { CATEGORIES, COLLECTIONS } from "@/lib/domain/categories";

const BASE = "https://forme-demo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/women",
    "/men",
    "/kids",
    "/baby",
    "/new-arrivals",
    "/sale",
    "/collections",
    "/cart",
    "/wishlist",
    "/search",
    "/showcase",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date("2026-11-13"),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.8,
  }));

  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      entries.push({
        url: `${BASE}/${cat.id}/${sub.id}`,
        lastModified: new Date("2026-11-13"),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const c of COLLECTIONS) {
    entries.push({
      url: `${BASE}/collections/${c.id}`,
      lastModified: new Date("2026-11-13"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const p of activeProducts) {
    entries.push({
      url: `${BASE}/product/${p.slug}`,
      lastModified: new Date("2026-11-13"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}

export { products };
