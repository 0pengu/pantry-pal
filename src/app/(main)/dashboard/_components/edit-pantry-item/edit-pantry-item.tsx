"use client";

import { editPantryItem } from "@/app/(main)/dashboard/_components/edit-pantry-item/actions";
import { editPantryItemSchema } from "@/app/(main)/dashboard/_components/edit-pantry-item/types";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit, Error } from "@mui/icons-material";
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
import { useCustomDropzone } from "@/app/(main)/dashboard/_components/custom-dropzone";
import { uploadImage } from "@/app/(main)/dashboard/_components/add-pantry-item/actions";
import { useGlobalDisableStore } from "@/app/(main)/store";

export default function EditPantryItem({
  user,
  pantryItem,
}: {
  user: User;
  pantryItem: pantryItem;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    pantryItem.imageUrl
  );

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
      setImageUrl(pantryItem.imageUrl);
    }
  };

  const form = useForm<z.infer<typeof editPantryItemSchema>>({
    resolver: zodResolver(editPantryItemSchema),
    defaultValues: {
      id: pantryItem.id,
      name: pantryItem.name,
      quantity: pantryItem.quantity,
      expirationDate: moment(pantryItem.expirationDate).format(
        "YYYY-MM-DDTHH:mm"
      ),
      notes: pantryItem.notes,
      imageUrl: pantryItem.imageUrl,
    },
  });

  const onSubmit = async (data: z.infer<typeof editPantryItemSchema>) => {
    setDisabled(true);
    try {
      const response = editPantryItem({ ...data, imageUrl });
      toast.promise(response, {
        loading: "Editing item in pantry...",
        success: "Item edited in pantry",
        error: "Error editing item in pantry",
      });
      const { success } = await response;
      setDisabled(false);
      if (!success) {
        return;
      }
      form.reset({
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        expirationDate: moment(data.expirationDate).format("YYYY-MM-DDTHH:mm"),
        notes: data.notes,
        imageUrl: data.imageUrl,
      });
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setDisabled(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    const response = uploadImage(formData);
    toast.promise(response, {
      loading: "Uploading image...",
      success: "Image uploaded",
      error: "Error uploading image",
    });
    const blobResult = await response;
    const newImageUrl = blobResult.url;
    setImageUrl(newImageUrl);
    setDisabled(false);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFile,
  } = useCustomDropzone(onDrop);

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} disabled={disabled}>
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
          {form.formState.errors.notes && (
            <p>{form.formState.errors.notes.message}</p>
          )}
          {imageUrl ? (
            <div className="space-y-2">
              <Image
                src={imageUrl}
                alt="Uploaded"
                className="w-full mt-4"
                width={200}
                height={200}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={openFile}
                className="mt-2"
                fullWidth
                disabled={disabled}
              >
                Replace Image
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setImageUrl(undefined)}
                className="mt-2"
                fullWidth
                disabled={disabled}
              >
                Remove Image
              </Button>
            </div>
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
              <Button type="button" onClick={openFile} disabled={disabled}>
                Browse Files
              </Button>
              <p className="text-xs">Images only. Max 4 MB. One file only.</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="github" disabled={disabled}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
