import { validateRequest } from "@/app/(auth)/validate/actions";
import PantryItems from "@/app/(main)/pantry/_components/pantry-items";
import { pantryItem } from "@/app/(main)/pantry/types";
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

  return <PantryItems pantryItems={pantryItems} />;
}
