"use server";

import { validateRequest } from "@/app/(auth)/validate/actions";
import { deletePantryItemSchema } from "@/app/(main)/dashboard/_components/delete-pantry-item/types";
import { db } from "@/utils/firebase";
import { z } from "zod";

export async function deletePantryItem(
  data: z.infer<typeof deletePantryItemSchema>
) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("You must be logged in to delete a pantry item");
  }

  try {
    await db.collection(`users/${user.id}/pantry`).doc(data.id).delete();

    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error deleting pantry item");
  }
}
