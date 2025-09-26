import { useEffect, useRef, useState } from "react";
import { Box, Paper, Tabs, Tab, TextField, Button, Stack, Typography, Divider } from "@mui/material";

const base = import.meta.env.DEV ? "" : (import.meta.env.VITE_BACKEND_URL || "");
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [login, setLogin] = useState({ email:"", password:"" });
  const [register, setRegister] = useState({ email:"", password:"" });
  const googleDivRef = useRef(null);

  useEffect(() => {
    if (!googleClientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      /* global google */
      window.google?.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            const r = await fetch(`${base}/api/login/google`, {
              method: "POST",
              headers: { "Content-Type":"application/json" },
              body: JSON.stringify({ credential: response.credential })
            });
            const data = await r.json();
            if (r.ok) {
              localStorage.setItem("token", data.access_token);
              location.href = "/";
            } else alert(data.msg || "Error con Google");
          } catch (e) { alert("Error con Google"); }
        }
      });
      window.google?.accounts.id.renderButton(googleDivRef.current, { theme:"outline", size:"large", width: 300 });
    };
    document.body.appendChild(script);
  }, []);

  const doLogin = async (e) => {
    e.preventDefault();
    const r = await fetch(`${base}/api/login`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(login) });
    const data = await r.json();
    if (r.ok) { localStorage.setItem("token", data.access_token); location.href = "/"; }
    else alert(data.msg || "Error");
  };
  const doRegister = async (e) => {
    e.preventDefault();
    const r = await fetch(`${base}/api/register`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(register) });
    const data = await r.json();
    if (r.ok) { alert("Cuenta creada, ahora inicia sesión."); setTab(0); }
    else alert(data.msg || "Error");
  };

  return (
    <Box sx={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", p:2 }}>
      <Paper elevation={6} sx={{ p:4, width: { xs:"100%", sm: 520 } }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>Bienvenido a FanStore</Typography>
        <Tabs value={tab} onChange={(_,v)=>setTab(v)} centered sx={{ mb:2 }}>
          <Tab label="Iniciar sesión" />
          <Tab label="Registrarse" />
        </Tabs>
        {tab===0 && (
          <Box component="form" onSubmit={doLogin}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} required />
              <TextField label="Password" type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} required />
              <Button variant="contained" type="submit" size="large">Entrar</Button>
              <Divider>o</Divider>
              <div ref={googleDivRef} style={{ display:"flex", justifyContent:"center" }} />
            </Stack>
          </Box>
        )}
        {tab===1 && (
          <Box component="form" onSubmit={doRegister}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={register.email} onChange={e=>setRegister({...register,email:e.target.value})} required />
              <TextField label="Password" type="password" value={register.password} onChange={e=>setRegister({...register,password:e.target.value})} required helperText="Mínimo 6 caracteres" />
              <Button variant="contained" type="submit" size="large" color="secondary">Crear cuenta</Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};