import { useMemo, useState } from "react"

export const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const [errors, setErrors] = useState({})
    const backend = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL

    const validate = () => {
        const e = {}
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido"
        if (!form.password || form.password.length < 6) e.password = "Mínimo 6 caracteres"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const canSubmit = useMemo(() => {
        return form.email && form.password && Object.keys(errors).length === 0
    }, [form, errors])

    const [submitting, setSubmitting] = useState(false)

    const submit = async ev => {
        ev.preventDefault()
        if (!validate() || submitting) return
        setSubmitting(true)
        const r = await fetch(`${backend}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
        const data = await r.json()
        if (r.ok) {
            localStorage.setItem("token", data.access_token)
            alert("Login ok")
        } else alert(data.msg || "Error")
        setSubmitting(false)
    }

    return <div className="container">
        <h2>Login</h2>
        <form onSubmit={submit} noValidate>
            <input className={`form-control mb-2 ${errors.email ? 'is-invalid' : form.email ? 'is-valid' : ''}`} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
            <input className={`form-control mb-2 ${errors.password ? 'is-invalid' : form.password ? 'is-valid' : ''}`} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
            <button className="btn btn-primary w-100" disabled={!canSubmit || submitting}>{submitting ? 'Enviando...' : 'Entrar'}</button>
        </form>
    </div>
}