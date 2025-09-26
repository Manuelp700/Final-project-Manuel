import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Paper, Typography, TextField, Stack, Button, Divider } from "@mui/material";

export const Checkout = () => {
  const [params] = useSearchParams();
  const sid = params.get("sid") || "";
  const total = parseFloat(params.get("total") || "0").toFixed(2);
  const backend = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const navigate = useNavigate();

  const [card, setCard] = useState({ name: "", number: "", exp: "", cvc: "" });
  const disabled = !card.name || card.number.replace(/\s+/g, "").length < 12 || !/^\d{2}\/\d{2}$/.test(card.exp) || card.cvc.length < 3;

  const pay = async (e) => {
    e.preventDefault();
    const r = await fetch(`${backend}/api/checkout/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sid })
    });
    const data = await r.json();
    if (r.ok) {
      navigate("/cart?status=success");
    } else {
      alert(data.msg || "Error al confirmar pago");
    }
  };

  if (!token) return <div className="container">Inicia sesión.</div>;

  return (
    <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper elevation={6} sx={{ p: 4, width: { xs: "100%", sm: 520 } }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>Pasarela de pago</Typography>
        <Typography textAlign="center" color="text.secondary">Total a pagar</Typography>
        <Typography variant="h4" textAlign="center" mb={2}>{total} €</Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={pay}>
          <Stack spacing={2}>
            <TextField label="Titular" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} required />
            <TextField label="Número de tarjeta" placeholder="4242 4242 4242 4242" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} required />
            <Stack direction="row" spacing={2}>
              <TextField label="Exp (MM/YY)" placeholder="12/30" value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value })} required fullWidth />
              <TextField label="CVC" placeholder="123" value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value })} required fullWidth />
            </Stack>
            <Button variant="contained" size="large" type="submit" disabled={disabled}>Pagar ahora</Button>
            <Button variant="text" onClick={() => navigate("/cart")}>Cancelar</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};