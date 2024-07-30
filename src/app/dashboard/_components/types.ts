import { z } from "zod";

export const userIdSchema = z.object({
  id: z
    .string()
    .max(8, "User ID must be 8 characters long")
    .min(8, "User ID must be 8 characters long"),
});
