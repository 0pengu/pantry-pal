import {
  uploadImageWithAi,
  uploadImage,
} from "@/app/(main)/pantry/_components/add-pantry-item/actions";
import { useCustomDropzone } from "@/app/(main)/pantry/_components/custom-dropzone";
import { massUploadImagesWithAi } from "@/app/(main)/pantry/_components/mass-add-pantry-item/actions";
import { useGlobalDisableStore } from "@/app/(main)/store";
import { Add, Check, Close, Error, X } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { readStreamableValue } from "ai/rsc";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { CheckmarkIcon, ErrorIcon } from "react-hot-toast";

export default function MassAddPantryItem({
  handleClose: handleCloseParent,
}: {
  handleClose: () => void;
}) {
  const router = useRouter();

  const [images, setImages] = useState<string[]>([]);
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
    setImages([]);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    setDisabled(true);
    try {
      const newImages: string[] = [];
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await uploadImage(formData);

        const blob = await response;

        newImages.push(blob.url);
      });

      toast.promise(
        Promise.all(uploadPromises).then(() => {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }),
        {
          loading: "Uploading images to the cloud...",
          success:
            "Images uploaded successfully. Submit to use AI to identify items.",
          error: "Error uploading images",
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const onSubmit = async () => {
    setDisabled(true);
    try {
      const response = massUploadImagesWithAi(images);
      toast.promise(response, {
        loading:
          "Generating pantry items from images, this may take a while...",
        success:
          "Generated items. Please note some items may have failed to generate. Check your pantry for the results.",
        error: "Error uploading images",
      });
      const { success } = await response;
      setDisabled(false);
      if (success) {
        handleClose();
        router.refresh();
      }

      handleCloseParent();
    } catch (error) {
      console.error(error);
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
        color="info"
        disabled={disabled}
      >
        Mass Upload
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: HTMLFormElement) => {
            event.preventDefault();
            onSubmit();
          },
        }}
      >
        <DialogTitle>Add Images to Pantry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please upload up to 5 images of pantry items.
          </DialogContentText>
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
            <p className="text-xs">
              Images only. Max 4 MB each. Up to 5 files.
            </p>
          </div>
          {images.length > 0 && (
            <div className="space-y-2 mt-4">
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative border border-gray-400 p-4 rounded-md"
                >
                  <Image
                    src={imageUrl}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full rounded-md"
                    width={200}
                    height={200}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    className="absolute top-2 right-2 left-[1px]"
                    disabled={disabled}
                  >
                    <Close />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="github" disabled={disabled}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled || images.length === 0}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
