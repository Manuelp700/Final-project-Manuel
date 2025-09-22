import { useEffect, useState } from "react";
import { Paper, Typography, IconButton, Stack, TextField, Divider, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const Cart = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState(null);

  const load = () => {
    if (!token) return;
    fetch(`${backend}/api/cart`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setCart);
  };
  useEffect(load, [token]);

  const update = (product_id, quantity) => {
    fetch(`${backend}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id, quantity })
    }).then(r => r.json()).then(setCart);
  };
  const removeItem = (product_id) => {
    fetch(`${backend}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id })
    }).then(r => r.json()).then(setCart);
  };
  const checkout = async () => {
    const r = await fetch(`${backend}/api/checkout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    const data = await r.json();
    if (r.ok && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert(data.msg || JSON.stringify(data));
      load();
    }
  };

  if (!token) return <div className="container">Inicia sesión.</div>;
  if (!cart) return <div className="container">Cargando...</div>;

  const total = cart.items.reduce((a, i) => a + i.product.price * i.quantity, 0);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <Typography variant="h4" mb={2}>Carrito</Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          {cart.items.length === 0 && <Typography>Vacío</Typography>}
          {cart.items.map(i =>
            <Stack key={i.id} direction="row" spacing={2} alignItems="center">
              <Typography sx={{ flex: 1 }}>{i.product.name}</Typography>
              <Typography width={90}>{i.product.price} €</Typography>
              <TextField
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                value={i.quantity}
                onChange={e => update(i.product.id, parseInt(e.target.value) || 1)}
                sx={{ width: 90 }}
              />
              <IconButton color="error" onClick={() => removeItem(i.product.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
          <Divider />
          <Typography variant="h5">Total: {total.toFixed(2)} €</Typography>
          {cart.items.length > 0 && <Button variant="contained" color="secondary" onClick={checkout}>Checkout</Button>}
        </Stack>
      </Paper>
    </div>
  );
};