"use client";

import { deletePantryItemSchema } from "@/app/(main)/pantry/_components/delete-pantry-item/types";
import { formatFutureTime } from "@/app/(main)/pantry/_utils/formatTime";
import { pantryItem } from "@/app/(main)/pantry/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { User } from "lucia";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deletePantryItem } from "@/app/(main)/pantry/_components/delete-pantry-item/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGlobalDisableStore } from "@/app/(main)/store";

export default function DeletePantryItem({
  pantryItem,
}: {
  pantryItem: pantryItem;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useGlobalDisableStore((state) => [
    state.disabled,
    state.setDisabled,
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!disabled) {
      setOpen(false);
    }
  };

  const form = useForm<z.infer<typeof deletePantryItemSchema>>({
    resolver: zodResolver(deletePantryItemSchema),
    defaultValues: {
      id: pantryItem.id,
    },
  });

  const onSubmit = async (data: z.infer<typeof deletePantryItemSchema>) => {
    setDisabled(true);
    try {
      const response = deletePantryItem(data);
      toast.promise(response, {
        loading: "Deleting item from pantry...",
        success: "Item deleted from pantry",
        error: "Error deleting item from pantry",
      });
      const { success } = await response;
      setDisabled(false);
      if (!success) {
        return;
      }
      form.reset({
        id: "",
      });
      handleClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="error"
        disabled={disabled}
      >
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
        <DialogTitle>Delete Item from Pantry</DialogTitle>
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
                {pantryItem.expirationDate < new Date() && (
                  <div className="inline bg-black text-white rounded-full px-2 text-center">
                    !
                  </div>
                )}{" "}
                {pantryItem.name}{" "}
                <div className="inline bg-black text-white rounded-full px-2 text-center">
                  {pantryItem.quantity}
                </div>
              </h2>
            </div>
            <div className="bg-black text-white rounded-full my-4 p-2 text-center">
              {formatFutureTime(pantryItem.expirationDate.toISOString())}
            </div>
            <p className="pt-2">{pantryItem.notes}</p>
          </motion.div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="github" disabled={disabled}>
            Cancel
          </Button>
          <Button type="submit" color="error" disabled={disabled}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
