import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Box, InputBase, Menu, MenuItem, Button, Stack, Badge } from "@mui/material";
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
            <Badge color="secondary" badgeContent={0}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {token ? (
            <>
              <IconButton color="inherit" component={RouterLink} to="/profile">
                <PersonIcon />
              </IconButton>
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton color="inherit" component={RouterLink} to="/login">
                <LoginIcon />
              </IconButton>
              <IconButton color="inherit" component={RouterLink} to="/register">
                <AddCircleIcon />
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