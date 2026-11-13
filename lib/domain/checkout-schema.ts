import { z } from "zod";
import { SHIPPING_METHODS } from "./shipping";

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  line1: z.string().min(2, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        qty: z.number().int().min(1).max(10),
        colorId: z.string().optional(),
        size: z.string().optional(),
      }),
    )
    .min(1, "Cart is empty"),
  shipping: addressSchema,
  method: z.string().refine((m) => SHIPPING_METHODS.some((x) => x.id === m), {
    message: "Unknown shipping method",
  }),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
