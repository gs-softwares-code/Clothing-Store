import { NextResponse } from "next/server";
import { z } from "zod";
import { searchProducts } from "@/lib/data/catalog";

const querySchema = z.object({
  q: z.string().min(1).max(80),
  limit: z.coerce.number().int().min(1).max(40).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") ?? "",
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid query" }, { status: 400 });
  }

  const { q, limit } = parsed.data;
  const results = searchProducts(q, limit ?? 12);

  return NextResponse.json({ query: q, results, count: results.length });
}
