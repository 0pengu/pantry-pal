"use server";

import { validateRequest } from "@/app/(auth)/validate/actions";
import { pantryItem } from "@/app/(main)/pantry/types";
import { generateRecipeSchema } from "@/app/(main)/recipe/_components/generate-recipe/types";
import { db } from "@/utils/firebase";
import { openAi } from "@/utils/openai";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

interface TextPart {
  type: "text";
  text: string;
}

export async function generateRecipe() {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("You must be logged in to generate a recipe");
  }

  const pantryItems = (
    await db.collection(`users/${user.id}/pantry`).get()
  ).docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      expirationDate: data.expirationDate.toDate(),
    } as pantryItem;
  });

  const pantryMessages: TextPart[] = pantryItems.map((item) => ({
    type: "text",
    text: `${item.quantity} ${item.name}`,
  }));

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: generateRecipeSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Generate a recipe based on the ingredients in my pantry.",
          },
          ...pantryMessages,
        ],
      },
    ],
    temperature: 0.7,
    topP: 0.9,
  });

  const { data } = await openAi.images.generate({
    model: "dall-e-3",
    prompt: `Generate an image for the recipe: ${JSON.stringify(
      object,
      null,
      2
    )}`,
  });

  const firstImage = data[0];

  const returnObject = {
    ...object,
    imageUrl: firstImage.url,
  };
  return { recipe: returnObject };
}
