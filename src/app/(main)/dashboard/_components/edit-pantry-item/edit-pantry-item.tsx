import { editPantryItemSchema } from "@/app/(main)/dashboard/_components/edit-pantry-item/types";
import { useRefreshState } from "@/app/(main)/dashboard/store";
import { pantryItem } from "@/app/(main)/dashboard/types";
import db from "@/utils/db";
import { doc, Timestamp, updateDoc } from "@firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";
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
import moment from "moment-timezone";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditPantryItem({
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

  const form = useForm<z.infer<typeof editPantryItemSchema>>({
    resolver: zodResolver(editPantryItemSchema),
    defaultValues: {
      id: pantryItem.id,
      name: pantryItem.name,
      quantity: pantryItem.quantity,
      expirationDate: moment(pantryItem.expirationDate.toDate()).format(
        "YYYY-MM-DDTHH:mm"
      ),
      notes: pantryItem.notes,
    },
  });

  const onSubmit = async (data: z.infer<typeof editPantryItemSchema>) => {
    try {
      // Convert the expirationDate to EST
      const expirationDate = moment
        .tz(data.expirationDate, "America/New_York")
        .toDate();

      const editedData = {
        ...data,
        expirationDate: Timestamp.fromDate(expirationDate),
      };
      await updateDoc(
        doc(db, `users/${user.uid}/pantry/${data.id}`),
        editedData
      );

      form.reset({
        id: editedData.id,
        name: editedData.name,
        quantity: editedData.quantity,
        expirationDate: moment(editedData.expirationDate.toDate()).format(
          "YYYY-MM-DDTHH:mm"
        ),
        notes: editedData.notes,
      });
      handleClose();
      setRefreshes(refreshes + 1);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        <Edit />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: form.handleSubmit(onSubmit),
        }}
      >
        <DialogTitle>Edit Pantry Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the details of the pantry item
          </DialogContentText>
          <TextField
            {...form.register("name")}
            label="What is the name of the item?"
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            error={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <p>{form.formState.errors.name.message}</p>
          )}
          <TextField
            {...form.register("quantity", {
              valueAsNumber: true,
              validate: (value) =>
                (Number.isInteger(value) && value > 0) ||
                "Must be a positive integer",
            })}
            type="number"
            label="How many do you have?"
            margin="dense"
            fullWidth
            variant="standard"
            error={!!form.formState.errors.quantity}
            onChange={(e) =>
              form.setValue("quantity", parseInt(e.target.value))
            }
          />
          {form.formState.errors.quantity && (
            <p>{form.formState.errors.quantity.message}</p>
          )}
          <TextField
            {...form.register("expirationDate")}
            label="When does it expire?"
            margin="dense"
            fullWidth
            variant="standard"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!form.formState.errors.expirationDate}
          />
          {form.formState.errors.expirationDate && (
            <p>{form.formState.errors.expirationDate.message}</p>
          )}
          <TextField
            {...form.register("notes")}
            label="Any notes you want to add?"
            margin="dense"
            fullWidth
            variant="standard"
            type="text"
            error={!!form.formState.errors.notes}
          />
          {form.formState.errors.notes && (
            <p>{form.formState.errors.notes.message}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="github">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
