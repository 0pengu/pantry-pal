import { deletePantryItemSchema } from "@/app/(main)/dashboard/_components/delete-pantry-item/types";
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
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
          <TextField
            value={pantryItem.name}
            label="What is the name of the item?"
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            disabled
          />
          <TextField
            value={pantryItem.quantity}
            type="number"
            label="How many do you have?"
            margin="dense"
            fullWidth
            variant="standard"
            disabled
          />
          <TextField
            value={moment(pantryItem.expirationDate.toDate()).format(
              "YYYY-MM-DDTHH:mm"
            )}
            label="When does it expire?"
            margin="dense"
            fullWidth
            variant="standard"
            type="datetime-local"
            disabled
          />
          <TextField
            value={pantryItem.notes}
            label="Any notes you want to add?"
            margin="dense"
            fullWidth
            variant="standard"
            disabled
          />
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
