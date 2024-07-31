import { pantryItem } from "@/app/(main)/dashboard/types";
import { create } from "zustand";

type refreshStore = {
  refreshes: number;
  setRefreshes: (refreshes: number) => void;
};

export const useRefreshState = create<refreshStore>()((set) => ({
  refreshes: 0,
  setRefreshes: (refreshes) => set({ refreshes }),
}));

type filteredPantryItemsType = {
  pantryItems: pantryItem[];
  setPantryItems: (pantryItems: pantryItem[]) => void;
};

export const useFilteredPantryItemsState = create<filteredPantryItemsType>()(
  (set) => ({
    pantryItems: [],
    setPantryItems: (pantryItems) => set({ pantryItems }),
  })
);
