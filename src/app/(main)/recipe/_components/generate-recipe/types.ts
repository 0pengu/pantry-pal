import { z } from "zod";

const pantryItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(1000),
  itemsWeNeed: z.number().min(1).max(1000).int(),
  quantity: z.number().min(1).max(1000).int(),
  expirationDate: z.string().refine(
    (string) => {
      const date = new Date(string);
      return date instanceof Date && !isNaN(date.getTime());
    },
    { message: "Invalid date" }
  ),
  // Ignoring this for now because I am not validating any sort of data, this is just a generated recipe
  // .refine((string) => new Date(string) > new Date(), {
  //   message: "Expiration date must be in the future",
  // }),
  notes: z.string().max(30000).optional(),
  imageUrl: z.string().optional(),
});

export const generateRecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(pantryItemSchema),
  instructions: z.array(z.string()),
  imageUrl: z.string().optional(),
});
