"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { PaletteColor, PaletteColorOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    github: PaletteColor;
  }

  interface PaletteOptions {
    github?: PaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    github: true;
  }
}

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    github: {
      main: "#333",
      contrastText: "#fff",
    },
  },
});

export default theme;
