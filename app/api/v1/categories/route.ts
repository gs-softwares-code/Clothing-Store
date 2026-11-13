import { NextResponse } from "next/server";
import { CATEGORIES, COLLECTIONS } from "@/lib/domain/categories";
import { getProductsByCategory } from "@/lib/data/catalog";
import type { Category } from "@/lib/domain/types";

export async function GET() {
  const categories = CATEGORIES.map((c) => ({
    ...c,
    productCount: getProductsByCategory(c.id as Category).length,
  }));
  return NextResponse.json({ categories, collections: COLLECTIONS });
}
