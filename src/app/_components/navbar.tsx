"use client";

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Avatar,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/(auth)/logout/actions";
import { User } from "lucia";
import { AccountCircle } from "@mui/icons-material";

export default function Navbar({ user }: { user: User | null }) {
  const path = usePathname();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (path === "/login" || path === "/signup") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const pages = [
    { path: "/", name: "Home" },
    { path: "/pantry", name: "Pantry" },
    { path: "/recipe", name: "Recipes" },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => {
                if (page.path === "/")
                  return (
                    <Link href={page.path} key={page.name}>
                      <MenuItem key={page.path}>
                        <Image
                          src={"/logo.png"}
                          alt="PantryPal Logo"
                          width={40}
                          height={40}
                          className="flex md:hidden"
                        />
                      </MenuItem>
                    </Link>
                  );
                return (
                  <Link href={page.path} key={page.name}>
                    <MenuItem
                      key={page.name}
                      onClick={() => {
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </Link>
                );
              })}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              if (page.path === "/")
                return (
                  <Link href={page.path} key={page.name}>
                    <IconButton
                      size="small"
                      color="inherit"
                      aria-label="menu"
                      sx={{ my: 1, display: "block" }}
                      key={page.name}
                    >
                      <Image
                        src={"/logo.png"}
                        alt="PantryPal Logo"
                        width={40}
                        height={40}
                        className="hidden md:flex"
                      />
                    </IconButton>
                  </Link>
                );
              return (
                <Link href={page.path} key={page.name}>
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.name}
                  </Button>
                </Link>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user ? (
                  <Avatar alt={user.username} src={user.avatar_url || ""} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user ? (
                <>
                  <MenuItem disabled>
                    {user.username}{" "}
                    {user.email ? `(${user.email})` : "(No email)"}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      handleLogout();
                    }}
                    color="red"
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <Link href="/login">
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                </Link>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
