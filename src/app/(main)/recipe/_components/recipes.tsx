"use client";

import { formatFutureTime } from "@/app/(main)/pantry/_utils/formatTime";
import { pantryItem } from "@/app/(main)/pantry/types";
import GenerateRecipe from "@/app/(main)/recipe/_components/generate-recipe/generate-recipe";
import Search from "@/app/(main)/recipe/_components/search";
import { recipe } from "@/app/(main)/recipe/types";
import { Button, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const maxDuration = 58;

export default function Recipes({
  recipes,
  pantryItems,
}: {
  recipes: recipe[];
  pantryItems: pantryItem[];
}) {
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  return (
    <main className="h-[calc(100vh-200px)] flex flex-col items-center">
      <Typography variant="h3" className="p-2 pb-0">
        Generate a recipe
      </Typography>
      <Typography variant="body1" className="p-2">
        Generate a recipe based on the ingredients in your pantry
      </Typography>
      <GenerateRecipe />
    </main>
  );
}
