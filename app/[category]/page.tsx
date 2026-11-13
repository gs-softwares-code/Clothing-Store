import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryShop } from "@/components/category-shop";
import { getCategory, CATEGORIES } from "@/lib/domain/categories";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return {
    title: cat ? `${cat.label} | FORME` : "Shop | FORME",
    description: cat?.blurb,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!getCategory(category)) notFound();
  return <CategoryShop categoryId={category} />;
}
