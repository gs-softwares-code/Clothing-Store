import { CATEGORIES, COLLECTIONS, type CategoryDef, type SubcategoryDef } from "./categories";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  columns?: SubcategoryDef[][];
}

export const NAV_ITEMS: NavItem[] = [
  ...CATEGORIES.map((cat: CategoryDef): NavItem => {
    const mid = Math.ceil(cat.subcategories.length / 2);
    return {
      key: cat.id,
      label: cat.label,
      href: `/${cat.id}`,
      columns: [cat.subcategories.slice(0, mid), cat.subcategories.slice(mid)],
    };
  }),
  { key: "new-arrivals", label: "New Arrivals", href: "/new-arrivals" },
  {
    key: "collections",
    label: "Collections",
    href: "/collections",
    columns: [COLLECTIONS.map((c) => ({ id: c.id, label: c.label }))],
  },
  { key: "sale", label: "Sale", href: "/sale" },
];

export interface SubcatLink {
  label: string;
  href: string;
}

export function subcatHref(cat: string, sub: string) {
  return `/${cat}/${sub}`;
}

export const UTILITY_LINKS: SubcatLink[] = [
  { label: "Track order", href: "/checkout" },
  { label: "Delivery & returns", href: "/help/delivery-returns" },
  { label: "Size guide", href: "/help/size-guide" },
  { label: "Stores", href: "/stores" },
  { label: "GS Softwares Showcase", href: "/showcase" },
];
