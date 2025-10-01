import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography, CardActionArea, Chip } from "@mui/material";
import { getProductImage } from "../../utils/productImage";

const categoryColor = { billie: "billie", ariana: "ariana", gaga: "gaga" };

export const Products = () => {
  const [items, setItems] = useState([]);
  const backend = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL;
  const { search } = useLocation();

  useEffect(() => { fetch(`${backend}/api/products`).then(r => r.json()).then(setItems); }, [backend]);

  const params = new URLSearchParams(search);
  const q = (params.get("search") || "").toLowerCase();
  const cat = params.get("cat");

  const enhanced = useMemo(() => items.map(p => {
    const name = p.name.toLowerCase();
    let category = "gaga";
    if (name.includes("billie")) category = "billie";
    else if (name.includes("ariana")) category = "ariana";
    // Añadir la imagen desde product_images.json
    const image_url = getProductImage(p.name);
    return { ...p, category, image_url };
  }), [items]);

  const filtered = enhanced.filter(p =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!cat || p.category === cat)
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="products-page"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <Box className="container" sx={{ py: 3 }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Typography variant="h4" mb={2}>Productos</Typography>
          </motion.div>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)"
              }
            }}
          >
            <AnimatePresence>
              {filtered.map(p =>
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card elevation={3} sx={{ height: "100%", position: "relative" }}>
                    <CardActionArea component={Link} to={`/products/${p.id}`}>
                      {p.image_url && <CardMedia component="img" height="180" image={p.image_url} alt={p.name} />}
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>{p.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }} noWrap>{p.description}</Typography>
                        <Typography variant="h6" mt={1}>{p.price} €</Typography>
                      </CardContent>
                    </CardActionArea>
                    <Chip
                      size="small"
                      label={p.category}
                      color={categoryColor[p.category] ? "primary" : "default"}
                      sx={{ position: "absolute", top: 8, left: 8, textTransform: "capitalize", backgroundColor: theme => theme.palette[p.category]?.main }}
                    />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Typography variant="body1">Sin resultados.</Typography>
              </motion.div>
            )}
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};