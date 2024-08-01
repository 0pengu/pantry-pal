"use server";

import { validateRequest } from "@/app/(auth)/validate/actions";
import { addPantryItemSchema } from "@/app/(main)/dashboard/_components/add-pantry-item/types";
import { db } from "@/utils/firebase";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment-timezone";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { put } from "@vercel/blob";

export async function addPantryItem(data: z.infer<typeof addPantryItemSchema>) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("You must be logged in to add a pantry item");
  }

  try {
    // Convert the expirationDate to EST
    const expirationDateEst = moment
      .tz(data.expirationDate, "America/New_York")
      .toDate();

    const editedData = {
      ...data,
      expirationDate: Timestamp.fromDate(expirationDateEst),
    };

    // Create a new document in the user's pantry collection
    const docRef = await db
      .collection(`users/${user.id}/pantry`)
      .add(editedData);

    // Update the document with its own ID
    await docRef.update({ id: docRef.id });

    // Return success message
    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error adding pantry item");
  }
}

export async function uploadImage(formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("You must be logged in to add a pantry item");
  }

  const imageFile = formData.get("image") as File;
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });
  revalidatePath("/");
  return blob;
}
