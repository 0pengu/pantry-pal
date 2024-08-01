"use server";

import { validateRequest } from "@/app/(auth)/validate/actions";
import {
  addPantryItemSchema,
  aiPantryItemSchema,
} from "@/app/(main)/dashboard/_components/add-pantry-item/types";
import { db } from "@/utils/firebase";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment-timezone";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { put } from "@vercel/blob";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { CoreMessage, generateObject, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";

// helper function to convert a file to base64
const fileToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
};

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

export async function uploadImageWithAi(formData: FormData) {
  const imageFile = formData.get("image") as File;
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });
  revalidatePath("/");

  // Use @vercel/ai SDK to get the pantry item details

  const base64Image = await fileToBase64(imageFile);

  const aiResponse = await generateObject({
    model: openai("gpt-4o"),
    schema: addPantryItemSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `I have an image of a pantry item. Please analyze the image and provide the following details: 1. The name of the item. 2. The quantity or amount of the item. 3. The expiration date (if visible). 3.a. If the expiration date is not visible, estimate a typical expiration date for that type of item from today's date (Today's date is ${moment().format(
              "MMMM D, YYYY"
            )}). Any notable characteristics or details about the item (e.g., brand, packaging, unique features). Any additional relevant information you can deduce from the image.`,
          },
          {
            type: "image",
            image: blob.url,
          },
        ],
      },
      {
        role: "user",
        content: base64Image,
      },
    ] as CoreMessage[],
  });

  if (!aiResponse) {
    throw new Error("AI processing failed");
  }

  return {
    ...aiResponse.object,
    imageUrl: blob.url,
  } as z.infer<typeof addPantryItemSchema>;
}
