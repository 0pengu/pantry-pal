"use client";

import NewUserDialog from "@/app/dashboard/new-user-dialog";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DashboardPage() {
  const userId = localStorage.getItem("user");

  if (!userId) {
    return <NewUserDialog />;
  }

  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold">{userId}</h1>
    </main>
  );
}
