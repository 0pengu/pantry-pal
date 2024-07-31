import { auth, provider } from "@/utils/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { redirect } from "next/navigation";

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user) {
      redirect("/dashboard");
    }
  } catch (error) {}
};

export const logout = async () => {
  try {
    await signOut(auth);
    redirect("/");
  } catch (error) {}
};
