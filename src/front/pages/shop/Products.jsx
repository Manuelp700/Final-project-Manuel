import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea, Chip, Box } from "@mui/material";

const categoryColor = {
  billie: "billie",
  ariana: "ariana",
  gaga: "gaga"
};

export const Products = () => {
  const [items, setItems] = useState([]);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const { search } = useLocation();

  useEffect(() => { fetch(`${backend}/api/products`).then(r => r.json()).then(setItems); }, [backend]);

  const params = new URLSearchParams(search);
  const q = (params.get("search") || "").toLowerCase();
  const cat = params.get("cat");

  // (Temporal) Simulación de categoría según nombre:
  const enhanced = useMemo(() => items.map(p => {
    const name = p.name.toLowerCase();
    let category = "gaga";
    if (name.includes("billie")) category = "billie";
    else if (name.includes("ariana")) category = "ariana";
    return { ...p, category };
  }), [items]);

  const filtered = enhanced.filter(p =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!cat || p.category === cat)
  );

  return (
    <Box className="container" sx={{ py: 3 }}>
      <Typography variant="h4" mb={2}>Productos</Typography>
      <Grid container spacing={3}>
        {filtered.map(p =>
          <Grid item key={p.id} xs={12} sm={6} md={3}>
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
          </Grid>
        )}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1">Sin resultados.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};