import { Timestamp } from "@firebase/firestore";

export type pantryItem = {
  id: string;
  name: string;
  quantity: number;
  expirationDate: Timestamp;
  notes?: string;
};
