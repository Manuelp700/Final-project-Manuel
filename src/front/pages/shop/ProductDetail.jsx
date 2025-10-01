import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Stack, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { getProductImage } from "../../utils/productImage";

export const ProductDetail = () => {
  const { pid } = useParams();
  const [p, setP] = useState(null);
  const backend = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => { fetch(`${backend}/api/products/${pid}`).then(r => r.json()).then(setP); }, [pid, backend]);

  const add = async () => {
    const r = await fetch(`${backend}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id: p.id, quantity: 1 })
    });
    const data = await r.json();
    if (!r.ok) alert(data.msg || "Error"); else alert("Añadido");
  };

  if (!p) return <div className="container">Cargando...</div>;

  const category = /billie/i.test(p.name) ? "billie" : /ariana/i.test(p.name) ? "ariana" : "gaga";
  const image_url = getProductImage(p.name);

  return (
    <Box className="container" sx={{ pt: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper sx={{ p: 4 }}>
          <Box
            sx={{
              display: "grid",
              gap: 4,
              gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {image_url && <img src={image_url} style={{ width: "100%", borderRadius: 8 }} />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h4" fontWeight={600}>{p.name}</Typography>
                  <Chip size="small" label={category} sx={{ backgroundColor: theme => theme.palette[category]?.main, color: "#000", textTransform: "capitalize" }} />
                </Stack>
                <Typography variant="body1">{p.description}</Typography>
                <Typography variant="h5" color="primary">{p.price} €</Typography>
                <Button variant="contained" size="large" disabled={!token} onClick={add}>Añadir al carrito</Button>
                {!token && <Typography variant="caption" color="error">Inicia sesión para comprar.</Typography>}
              </Stack>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};