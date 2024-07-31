import { deletePantryItemSchema } from "@/app/(main)/dashboard/_components/delete-pantry-item/types";
import { formatFutureTime } from "@/app/(main)/dashboard/_utils/formatTime";
import { useRefreshState } from "@/app/(main)/dashboard/store";
import { pantryItem } from "@/app/(main)/dashboard/types";
import db from "@/utils/db";
import { deleteDoc, doc } from "@firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { User } from "firebase/auth";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Error, Check } from "@mui/icons-material";

export default function DeletePantryItem({
  user,
  pantryItem,
}: {
  user: User;
  pantryItem: pantryItem;
}) {
  const [refreshes, setRefreshes] = useRefreshState((state) => [
    state.refreshes,
    state.setRefreshes,
  ]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const form = useForm<z.infer<typeof deletePantryItemSchema>>({
    resolver: zodResolver(deletePantryItemSchema),
    defaultValues: {
      id: pantryItem.id,
    },
  });

  const onSubmit = async (data: z.infer<typeof deletePantryItemSchema>) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/pantry/${data.id}`));
      form.reset({
        id: "",
      });
      handleClose();
      setRefreshes(refreshes + 1);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} color="error">
        <Delete />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: form.handleSubmit(onSubmit),
        }}
      >
        <DialogTitle>Add Item to Pantry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
          <motion.div
            key={pantryItem.id}
            className="bg-gray-100 shadow-lg rounded-md p-4 flex flex-col min-h-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between">
              <h2>
                <div className="inline mr-1 ">
                  {pantryItem.expirationDate.toDate() < new Date() ? (
                    <Error />
                  ) : (
                    <Check />
                  )}
                </div>
                {pantryItem.name}{" "}
                <div className="inline bg-black text-white rounded-full px-2 text-center">
                  {pantryItem.quantity}
                </div>
              </h2>
            </div>
            <div className="bg-black text-white rounded-full my-4 p-2 text-center">
              {formatFutureTime(
                pantryItem.expirationDate.toDate().toISOString()
              )}
            </div>
            <p className="pt-2">{pantryItem.notes}</p>
          </motion.div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="github">
            Cancel
          </Button>
          <Button type="submit" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
