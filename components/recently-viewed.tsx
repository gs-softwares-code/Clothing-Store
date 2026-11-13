"use client";

import { useEffect, useState } from "react";
import { RECENT_KEY } from "./product-detail";
import { getProductBySlug } from "@/lib/data/catalog";
import { ProductGrid } from "./product-grid";
import { SectionHeading } from "./ui/section-heading";

export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
      const filtered = recent.filter((s) => s !== currentSlug).slice(0, 4);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugs(filtered);
    } catch {
      /* ignore */
    }
  }, [currentSlug]);

  if (slugs.length === 0) return null;

  const products = slugs.map(getProductBySlug).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) return null;

  return (
    <div>
      <SectionHeading eyebrow="Continue browsing" title="Recently viewed" />
      <ProductGrid products={products} columns={4} />
    </div>
  );
}
