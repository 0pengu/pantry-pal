import { validateRequest } from "@/app/(auth)/validate/actions";
import { redirect } from "next/navigation";

export default async function RecipePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Recipes (WIP)</h1>
    </main>
  );
}
