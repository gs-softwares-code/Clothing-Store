import type { Category } from "./types";

export interface SubcategoryDef {
  id: string;
  label: string;
}

export interface CategoryDef {
  id: Category;
  label: string;
  blurb: string;
  subcategories: SubcategoryDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "women",
    label: "Women",
    blurb: "Modern silhouettes for every day.",
    subcategories: [
      { id: "t-shirts", label: "T-Shirts" },
      { id: "shirts-blouses", label: "Shirts & Blouses" },
      { id: "knitwear", label: "Knitwear" },
      { id: "dresses", label: "Dresses" },
      { id: "jeans", label: "Jeans" },
      { id: "trousers", label: "Trousers" },
      { id: "outerwear", label: "Outerwear" },
      { id: "activewear", label: "Activewear" },
      { id: "innerwear", label: "Innerwear" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "men",
    label: "Men",
    blurb: "Considered essentials with a clean cut.",
    subcategories: [
      { id: "t-shirts", label: "T-Shirts" },
      { id: "shirts", label: "Shirts" },
      { id: "polos", label: "Polos" },
      { id: "sweatshirts", label: "Sweatshirts" },
      { id: "knitwear", label: "Knitwear" },
      { id: "jeans", label: "Jeans" },
      { id: "trousers", label: "Trousers" },
      { id: "outerwear", label: "Outerwear" },
      { id: "activewear", label: "Activewear" },
      { id: "innerwear", label: "Innerwear" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    blurb: "Play-ready pieces that can take the day.",
    subcategories: [
      { id: "tops", label: "Tops" },
      { id: "bottoms", label: "Bottoms" },
      { id: "outerwear", label: "Outerwear" },
      { id: "essentials", label: "Essentials" },
    ],
  },
  {
    id: "baby",
    label: "Baby",
    blurb: "Soft, gentle layers for the earliest years.",
    subcategories: [
      { id: "bodysuits", label: "Bodysuits" },
      { id: "tops", label: "Tops" },
      { id: "bottoms", label: "Bottoms" },
      { id: "essentials", label: "Essentials" },
    ],
  },
];

export const COLLECTIONS: { id: string; label: string; description: string }[] = [
  {
    id: "everyday",
    label: "The Everyday Collection",
    description: "Quietly considered pieces for the rhythm of daily life.",
  },
  {
    id: "modern-essentials",
    label: "Modern Essentials",
    description: "The foundation of a flexible, honest wardrobe.",
  },
  {
    id: "seasonal-layers",
    label: "Seasonal Layers",
    description: "Designed to layer — from first light to last train home.",
  },
  {
    id: "art-of-simplicity",
    label: "The Art of Simplicity",
    description: "Less, but better. Pieces that earn their place.",
  },
  {
    id: "everyday-comfort",
    label: "Everyday Comfort",
    description: "Softness engineered in — ease you can feel all day.",
  },
];

export function getCategory(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getSubcategory(categoryId: string, subId: string) {
  return getCategory(categoryId)?.subcategories.find((s) => s.id === subId);
}

export function getCollection(id: string) {
  return COLLECTIONS.find((c) => c.id === id);
}
