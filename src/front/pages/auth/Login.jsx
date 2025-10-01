import { useMemo, useState } from "react"
import { motion } from "framer-motion"

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

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2>Login</h2>
                <form onSubmit={submit} noValidate>
                    <motion.input
                        className={`form-control mb-2 ${errors.email ? 'is-invalid' : form.email ? 'is-valid' : ''}`}
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    {errors.email && <div className="text-danger small">{errors.email}</div>}
                    <motion.input
                        className={`form-control mb-2 ${errors.password ? 'is-invalid' : form.password ? 'is-valid' : ''}`}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    {errors.password && <div className="text-danger small">{errors.password}</div>}
                    <motion.button
                        className="btn btn-primary w-100"
                        disabled={!canSubmit || submitting}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.03 }}
                    >
                        {submitting ? 'Enviando...' : 'Entrar'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}