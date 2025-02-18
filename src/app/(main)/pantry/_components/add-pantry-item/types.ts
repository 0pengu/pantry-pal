import { z } from "zod";

export const addPantryItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().min(1).max(1000).int(),
  expirationDate: z
    .string()
    .refine(
      (string) => {
        const date = new Date(string);
        return date instanceof Date && !isNaN(date.getTime());
      },
      { message: "Invalid date" }
    )
    .refine((string) => new Date(string) > new Date(), {
      message: "Expiration date must be in the future",
    }),
  notes: z.string().max(30000).optional(),
  imageUrl: z.string().optional(),
});

export const aiPantryItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().min(1).max(1000),
  notes: z.string().max(30000).optional(),
  imageUrl: z.string().optional(),
});
