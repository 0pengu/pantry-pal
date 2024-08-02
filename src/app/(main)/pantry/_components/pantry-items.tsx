"use client";

import AddPantryItem from "@/app/(main)/pantry/_components/add-pantry-item/add-pantry-item";
import DeletePantryItem from "@/app/(main)/pantry/_components/delete-pantry-item/delete-pantry-item";
import EditPantryItem from "@/app/(main)/pantry/_components/edit-pantry-item/edit-pantry-item";
import MassAddPantryItem from "@/app/(main)/pantry/_components/mass-add-pantry-item/mass-add-pantry-item";
import Search from "@/app/(main)/pantry/_components/search";
import { formatFutureTime } from "@/app/(main)/pantry/_utils/formatTime";
import { pantryItem } from "@/app/(main)/pantry/types";
import { Error } from "@mui/icons-material";
import { Backdrop, Button, CircularProgress, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucia";
import Image from "next/image";
import { useEffect, useState } from "react";
import { create } from "zustand";

export default function PantryItems({
  pantryItems,
}: {
  pantryItems: pantryItem[];
}) {
  const [loading, setLoading] = useState(false);

  const [filteredPantryItems, setFilteredPantryItems] = useState(pantryItems);

  return (
    <main className="h-[calc(100vh-200px)]">
      <Typography variant="h3" className="p-2 pb-0">
        Your pantry
      </Typography>
      <div className="p-2 space-x-2">
        <AddPantryItem />
        <Search
          pantryItems={pantryItems}
          setFilteredPantryItems={setFilteredPantryItems}
        />
      </div>
      {filteredPantryItems.length === 0 && (
        <Typography variant="h4" className="p-2">
          No pantry items found
        </Typography>
      )}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredPantryItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-100 shadow-lg rounded-md p-4 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <h2>
                  {item.expirationDate < new Date() && (
                    <div className="inline bg-black text-white rounded-full px-2 text-center">
                      !
                    </div>
                  )}{" "}
                  {item.name}{" "}
                  <div className="inline bg-black text-white rounded-full px-2 text-center">
                    {item.quantity}
                  </div>
                </h2>
                <div className="space-x-2">
                  <EditPantryItem pantryItem={item} />
                  <DeletePantryItem pantryItem={item} />
                </div>
              </div>
              <div className="bg-black text-white rounded-full my-4 p-2 text-center">
                {formatFutureTime(item.expirationDate.toISOString())}
              </div>
              <p className="pt-2">{item.notes}</p>
              {item.imageUrl && (
                <>
                  <div className="w-full h-[1px] bg-gray-300 my-2" />
                  <div className="flex justify-center">
                    <Image
                      src={item.imageUrl}
                      alt="Uploaded"
                      width={200}
                      height={200}
                      className="rounded-md border border-gray-200"
                    />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
