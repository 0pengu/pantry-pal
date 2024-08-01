"use client";

import {
  addPantryItem,
  uploadImage,
  uploadImageWithAi,
} from "@/app/(main)/pantry/_components/add-pantry-item/actions";
import { addPantryItemSchema } from "@/app/(main)/pantry/_components/add-pantry-item/types";
import { useCustomDropzone } from "@/app/(main)/pantry/_components/custom-dropzone";
import { pantryItem } from "@/app/(main)/pantry/types";
import { useGlobalDisableStore } from "@/app/(main)/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Check, Error, X } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { readStreamableValue } from "ai/rsc";
import { User } from "lucia";
import moment from "moment-timezone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { CheckmarkIcon, ErrorIcon } from "react-hot-toast";
import { z } from "zod";

const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export default function AddPantryItem({ user }: { user: User }) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const [useAi, setUseAi] = useState(true);

  const [disabled, setDisabled] = useGlobalDisableStore((state) => [
    state.disabled,
    state.setDisabled,
  ]);

  const [streamedResponse, setStreamedResponse] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!disabled) {
      setOpen(false);
    }
    form.reset();
    setUseAi(true);
    setImageUrl(undefined);
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

  useEffect(() => {
    if (streamedResponse) {
      try {
        const parsedResponse = JSON.parse(streamedResponse) as pantryItem;
        console.log(parsedResponse);
        form.setValue("name", parsedResponse.name);
        form.setValue("quantity", parsedResponse.quantity);
        form.setValue(
          "expirationDate",
          moment(parsedResponse.expirationDate).format("YYYY-MM-DDTHH:mm")
        );
        form.setValue("notes", parsedResponse.notes);
      } catch (error) {
        console.error("Failed to validate streamed response", error);
      }
    }
  }, [form, streamedResponse]);

  const onSubmit = async (data: z.infer<typeof addPantryItemSchema>) => {
    setDisabled(true);
    try {
      const response = addPantryItem({ ...data, imageUrl });
      toast.promise(response, {
        loading: "Adding item to pantry...",
        success: "Item added to pantry",
        error: "Error adding item to pantry",
      });
      const { success } = await response;
      setDisabled(false);
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
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setDisabled(true);
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("image", file);

      if (useAi) {
        const response = uploadImageWithAi(formData);
        toast.promise(response, {
          loading: "Uploading image and processing with AI...",
          success:
            "Image uploaded, please wait for AI to process and stream the data",
          error: "Error uploading image and/or processing with AI",
        });

        const { object, imageUrl } = await response;

        for await (const partialObject of readStreamableValue(object)) {
          if (partialObject) {
            setStreamedResponse(JSON.stringify(partialObject, null, 2));
          }
        }

        setDisabled(false);
        setImageUrl(imageUrl);
      } else {
        const response = uploadImage(formData);
        toast.promise(response, {
          loading: "Uploading image...",
          success: "Image uploaded",
          error: "Error uploading image",
        });

        const blobResult = await response;
        setDisabled(false);
        const imageUrl = blobResult.url;
        setImageUrl(imageUrl);
      }
    } catch (error) {
      console.error(error);
      setDisabled(false);
    } finally {
      setDisabled(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFile,
  } = useCustomDropzone(onDrop);

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="success"
        disabled={disabled}
      >
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
          <ToggleButton
            value="check"
            selected={useAi}
            onChange={() => setUseAi((prev) => !prev)}
          >
            {useAi ? <CheckmarkIcon /> : <ErrorIcon />}
            <span className="pl-2">Use AI to fill in details</span>
          </ToggleButton>
          <Typography className="pt-2" variant="body2">
            Keep in mind that using AI will overwrite any existing data on the
            form
          </Typography>
          <TextField
            {...form.register("name")}
            label="What is the name of the item?"
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            error={!!form.formState.errors.name}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{
              shrink: true,
            }}
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
