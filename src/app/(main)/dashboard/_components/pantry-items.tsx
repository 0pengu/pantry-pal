"use client";

import AddPantryItem from "@/app/(main)/dashboard/_components/add-pantry-item/add-pantry-item";
import DeletePantryItem from "@/app/(main)/dashboard/_components/delete-pantry-item/delete-pantry-item";
import EditPantryItem from "@/app/(main)/dashboard/_components/edit-pantry-item/edit-pantry-item";
import Search from "@/app/(main)/dashboard/_components/search";
import { formatFutureTime } from "@/app/(main)/dashboard/_utils/formatTime";
import {
  useRefreshState,
  useFilteredPantryItemsState,
} from "@/app/(main)/dashboard/store";
import { pantryItem } from "@/app/(main)/dashboard/types";
import db from "@/utils/db";
import { getDocs, collection } from "@firebase/firestore";
import { Check, Error } from "@mui/icons-material";
import { Typography, Backdrop, CircularProgress } from "@mui/material";
import { User } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PantryItems({ user }: { user: User }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<pantryItem[]>([]);

  const [refreshes, setRefreshes] = useRefreshState((state) => [
    state.refreshes,
    state.setRefreshes,
  ]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 250));
      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/pantry`)
      );
      setItems(querySnapshot.docs.map((doc) => doc.data() as pantryItem));
      setLoading(false);
    };

    fetchItems();
  }, [refreshes, user.uid]);

  const filteredPantryItems = useFilteredPantryItemsState(
    (state) => state.pantryItems
  );

  const filteredPantryItemsByTime = filteredPantryItems.sort(
    (a, b) => a.expirationDate.toMillis() - b.expirationDate.toMillis()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshes(refreshes + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshes, setRefreshes]);

  return (
    <main className="h-[calc(100vh-200px)]">
      <Typography variant="h3" className="p-2 pb-0">
        Welcome to your Pantry
      </Typography>
      <div className="p-2 space-x-2">
        <AddPantryItem user={user} />
        <Search pantryItems={items} />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {filteredPantryItemsByTime.length === 0 && (
        <Typography variant="h4" className="p-2">
          No items in your pantry
        </Typography>
      )}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredPantryItemsByTime.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-100 shadow-lg rounded-md p-4 flex flex-col min-h-40"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <h2>
                  <div className="inline mr-1 ">
                    {item.expirationDate.toDate() < new Date() ? (
                      <Error />
                    ) : null}
                  </div>
                  {item.name}{" "}
                  <div className="inline bg-black text-white rounded-full px-2 text-center">
                    {item.quantity}
                  </div>
                </h2>
                <div className="space-x-2">
                  <EditPantryItem user={user} pantryItem={item} />
                  <DeletePantryItem user={user} pantryItem={item} />
                </div>
              </div>
              <div className="bg-black text-white rounded-full my-4 p-2 text-center">
                {formatFutureTime(item.expirationDate.toDate().toISOString())}
              </div>
              <p className="pt-2">{item.notes}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
