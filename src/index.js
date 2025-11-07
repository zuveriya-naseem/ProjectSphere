import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProjectProvider } from "./context/ProjectContext";
import { ThemeProvider, createTheme, CssBaseline, Button, Box } from "@mui/material";
import "./styles/global.css";

function Root() {
  // Load saved mode or default light
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light");

  useEffect(() => {
    localStorage.setItem("mode", mode);
    document.documentElement.setAttribute("data-mode", mode); // for CSS gradients
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#4B8DF8" },
          secondary: { main: "#E91E63" },
          background: { default: "transparent", paper: mode === "light" ? "#ffffff" : "#0b1222" },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontWeightBold: 700,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProjectProvider>
        <App toggleMode={() => setMode(mode === "light" ? "dark" : "light")} mode={mode} />

      </ProjectProvider>
    </ThemeProvider>

  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
