import Landing from "@/app/_components/landing";
import { Button } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <Landing />
    </main>
  );
}
