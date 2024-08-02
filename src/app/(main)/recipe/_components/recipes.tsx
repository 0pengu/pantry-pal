"use client";

import { formatFutureTime } from "@/app/(main)/pantry/_utils/formatTime";
import { pantryItem } from "@/app/(main)/pantry/types";
import AddRecipe from "@/app/(main)/recipe/_components/add-recipe/add-recipe";
import Search from "@/app/(main)/recipe/_components/search";
import { recipe } from "@/app/(main)/recipe/types";
import { Button, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Recipes({
  recipes,
  pantryItems,
}: {
  recipes: recipe[];
  pantryItems: pantryItem[];
}) {
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  return (
    <main className="h-[calc(100vh-200px)]">
      <Typography variant="h3" className="p-2 pb-0">
        Your recipes
      </Typography>
      <div className="p-2 space-x-2">
        <AddRecipe pantryItems={pantryItems} />
        <Search recipes={recipes} setFilteredRecipes={setFilteredRecipes} />
      </div>
      {filteredRecipes.length === 0 && (
        <Typography variant="h4" className="p-2">
          No recipes found
        </Typography>
      )}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredRecipes.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-100 shadow-lg rounded-md p-4 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <h2>{item.name}</h2>
                <div className="space-x-2">
                  {/* <EditPantryItem pantryItem={item} />
                  <DeletePantryItem pantryItem={item} /> */}
                </div>
              </div>
              {item.imageUrl && (
                <>
                  <div className="w-full h-[1px] bg-gray-300 my-2" />
                  <div className="flex justify-center">
                    <Image
                      src={item.imageUrl}
                      alt="Uploaded"
                      width={200}
                      height={200}
                      className="rounded-md border border-gray-200"
                    />
                  </div>
                </>
              )}
              <Typography variant="h5">Ingredients</Typography>
              <ul className="list-disc pl-5">
                {item.ingredients.map((ingredient) => {
                  return (
                    <li key={ingredient.id}>
                      {ingredient.quantity} {ingredient.name}
                      <ul className="list-disc pl-5">
                        <li>
                          {formatFutureTime(
                            ingredient.expirationDate.toISOString()
                          )}
                        </li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
              <Typography variant="h5">Instructions</Typography>
              <ol className="list-decimal pl-5">
                {item.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
