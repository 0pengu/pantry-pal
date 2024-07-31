import { addPantryItemSchema } from "@/app/(main)/dashboard/_components/add-pantry-item/types";
import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, Timestamp, updateDoc } from "@firebase/firestore";
import db from "@/utils/db";
import { User } from "firebase/auth";
import { useRefreshState } from "@/app/(main)/dashboard/store";
import moment from "moment-timezone";

export default function AddPantryItem({ user }: { user: User }) {
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

  // Function to get default expiration date in local timezone
  const getDefaultExpirationDate = () => {
    return moment().add(1, "hour").add(1, "minute").format("YYYY-MM-DDTHH:mm");
  };

  const form = useForm<z.infer<typeof addPantryItemSchema>>({
    resolver: zodResolver(addPantryItemSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      expirationDate: getDefaultExpirationDate(),
      notes: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addPantryItemSchema>) => {
    try {
      // Convert the expirationDate to EST
      const expirationDateEst = moment
        .tz(data.expirationDate, "America/New_York")
        .toDate();

      const editedData = {
        ...data,
        expirationDate: Timestamp.fromDate(expirationDateEst),
      };
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/pantry`),
        editedData
      );
      await updateDoc(docRef, { id: docRef.id });
      form.reset({
        name: "",
        quantity: 1,
        expirationDate: getDefaultExpirationDate(),
        notes: "",
      });
      handleClose();
      setRefreshes(refreshes + 1);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} color="success">
        <Add />
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
            Please complete all required fields
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
