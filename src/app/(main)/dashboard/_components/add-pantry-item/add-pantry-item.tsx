"use client";

import {
  addPantryItem,
  uploadImage,
} from "@/app/(main)/dashboard/_components/add-pantry-item/actions";
import { addPantryItemSchema } from "@/app/(main)/dashboard/_components/add-pantry-item/types";
import { useCustomDropzone } from "@/app/(main)/dashboard/_components/custom-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Check, Error } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "lucia";
import moment from "moment-timezone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function AddPantryItem({ user }: { user: User }) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
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
      imageUrl: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addPantryItemSchema>) => {
    const response = addPantryItem({ ...data, imageUrl });
    toast.promise(response, {
      loading: "Adding item to pantry...",
      success: "Item added to pantry",
      error: "Error adding item to pantry",
    });
    const { success } = await response;
    if (!success) {
      return;
    }
    form.reset({
      name: "",
      quantity: 1,
      expirationDate: getDefaultExpirationDate(),
      notes: "",
    });
    router.refresh();
    handleClose();
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    const response = uploadImage(formData);
    toast.promise(response, {
      loading: "Adding item to pantry...",
      success: "Item added to pantry",
      error: "Error adding item to pantry",
    });
    const blobResult = await response;
    const imageUrl = blobResult.url;
    setImageUrl(imageUrl);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFile,
  } = useCustomDropzone(onDrop);

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
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Uploaded"
              className="w-full mt-4"
              width={200}
              height={200}
            />
          ) : (
            <div
              {...getRootProps({
                className: "dropzone",
              })}
              className="grid w-full items-center gap-1.5 border border-dashed p-4"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop here...</p>
              ) : (
                <p className="text-xs">
                  Drag and drop some files here, or click to select files
                </p>
              )}
              <Button type="button" onClick={openFile}>
                Browse Files
              </Button>
              <p className="text-xs">Images only. Max 4 MB. One file only.</p>
            </div>
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
