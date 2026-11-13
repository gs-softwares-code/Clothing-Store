/**
 * Drizzle schema for the FORME data model.
 *
 * This schema is the canonical database design for the project. It is
 * currently dormant: the application runs on the DemoDataAdapter
 * (in-memory) when `DATABASE_URL` is not configured. Set `DATABASE_URL`
 * and run migrations to activate the Postgres path
 * (see docs/DATABASE.md).
 */
import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["women", "men", "kids", "baby"]);
export const productStatusEnum = pgEnum("product_status", ["active", "draft"]);
export const orderStatusEnum = pgEnum("order_status", [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 120 }).notNull(),
  lastName: varchar("last_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  newsletterOptIn: boolean("newsletter_opt_in").default(false),
});

export const categories = pgTable("categories", {
  id: varchar("id", { length: 40 }).primaryKey(),
  label: varchar("label", { length: 80 }).notNull(),
  blurb: text("blurb"),
  parentId: varchar("parent_id", { length: 40 }).references(() => categories.id),
});

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description").notNull(),
    category: categoryEnum("category").notNull(),
    subcategory: varchar("subcategory", { length: 40 }).notNull(),
    collection: varchar("collection", { length: 40 }),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    discountPrice: numeric("discount_price", { precision: 10, scale: 2 }),
    status: productStatusEnum("status").default("active").notNull(),
    featured: boolean("featured").default(false).notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    bestseller: boolean("bestseller").default(false).notNull(),
    material: text("material").notNull(),
    care: text("care").notNull(),
    fit: text("fit").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.category, t.subcategory),
    index("products_collection_idx").on(t.collection),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: varchar("product_id", { length: 40 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 255 }),
    position: integer("position").default(0).notNull(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: varchar("product_id", { length: 40 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    colorId: varchar("color_id", { length: 40 }).notNull(),
    colorName: varchar("color_name", { length: 80 }).notNull(),
    colorHex: varchar("color_hex", { length: 7 }).notNull(),
    size: varchar("size", { length: 20 }).notNull(),
    sku: varchar("sku", { length: 80 }).notNull(),
  },
  (t) => [
    uniqueIndex("product_variants_sku_idx").on(t.sku),
    index("product_variants_product_idx").on(t.productId),
  ],
);

export const productInventory = pgTable(
  "product_inventory",
  {
    variantId: uuid("variant_id").primaryKey().references(() => productVariants.id, {
      onDelete: "cascade",
    }),
    stock: integer("stock").default(0).notNull(),
    reserved: integer("reserved").default(0).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("inventory_stock_idx").on(t.stock)],
);

export const collections = pgTable("collections", {
  id: varchar("id", { length: 40 }).primaryKey(),
  label: varchar("label", { length: 120 }).notNull(),
  description: text("description"),
  heroImage: text("hero_image"),
});

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: varchar("collection_id", { length: 40 })
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 40 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    position: integer("position").default(0),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.productId] })],
);

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id),
    qty: integer("qty").default(1).notNull(),
  },
  (t) => [index("cart_items_cart_idx").on(t.cartId)],
);

export const wishlists = pgTable("wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    wishlistId: uuid("wishlist_id")
      .notNull()
      .references(() => wishlists.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 40 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.wishlistId, t.productId] })],
);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  firstName: varchar("first_name", { length: 120 }).notNull(),
  lastName: varchar("last_name", { length: 120 }).notNull(),
  line1: varchar("line1", { length: 255 }).notNull(),
  line2: varchar("line2", { length: 255 }),
  city: varchar("city", { length: 120 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  state: varchar("state", { length: 120 }).notNull(),
  country: varchar("country", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 32 }),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: varchar("reference", { length: 40 }).notNull(),
    userId: uuid("user_id").references(() => users.id),
    status: orderStatusEnum("status").default("placed").notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 10, scale: 2 }).default("0").notNull(),
    shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).default("0").notNull(),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    shippingMethod: varchar("shipping_method", { length: 40 }).notNull(),
    shippingAddressId: uuid("shipping_address_id").references(() => addresses.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("orders_reference_idx").on(t.reference)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 40 }).references(() => products.id),
    variantId: uuid("variant_id").references(() => productVariants.id),
    name: varchar("name", { length: 200 }).notNull(),
    image: text("image"),
    qty: integer("qty").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const promotions = pgTable("promotions", {
  id: varchar("id", { length: 40 }).primaryKey(),
  code: varchar("code", { length: 40 }).notNull(),
  kind: varchar("kind", { length: 20 }).notNull(), // percent | fixed
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
});

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("newsletter_email_idx").on(t.email)],
);
