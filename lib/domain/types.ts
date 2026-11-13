/**
 * FORME domain model.
 * These types are the single source of truth shared by the catalogue,
 * the API layer, and the commerce state.
 */

export type Category = "women" | "men" | "kids" | "baby";

export type ProductStatus = "active" | "draft";

export interface ProductAttributes {
  material: string;
  care: string[];
  fit: string;
}

/**
 * A product SKU-level record (seed data). Variant-level stock is
 * represented per color/size in `ProductVariantStock`.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  subcategory: string; // slug id, see categories.ts
  collection?: string; // collection slug id
  price: number; // INR
  discountPrice?: number; // INR, present when on sale
  images: string[]; // remote URLs, index 0 = primary
  colors: ColorOption[];
  sizes: string[]; // size labels; e.g. XS, S, M, L, XL / 3M-24M
  stock: number; // total units
  status: ProductStatus;
  featured: boolean;
  isNew: boolean;
  bestseller: boolean;
  rating?: number;
  attributes: ProductAttributes;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface CartItem {
  /** unique client key: `${productId}__${colorId || ""}__${size || ""}` */
  key: string;
  productId: string;
  colorId?: string;
  size?: string;
  qty: number;
}

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  colorId?: string;
  size?: string;
  qty: number;
  unitPrice: number; // final unit price charged
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  customer: { email: string; name: string };
  shipping: OrderAddress;
  method: string;
  methodLabel: string;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  demo: true;
}
