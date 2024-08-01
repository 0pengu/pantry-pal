"use client";

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { logout } from "@/app/(auth)/logout/actions";
import { User } from "lucia";

export default function Navbar({ user }: { user: User | null }) {
  const path = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (path === "/login" || path === "signup") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box sx={{ flexGrow: 1, display: "sticky" }}>
      <AppBar position="static">
        <Toolbar>
          <Link href={"/"}>
            <IconButton
              size="small"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
            >
              <Image
                src={"/logo.png"}
                alt="PantryPal Logo"
                width={40}
                height={40}
              />
            </IconButton>
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PantryPal{" "}
            <Link href={"https://tahmid.io"} className="hidden md:inline">
              by <span className="underline">Tahmid Ahmed</span>
            </Link>
          </Typography>
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Image
                  src={user.avatar_url || ""}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  {user.username} ({user.email})
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                  color="red"
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            // <Button
            //   color="error"
            //   size="medium"
            //   variant="contained"
            //   onClick={() => {
            //     handleLogout();
            //   }}
            // >
            //   Log Out
            // </Button>
            <Link href={"/dashboard"}>
              <Button color="success" size="medium" variant="contained">
                Get Started
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
