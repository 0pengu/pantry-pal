"use server";

import { validateRequest } from "@/app/(auth)/validate/actions";
import { editPantryItemSchema } from "@/app/(main)/dashboard/_components/edit-pantry-item/types";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { db } from "@/utils/firebase";
import { Timestamp } from "@firebase/firestore";
import moment from "moment-timezone";
import { z } from "zod";

export async function editPantryItem(
  data: z.infer<typeof editPantryItemSchema>
) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("You must be logged in to edit a pantry item");
  }

  try {
    // Convert the expirationDate to EST
    const expirationDate = moment
      .tz(data.expirationDate, "America/New_York")
      .toDate();

    await db
      .collection(`users/${user.id}/pantry`)
      .doc(data.id)
      .update({
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        expirationDate: expirationDate,
        notes: data.notes,
        imageUrl: data.imageUrl || "",
      } as pantryItem);

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error editing pantry item");
  }
}
