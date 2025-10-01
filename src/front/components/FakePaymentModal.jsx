import { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function FakePaymentModal({ open, onClose, amount }) {
    const [form, setForm] = useState({
        name: "",
        card: "",
        exp: "",
        cvv: ""
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1800);
        }, 1200);
    };

    if (!open) return null;

    return (
        <Box sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.25)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
            >
                <Paper sx={{ p: 4, minWidth: 340, borderRadius: 4 }}>
                    {success ? (
                        <Stack alignItems="center" spacing={2}>
                            <Typography variant="h5" color="success.main">¡Pago realizado!</Typography>
                            <motion.div
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                style={{ fontSize: 48 }}
                            >✅</motion.div>
                        </Stack>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Typography variant="h6" mb={2}>Simulación de pago</Typography>
                            <Stack spacing={2}>
                                <TextField label="Nombre en la tarjeta" name="name" value={form.name} onChange={handleChange} required fullWidth />
                                <TextField label="Número de tarjeta" name="card" value={form.card} onChange={handleChange} required fullWidth inputProps={{ maxLength: 16 }} />
                                <Stack direction="row" spacing={2}>
                                    <TextField label="Exp." name="exp" value={form.exp} onChange={handleChange} required sx={{ width: 120 }} placeholder="MM/AA" />
                                    <TextField label="CVV" name="cvv" value={form.cvv} onChange={handleChange} required sx={{ width: 80 }} inputProps={{ maxLength: 4 }} />
                                </Stack>
                                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                    {loading ? "Procesando..." : `Pagar ${amount} €`}
                                </Button>
                                <Button variant="text" color="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                            </Stack>
                        </form>
                    )}
                </Paper>
            </motion.div>
        </Box>
    );
}
