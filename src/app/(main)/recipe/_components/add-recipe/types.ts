import { z } from "zod";

export const pantryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  expirationDate: z.date(),
  notes: z.string().optional(),
  imageUrl: z.string(),
});

export const addRecipeSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(300, "Title is too long"),
  pantryItems: z.array(pantryItemSchema),
  steps: z.array(z.string()).min(1, "Steps cannot be empty").max(100),
  imageUrl: z.string().optional(),
});
