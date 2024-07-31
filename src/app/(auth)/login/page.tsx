"use client";

import { useAuth } from "@/context/AuthContext";
import { signInWithGitHub } from "@/utils/auth";
import { GitHub } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { user } = useAuth();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h3">Log in to PantryPal</Typography>
      <div className="flex flex-col items-center justify-center shadow-2xl h-16 w-96 rounded-md border border-gray-400 mt-4 bg-gray-200">
        <Button
          variant="contained"
          color="github"
          className="rounded-full"
          onClick={signInWithGitHub}
        >
          <GitHub className="mr-2 mb-1" />
          Sign in with Github
        </Button>
      </div>
      <Link href={"/"}>
        <Typography variant="body2" className="pt-4 underline">
          Go back to the home page
        </Typography>
      </Link>
    </main>
  );
}
