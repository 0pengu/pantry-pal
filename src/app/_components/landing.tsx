"use client";

import { Button } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Image
          alt="PantryPal Logo"
          src={"/logo.png"}
          width={200}
          height={200}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="text-center text-xl md:text-6xl font-bold p-2"
      >
        Hi, I{"'"}m PantryPal, your personal pantry assistant!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="py-4"
      >
        <Link href={"/dashboard"}>
          <Button color="success" size="large" variant="contained">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </>
  );
}
