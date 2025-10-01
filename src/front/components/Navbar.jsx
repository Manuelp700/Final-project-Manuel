import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Box, InputBase, Menu, MenuItem, Button, Stack, Badge } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useThemeMode } from "../theme/ThemeProvider";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 30,
  backgroundColor: theme.palette.action.hover,
  marginLeft: 0,
  width: '100%',
  display: "flex",
  alignItems: "center",
  padding: "2px 10px",
  [theme.breakpoints.up('sm')]: { width: 'auto', minWidth: 340 }
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1
}));

const categories = [
  { key: "all", label: "Todo" },
  { key: "billie", label: "Billie Eilish" },
  { key: "ariana", label: "Ariana Grande" },
  { key: "gaga", label: "Lady Gaga" }
];

// Menú flotante animado para perfil
function ProfileMenu({ logout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Box sx={{ position: "relative" }}>
      <IconButton color="inherit" onClick={() => setOpen(v => !v)}>
        <PersonIcon />
      </IconButton>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              zIndex: 100,
              minWidth: 220,
              background: "#fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              borderRadius: 16,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            <Typography variant="h6" mb={1} color="primary">Mi perfil</Typography>
            <Button variant="outlined" color="primary" onClick={() => { setOpen(false); navigate("/profile"); }} sx={{ mb: 1 }}>
              Editar perfil
            </Button>
            <Button variant="contained" color="error" onClick={() => { setOpen(false); logout(); }}>
              Cerrar sesión
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { mode, toggleMode } = useThemeMode();
  const [anchorCat, setAnchorCat] = useState(null);
  const [query, setQuery] = useState("");

  const openCat = (e) => setAnchorCat(e.currentTarget);
  const closeCat = () => setAnchorCat(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const selectCategory = (cat) => {
    closeCat();
    if (cat === "all") navigate("/products");
    else navigate(`/products?cat=${cat}`);
  };

  // Estado para el contador del carrito
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setCartCount(0);
    fetch(`${import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(cart => setCartCount(cart?.items?.length || 0))
      .catch(() => setCartCount(0));
  }, []);

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
        <IconButton color="inherit" onClick={openCat}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}>
          FanStore
        </Typography>
        <Box component="form" onSubmit={search} sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar productos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </Search>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="inherit" onClick={toggleMode} aria-label="toggle theme">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton color="inherit" component={RouterLink} to="/cart">
            <Badge
              color="secondary"
              badgeContent={
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      style={{ display: "inline-block" }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              }
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                style={{ display: "inline-block" }}
              >
                <ShoppingCartIcon />
              </motion.div>
            </Badge>
          </IconButton>
          {token ? (
            <ProfileMenu logout={logout} />
          ) : (
            <>
              <IconButton color="inherit" component={RouterLink} to="/auth" aria-label="Iniciar sesión o registrarse">
                <LoginIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </Toolbar>
      <Menu anchorEl={anchorCat} open={Boolean(anchorCat)} onClose={closeCat}>
        {categories.map(c => (
          <MenuItem key={c.key} onClick={() => selectCategory(c.key)}>{c.label}</MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};