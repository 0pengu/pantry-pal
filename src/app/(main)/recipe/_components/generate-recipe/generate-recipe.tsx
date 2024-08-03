"use client";

import { generateRecipe } from "@/app/(main)/recipe/_components/generate-recipe/actions";
import { generateRecipeSchema } from "@/app/(main)/recipe/_components/generate-recipe/types";
import { recipe } from "@/app/(main)/recipe/types";
import { useGlobalDisableStore } from "@/app/(main)/store";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export default function GenerateRecipe() {
  const [recipe, setRecipe] = useState<
    z.infer<typeof generateRecipeSchema> | undefined
  >(undefined);

  const [disabled, setDisabled] = useGlobalDisableStore((state) => [
    state.disabled,
    state.setDisabled,
  ]);

  const onClick = async () => {
    setDisabled(true);
    const promised = generateRecipe();
    toast.promise(promised, {
      loading: "Generating recipe. This could take a while, please wait...",
      success: "Recipe generated",
      error: "Error generating recipe",
    });

    const { recipe: generatedRecipe } = await promised;
    setRecipe(generatedRecipe);
  };
  return (
    <div className="flex flex-col justify-center items-center py-2s">
      <Button variant="contained" color="primary" onClick={onClick}>
        Generate
      </Button>

      {recipe && (
        <div className="border shadow-xl border-gray-300 p-4 rounded-lg my-4 shadow-gray-900">
          <Typography variant="h4">{recipe.name}</Typography>
          <div className="w-full h-[1px] border-b border-gray-300 my-4"></div>
          {recipe.imageUrl && (
            <div className="w-full h-48 relative flex justify-center items-center">
              <Image
                src={recipe.imageUrl}
                alt="Uploaded"
                width={200}
                height={200}
                className="rounded-md border border-gray-200"
              />
            </div>
          )}
          <div className="w-full h-[1px] border-b border-gray-300 my-4"></div>
          <Typography variant="body1">Ingredients</Typography>
          <ul className="list-disc pl-4">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {/* {ingredient.itemsWeNeed}/{ingredient.quantity} - 
                {" "} */}
                {ingredient.name}
                {/* <ul className="list-image-none pl-4">
                  <li>Quantity in cupboard: {ingredient.quantity}</li>
                </ul> */}
              </li>
            ))}
          </ul>
          <div className="w-full h-[1px] border-b border-gray-300 my-4"></div>
          <Typography variant="body1">Instructions</Typography>
          <ol className="list-decimal pl-4">
            {recipe.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
