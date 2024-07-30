import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
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
          <Link href={"/dashboard"}>
            <Button color="success" size="medium" variant="contained">
              Get Started
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
