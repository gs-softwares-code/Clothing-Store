import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "@/lib/domain/types";

/**
 * Demo order store.
 *
 * Orders persist to a local JSON file (`.data/orders.json`) so they are
 * shared across server workers and survive restarts. This powers the
 * demo checkout without a database. When Neon is configured
 * (DATABASE_URL), swap this for the Postgres adapter — see
 * docs/DATABASE.md.
 */

const FILE = path.join(process.cwd(), ".data", "orders.json");

async function load(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function save(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(orders, null, 2), "utf8");
}

let seq = 0;

async function nextReference(): Promise<string> {
  if (seq === 0) {
    const orders = await load();
    seq = orders.reduce((max, o) => {
      const n = Number(o.reference.split("-").pop());
      return Number.isFinite(n) && n > max ? n : max;
    }, 1000);
  }
  seq += 1;
  return `FME-${new Date().getFullYear()}-${seq}`;
}

export async function storeOrder(
  order: Omit<Order, "id" | "reference" | "createdAt" | "demo">,
): Promise<Order> {
  const orders = await load();
  const full: Order = {
    ...order,
    id: `ord_${Date.now().toString(36)}_${orders.length}`,
    reference: await nextReference(),
    createdAt: new Date().toISOString(),
    demo: true,
  };
  orders.push(full);
  await save(orders);
  return full;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const orders = await load();
  return orders.find((o) => o.id === id);
}

export async function listOrders(): Promise<Order[]> {
  return load();
}
