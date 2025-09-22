import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext();

export const useThemeMode = () => useContext(ThemeModeContext);

const paletteBase = {
  billie: { main: "#9dcc00" },
  ariana: { main: "#c8a2ff" },
  gaga: { main: "#ff2fa8" }
};

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode(m => (m === "light" ? "dark" : "light"));

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
      MuiCard: { styleOverrides: { root: { transition: "box-shadow .25s" } } },
      MuiButton: { defaultProps: { disableElevation: true } }
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