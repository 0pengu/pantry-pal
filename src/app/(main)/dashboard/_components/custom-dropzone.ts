import { useGlobalDisableStore } from "@/app/(main)/store";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export const useCustomDropzone = (onDrop: (acceptedFiles: File[]) => void) => {
  const disabled = useGlobalDisableStore((state) => state.disabled);
  const setDisabled = useGlobalDisableStore((state) => state.setDisabled);
  return useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      // "application/pdf": [".pdf"],
      // "application/msword": [".doc", ".docx"],
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      //   [".docx"],
      // "application/vnd.ms-excel": [".xls", ".xlsx"],
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      //   ".xlsx",
      // ],
      // "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
      // "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      //   [".pptx"],
    },
    onDropRejected(fileRejections, event) {
      setDisabled(false);
      fileRejections.forEach((fileRejection) => {
        fileRejection.errors.forEach((error) => {
          toast.error(error.message);
        });
      });
    },
    validator: (file) => {
      if (disabled) {
        return {
          code: "wait-for-action",
          message: `Please wait for the current action to complete.`,
        };
      }
      // TODO - file size validation
      // const checkFileSize = (file: File) => {
      //   const maxSize = 2 * 1000 * 1000; // 2MB
      //   const fileSize = file.size;
      //   return fileSize <= maxSize;
      // };

      // const checkAllFileSizes = () => {
      //   const maxSize = 10 * 1000 * 1000;
      //   const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      //   return totalSize <= maxSize;
      // };

      // const isValidFileSize = files.every(checkFileSize);
      // const isValidTotalSize = checkAllFileSizes();

      // if (!isValidFileSize) {
      //   toast.error("A file size exceeds the limit of 2MB");
      //   return {
      //     code: "file-too-large",
      //     message: `A file size exceeds the limit of 2MB`,
      //   };
      // }

      // if (!isValidTotalSize) {
      //   toast.error("Total file size exceeds the limit of 8MB");
      //   return {
      //     code: "total-file-size-too-large",
      //     message: `Total file size exceeds the limit of 8MB`,
      //   };
      // }

      if (file.size > 5 * 1000 * 1000) {
        return {
          code: "file-too-large",
          message: `File size exceeds the limit of 5MB`,
        };
      }

      return null;
    },
  });
};
