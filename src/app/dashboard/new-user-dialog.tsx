import { userIdSchema } from "@/app/dashboard/_components/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  DialogActions,
  Typography,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewUser } from "@/app/dashboard/actions";

export default function NewUserDialog() {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const form = useForm<z.infer<typeof userIdSchema>>({
    resolver: zodResolver(userIdSchema),
    defaultValues: {
      id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof userIdSchema>) {
    console.log(data);
  }

  async function createNewUser() {
    const res = await addNewUser();
    if (res.success && res.id) {
      localStorage.setItem("user", res.id);
      handleClose();
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        PaperProps={{
          component: "form",
          onSubmit: form.handleSubmit(onSubmit),
        }}
      >
        <DialogTitle>First Time User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can either create a new User ID or import an existing one from
            another device.
          </DialogContentText>
          <div className="w-full h-[1px] bg-gray-300 my-2" />

          <TextField
            autoFocus
            margin="dense"
            fullWidth
            {...form.register("id")}
          />
          {form.formState.errors.id && (
            <Typography color="error">
              {form.formState.errors.id.message}
            </Typography>
          )}
          <div className="w-full h-[1px] text-center py-2">or</div>
          <Button
            fullWidth
            sx={{ marginY: 3 }}
            onClick={() => {
              createNewUser();
            }}
          >
            Create New User ID
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled>
            Cancel
          </Button>
          <Button type="submit">Submit User ID</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
