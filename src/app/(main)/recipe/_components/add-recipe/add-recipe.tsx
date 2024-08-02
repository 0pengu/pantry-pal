"use client";

import { addRecipe } from "@/app/(main)/recipe/_components/add-recipe/actions";
import {
  addRecipeSchema,
  recipeItemSchema,
} from "@/app/(main)/recipe/_components/add-recipe/types";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { readStreamableValue } from "ai/rsc";
import { User } from "lucia";
import moment from "moment-timezone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

export default function AddRecipe({
  pantryItems,
}: {
  pantryItems: pantryItem[];
}) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
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
    form.reset();
    setImageUrl(undefined);
  };

  const form = useForm<z.infer<typeof addRecipeSchema>>({
    resolver: zodResolver(addRecipeSchema),
    defaultValues: {
      title: "",
      pantryItems: [{ itemId: "", quantity: 1 }],
      steps: [""],
      notes: "",
      imageUrl: "",
    },
  });

  const {
    fields: pantryFields,
    append: appendPantry,
    remove: removePantry,
  } = useFieldArray({
    control: form.control,
    name: "pantryItems",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const onSubmit = async (data: z.infer<typeof addRecipeSchema>) => {
    setDisabled(true);
    try {
      const response = addRecipe({ ...data, imageUrl });
      toast.promise(response, {
        loading: "Adding recipe...",
        success: "Recipe added successfully",
        error: "Error adding recipe",
      });
      const { success } = await response;
      setDisabled(false);
      if (!success) {
        return;
      }
      form.reset({
        title: "",
        pantryItems: [{ itemId: "", quantity: 1 }],
        steps: [""],
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
    console.log(acceptedFiles);
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
        <DialogTitle>Add Recipe</DialogTitle>
        {/* <DialogContent>
          <DialogContentText>
            Please complete all required fields
          </DialogContentText>
          <TextField
            {...form.register("title")}
            label="Recipe Title"
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            error={!!form.formState.errors.title}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
          />
          {form.formState.errors.title && (
            <p>{form.formState.errors.title.message}</p>
          )}
          <Typography variant="h6" className="pt-2">
            Pantry Items
          </Typography>
          {pantryFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Pantry Item</InputLabel>
                <Select
                  {...form.register(`pantryItems.${index}.itemId`)}
                  defaultValue={field.itemId}
                  disabled={disabled}
                >
                  {pantryItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                {...form.register(`pantryItems.${index}.quantity`, {
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isInteger(value) &&
                      value > pantryItems[index].quantity) ||
                    "Must be a positive integer",
                })}
                type="number"
                label="Quantity"
                margin="dense"
                variant="standard"
                error={!!form.formState.errors.pantryItems?.[index]?.quantity}
                onChange={(e) =>
                  form.setValue(
                    `pantryItems.${index}.quantity`,
                    parseInt(e.target.value)
                  )
                }
                disabled={disabled}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                type="button"
                onClick={() => removePantry(index)}
                disabled={disabled}
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendPantry({ itemId: "", quantity: 1 })}
            disabled={disabled}
          >
            Add Pantry Item
          </Button>
          <Typography variant="h6" className="pt-2">
            Steps
          </Typography>
          {stepFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <TextField
                {...form.register(`steps.${index}`)}
                label={`Step ${index + 1}`}
                margin="dense"
                fullWidth
                variant="standard"
                type="text"
                error={!!form.formState.errors.steps?.[index]}
                disabled={disabled}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                type="button"
                onClick={() => removeStep(index)}
                disabled={disabled}
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendStep("")}
            disabled={disabled}
          >
            Add Step
          </Button>
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
        </DialogContent> */}
        <DialogContent>WIP</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="github" disabled={disabled}>
            Cancel
          </Button>
          {/* <Button type="submit" disabled={disabled}>
            Submit
          </Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
