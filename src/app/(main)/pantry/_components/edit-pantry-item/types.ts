import { z } from "zod";

export const editPantryItemSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  quantity: z.number().min(1).max(1000),
  expirationDate: z.string().refine(
    (string) => {
      const date = new Date(string);
      return date instanceof Date && !isNaN(date.getTime());
    },
    { message: "Invalid date" }
  ),
  notes: z.string().max(30000).optional(),
  imageUrl: z.string().optional(),
});
