import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography, CardActionArea, Chip } from "@mui/material";

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
    return { ...p, category };
  }), [items]);

  const filtered = enhanced.filter(p =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!cat || p.category === cat)
  );

  return (
    <Box className="container" sx={{ py: 3 }}>
      <Typography variant="h4" mb={2}>Productos</Typography>

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
        {filtered.map(p =>
          <Box key={p.id}>
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
          </Box>
        )}

        {filtered.length === 0 && (
          <Box>
            <Typography variant="body1">Sin resultados.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};