import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);

// Utilidad: activa una clase temporal en <html> para animar el cambio
const enableThemeTransition = (ms = 300) => {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), ms);
};

const paletteBase = {
  billie: { main: "#9dcc00" },
  ariana: { main: "#c8a2ff" },
  gaga: { main: "#ff2fa8" }
};

export const AppThemeProvider = ({ children }) => {
  // Lee del storage o usa preferencia del SO la primera vez
  const initialMode = (() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme-mode") : null;
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  })();

  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    // actualiza <meta name="color-scheme"> implícito con CSS y persiste
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleMode = () => {
    enableThemeTransition(300);
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: "#ff9800" },
      secondary: { main: "#673ab7" },
      success: { main: "#43a047" },
      billie: paletteBase.billie,
      ariana: paletteBase.ariana,
      gaga: paletteBase.gaga
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: `'Roboto', system-ui, -apple-system, 'Segoe UI', 'Helvetica', 'Arial'`
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // informa al navegador para formularios/scrollbars
          html: { colorScheme: mode },
          // Transición solo cuando <html> tiene .theme-transition (al hacer toggle)
          ":root.theme-transition body, :root.theme-transition .MuiPaper-root, :root.theme-transition .MuiAppBar-root, :root.theme-transition .MuiCard-root, :root.theme-transition .MuiToolbar-root, :root.theme-transition .MuiDrawer-paper, :root.theme-transition .MuiList-root, :root.theme-transition .MuiTypography-root, :root.theme-transition .MuiButtonBase-root": {
            transition: "background-color 300ms ease, color 300ms ease, border-color 300ms ease, fill 300ms ease, stroke 300ms ease"
          },
          "@media (prefers-reduced-motion: reduce)": {
            ":root.theme-transition *": { transition: "none !important" }
          }
        }
      }
    }
  }), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeModeContext.Provider>
  );
};