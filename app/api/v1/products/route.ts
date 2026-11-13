import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getProductsByCategory,
  getProductsBySubcategory,
  getSaleProducts,
  activeProducts,
} from "@/lib/data/catalog";
import type { Category } from "@/lib/domain/types";

const querySchema = z.object({
  category: z.enum(["women", "men", "kids", "baby"]).optional(),
  subcategory: z.string().optional(),
  sale: z.enum(["true", "false"]).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    category: url.searchParams.get("category") ?? undefined,
    subcategory: url.searchParams.get("subcategory") ?? undefined,
    sale: url.searchParams.get("sale") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const { category, subcategory, sale } = parsed.data;

  let result = activeProducts;
  if (category && subcategory) {
    result = getProductsBySubcategory(category as Category, subcategory);
  } else if (category) {
    result = getProductsByCategory(category as Category);
  }
  if (sale === "true") result = getSaleProducts();

  return NextResponse.json({ products: result, count: result.length });
}
