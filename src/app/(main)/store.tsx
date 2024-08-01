import { create } from "zustand";

type globalDisableType = {
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
};

export const useGlobalDisableStore = create<globalDisableType>()((set) => ({
  disabled: false,
  setDisabled: (disabled: boolean) => set({ disabled }),
}));
