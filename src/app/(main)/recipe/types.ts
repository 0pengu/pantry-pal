import { pantryItem } from "@/app/(main)/pantry/types";

export type recipe = {
  id: string;
  name: string;
  ingredients: pantryItem[];
  instructions: string[];
  imageUrl: string;
};
