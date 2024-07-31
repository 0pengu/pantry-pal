"use client";

import AddPantryItem from "@/app/(main)/dashboard/_components/add-pantry-item/add-pantry-item";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { formatFutureTime } from "@/app/(main)/dashboard/_utils/formatTime";
import { useAuth } from "@/context/AuthContext";
import db from "@/utils/db";
import { Add, Check, Delete, Edit, Error, X } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useFilteredPantryItemsState,
  useRefreshState,
} from "@/app/(main)/dashboard/store";
import DeletePantryItem from "@/app/(main)/dashboard/_components/delete-pantry-item/delete-pantry-item";
import EditPantryItem from "@/app/(main)/dashboard/_components/edit-pantry-item/edit-pantry-item";
import Search from "@/app/(main)/dashboard/_components/search";
import { AnimatePresence, motion } from "framer-motion";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    redirect("/login");
  }

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
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredPantryItemsByTime.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-100 shadow-lg rounded-md p-4 flex flex-col min-h-40"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <h2>
                  <div className="inline mr-1 ">
                    {item.expirationDate.toDate() < new Date() ? (
                      <Error />
                    ) : (
                      <Check />
                    )}
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
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
