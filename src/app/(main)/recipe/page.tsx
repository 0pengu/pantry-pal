import { validateRequest } from "@/app/(auth)/validate/actions";
import { pantryItem } from "@/app/(main)/pantry/types";
import Recipes from "@/app/(main)/recipe/_components/recipes";
import { recipe } from "@/app/(main)/recipe/types";
import { db } from "@/utils/firebase";
import { redirect } from "next/navigation";

export default async function RecipePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const recipes = (
    await db.collection(`users/${user.id}/recipes`).get()
  ).docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      // TODO - Fix any type
      ingredients: data.ingredients.map((ingredient: any) => {
        return {
          ...ingredient,
          id: ingredient.id,
          expirationDate: ingredient.expirationDate.toDate(),
        } as pantryItem;
      }),
    } as recipe;
  });

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

  return <Recipes recipes={recipes} pantryItems={pantryItems} />;
}
