export const FREE_SHIPPING_THRESHOLD = 1999;

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  eta: string;
  fee: number; // base fee (may be waived by threshold)
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "3–5 business days",
    eta: "3–5 business days",
    fee: 199,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "1–2 business days",
    eta: "1–2 business days",
    fee: 399,
  },
];

export function shippingFee(methodId: string, subtotal: number): number {
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (method.id === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.fee;
}
