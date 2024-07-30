"use server";

import db from "@/utils/db";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function addNewUser() {
  const id = uuidv4().slice(0, 8);
  try {
    const docRef = await setDoc(doc(db, "users", id), {});
    return {
      success: true,
      id,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
