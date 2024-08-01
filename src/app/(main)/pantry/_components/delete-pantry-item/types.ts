import { z } from "zod";

export const deletePantryItemSchema = z.object({
  id: z.string().min(1),
});
