import { useEffect, useState } from "react"

export const Cart = () => {
    const backend = import.meta.env.VITE_BACKEND_URL
    const token = localStorage.getItem("token")
    const [cart, setCart] = useState(null)
    const load = () => {
        if (!token) return
        fetch(`${backend}/api/cart`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setCart)
    }
    useEffect(load, [token])
    const update = (product_id, quantity) => {
        fetch(`${backend}/api/cart/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ product_id, quantity })
        }).then(r => r.json()).then(setCart)
    }
    const removeItem = (product_id) => {
        fetch(`${backend}/api/cart/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ product_id })
        }).then(r => r.json()).then(setCart)
    }
    const checkout = async () => {
        const r = await fetch(`${backend}/api/checkout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
        const data = await r.json()
        if (r.ok && data.checkout_url) { window.location.href = data.checkout_url; return; }
        alert(data.msg || JSON.stringify(data))
    }
    if (!token) return <div className="container">Inicia sesión.</div>
    if (!cart) return <div className="container">Cargando...</div>
    const total = cart.items.reduce((a, i) => a + i.product.price * i.quantity, 0)
    return <div className="container">
        <h2>Carrito</h2>
        {cart.items.length === 0 && <p>Vacío</p>}
        {cart.items.map(i => <div key={i.id} className="d-flex gap-3 border-bottom py-2">
            <span style={{ width: "180px" }}>{i.product.name}</span>
            <span>{i.product.price} €</span>
            <input style={{ width: "70px" }} type="number" min={1} value={i.quantity} onChange={e => update(i.product.id, parseInt(e.target.value) || 1)} />
            <button className="btn btn-sm btn-danger" onClick={() => removeItem(i.product.id)}>X</button>
        </div>)}
        <h4 className="mt-3">Total: {total.toFixed(2)} €</h4>
        {cart.items.length > 0 && <button className="btn btn-success mt-2" onClick={checkout}>Checkout</button>}
    </div>
}