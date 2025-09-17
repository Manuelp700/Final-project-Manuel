import { useEffect, useState } from "react"

export const Profile = () => {
    const backend = import.meta.env.VITE_BACKEND_URL
    const token = localStorage.getItem("token")
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return
        fetch(`${backend}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => { setForm({ email: data.email, password: "" }); setLoading(false) })
    }, [token])

    const save = async (e) => {
        e.preventDefault()
        const r = await fetch(`${backend}/api/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ email: form.email, password: form.password || undefined })
        })
        const data = await r.json()
        if (r.ok) alert("Perfil actualizado"); else alert(data.msg || "Error")
    }
    const del = async () => {
        if (!confirm("¿Eliminar cuenta? Esta acción no se puede deshacer.")) return
        const r = await fetch(`${backend}/api/profile`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (r.ok) { localStorage.removeItem("token"); alert("Cuenta eliminada"); location.href = "/" }
        else { const d = await r.json(); alert(d.msg || "Error") }
    }

    if (!token) return <div className="container">Inicia sesión.</div>
    if (loading) return <div className="container">Cargando...</div>
    return <div className="container">
        <h2>Perfil</h2>
        <form onSubmit={save}>
            <label className="form-label">Email</label>
            <input className="form-control mb-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <label className="form-label">Password (opcional)</label>
            <input className="form-control mb-2" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <div className="d-flex gap-2">
                <button className="btn btn-primary">Guardar</button>
                <button className="btn btn-outline-danger" type="button" onClick={del}>Eliminar cuenta</button>
            </div>
        </form>
    </div>
}