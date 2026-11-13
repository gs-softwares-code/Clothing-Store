import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryShop } from "@/components/category-shop";
import { getCategory, getSubcategory, CATEGORIES } from "@/lib/domain/categories";

interface Props {
  params: Promise<{ category: string; subcat: string }>;
}

export function generateStaticParams() {
  const out: { category: string; subcat: string }[] = [];
  for (const c of CATEGORIES) {
    for (const s of c.subcategories) {
      out.push({ category: c.id, subcat: s.id });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcat } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcat);
  return {
    title: cat && sub ? `${cat.label} ${sub.label} | FORME` : "Shop | FORME",
    description: sub?.label ? `${cat?.label} ${sub.label} — ${cat?.blurb}` : cat?.blurb,
  };
}

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcat } = await params;
  if (!getCategory(category) || !getSubcategory(category, subcat)) notFound();
  return <CategoryShop categoryId={category} subId={subcat} />;
}
