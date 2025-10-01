import { useMemo, useState } from "react"

export const Register = () => {
    const [form, setForm] = useState({ email: "", password: "", confirm: "" })
    const [errors, setErrors] = useState({})
    const backend = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL

    const validate = () => {
        const e = {}
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido"
        if (!form.password || form.password.length < 6) e.password = "Mínimo 6 caracteres"
        if (form.confirm !== form.password) e.confirm = "Las contraseñas no coinciden"
        setErrors(e); return Object.keys(e).length === 0
    }

    const canSubmit = useMemo(() => {
        return form.email && form.password && form.confirm && Object.keys(errors).length === 0
    }, [form, errors])

    const [submitting, setSubmitting] = useState(false)

    const submit = async e => {
        e.preventDefault()
        if (!validate() || submitting) return
        setSubmitting(true)
        const r = await fetch(`${backend}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, password: form.password })
        })
        const data = await r.json()
        if (r.ok) alert("Registrado")
        else alert(data.msg || "Error")
        setSubmitting(false)
    }
    return <div className="container">
        <h2>Registro</h2>
        <form onSubmit={submit} noValidate>
            <input className={`form-control mb-2 ${errors.email ? 'is-invalid' : form.email ? 'is-valid' : ''}`} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
            <input className={`form-control mb-2 ${errors.password ? 'is-invalid' : form.password ? 'is-valid' : ''}`} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
            <input className={`form-control mb-2 ${errors.confirm ? 'is-invalid' : form.confirm ? 'is-valid' : ''}`} type="password" placeholder="Confirmar password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            {errors.confirm && <div className="text-danger small">{errors.confirm}</div>}
            <button className="btn btn-success w-100" disabled={!canSubmit || submitting}>{submitting ? 'Enviando...' : 'Crear cuenta'}</button>
        </form>
    </div>
}