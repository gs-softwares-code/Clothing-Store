import type { Order } from "@/lib/domain/types";

/**
 * Demo order store.
 *
 * Keeps created orders in server memory for the duration of the process.
 * This powers the demo checkout without a database. When Neon is
 * configured (DATABASE_URL), swap this for the Postgres adapter —
 * see docs/DATABASE.md.
 */

const orders = new Map<string, Order>();

let seq = 1000;

function makeReference(): string {
  seq += 1;
  const y = new Date().getFullYear();
  return `FME-${y}-${seq}`;
}

export function storeOrder(order: Omit<Order, "id" | "reference" | "createdAt" | "demo">): Order {
  const full: Order = {
    ...order,
    id: `ord_${seq}`,
    reference: makeReference(),
    createdAt: new Date().toISOString(),
    demo: true,
  };
  orders.set(full.id, full);
  return full;
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}

export function listOrders(): Order[] {
  return Array.from(orders.values());
}
