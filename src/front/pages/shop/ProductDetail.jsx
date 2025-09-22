import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Grid, Typography, Button, Paper, Stack, Chip } from "@mui/material";

export const ProductDetail = () => {
  const { pid } = useParams();
  const [p, setP] = useState(null);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

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

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            {p.image_url && <img src={p.image_url} style={{ width: "100%", borderRadius: 8 }} />}
          </Grid>
            <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4" fontWeight={600}>{p.name}</Typography>
                <Chip size="small" label={category} sx={{ backgroundColor: theme => theme.palette[category]?.main, color: "#000", textTransform: "capitalize" }}/>
              </Stack>
              <Typography variant="body1">{p.description}</Typography>
              <Typography variant="h5" color="primary">{p.price} €</Typography>
              <Button variant="contained" size="large" disabled={!token} onClick={add}>Añadir al carrito</Button>
              {!token && <Typography variant="caption" color="error">Inicia sesión para comprar.</Typography>}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};