import { validateRequest } from "@/app/(auth)/validate/actions";
import PantryItems from "@/app/(main)/dashboard/_components/pantry-items";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { db } from "@/utils/firebase";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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

  return <PantryItems user={user} pantryItems={pantryItems} />;
}
