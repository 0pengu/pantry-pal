"use client";

import AddPantryItem from "@/app/(main)/dashboard/_components/add-pantry-item/add-pantry-item";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { formatFutureTime } from "@/app/(main)/dashboard/_utils/formatTime";
import { useAuth } from "@/context/AuthContext";
import db from "@/utils/db";
import { Add, Check, Delete, Edit, Error, X } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useFilteredPantryItemsState,
  useRefreshState,
} from "@/app/(main)/dashboard/store";
import DeletePantryItem from "@/app/(main)/dashboard/_components/delete-pantry-item/delete-pantry-item";
import EditPantryItem from "@/app/(main)/dashboard/_components/edit-pantry-item/edit-pantry-item";
import Search from "@/app/(main)/dashboard/_components/search";
import { AnimatePresence, motion } from "framer-motion";
import PantryItems from "@/app/(main)/dashboard/_components/pantry-items";

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
  const { user } = useAuth();

  if (!user) {
    redirect("/login");
  }

  return <PantryItems user={user} />;
}
