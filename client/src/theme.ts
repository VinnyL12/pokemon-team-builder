import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8b3ce0",
      light: "#c084fc",
      dark: "#5b21b6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f472b6",
    },
    background: {
      default: "#faf8ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#2a1f3d",
      secondary: "#6b6375",
    },
    error: {
      main: "#e0384a",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
