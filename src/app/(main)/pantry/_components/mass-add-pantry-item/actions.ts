"use server";

import { validateRequest } from "@/app/(auth)/validate/actions";
import { addPantryItemSchema } from "@/app/(main)/pantry/_components/add-pantry-item/types";
import { db } from "@/utils/firebase";
import { openai } from "@ai-sdk/openai";
import { Timestamp } from "firebase-admin/firestore";
import { CoreMessage, generateObject } from "ai";
import moment from "moment";

export async function massUploadImagesWithAi(
  data: string[]
): Promise<{ success: boolean }> {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("You must be logged in to mass upload images");
  }

  for (const imageUrl of data) {
    if (
      !imageUrl.startsWith(
        "https://pcckg7vc4l1sejmw.public.blob.vercel-storage.com"
      )
    ) {
      throw new Error(
        "Invalid image format. Must be images from within Pantry Tracker."
      );
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: addPantryItemSchema,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `I have an image of a pantry item. Please analyze the image and provide the following details: 1. The name of the item. 2. The quantity or amount of the item. 3. The expiration date (if visible). 3.a. If the expiration date is not visible, estimate a typical expiration date for that type of item from today's date (Today's date is ${moment().format(
                  "MMMM D, YYYY"
                )}). Any notable characteristics or details about the item (e.g., brand, packaging, unique features). Any additional relevant information you can deduce from the image. Return the same url given here: ${imageUrl}`,
              },
              {
                type: "image",
                image: imageUrl,
              },
            ],
          },
          {
            role: "user",
            content: imageUrl,
          },
        ] as CoreMessage[],
      });

      const expirationDateEst = object.expirationDate
        ? moment.tz(object.expirationDate, "America/New_York").toDate()
        : null;

      const editedData = {
        ...object,
        expirationDate: expirationDateEst
          ? Timestamp.fromDate(expirationDateEst)
          : null,
        imageUrl: imageUrl,
      };

      const docRef = await db
        .collection(`users/${user.id}/pantry`)
        .add(editedData);

      await docRef.update({ id: docRef.id });
    } catch (error) {
      console.error(`Error processing image ${imageUrl}:`, error);
      // Optionally, handle the error according to your needs, e.g., log it, notify the user, etc.
    }
  }

  return { success: true };
}
