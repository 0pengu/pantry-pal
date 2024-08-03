import { validateRequest } from "@/app/(auth)/validate/actions";
import { pantryItem } from "@/app/(main)/pantry/types";
import Recipes from "@/app/(main)/recipe/_components/recipes";
import { recipe } from "@/app/(main)/recipe/types";
import { db } from "@/utils/firebase";
import { Typography } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

export const maxDuration = 58;

export default async function RecipePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
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

  if (pantryItems.length === 0) {
    return (
      <main className="h-[calc(100vh-200px)] flex flex-col items-center">
        <Typography variant="h3" className="p-2 pb-0">
          Generate a Recipe
        </Typography>
        <Typography variant="body1" className="p-2">
          You have no pantry items.{" "}
          <Link href={"/pantry"}>
            <span className="underline">Click me to add a pantry item.</span>
          </Link>
        </Typography>
      </main>
    );
  }

  return <Recipes />;
}
