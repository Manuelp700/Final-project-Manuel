import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export const ProductDetail = () => {
  const { pid } = useParams()
  const [p,setP]=useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL
  const token = localStorage.getItem("token")
  useEffect(()=>{ fetch(`${backend}/api/products/${pid}`).then(r=>r.json()).then(setP) },[pid])
  const add = async () => {
    const r = await fetch(`${backend}/api/cart/add`, {
      method:"POST",
      headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      body: JSON.stringify({ product_id: p.id, quantity:1 })
    })
    const data = await r.json()
    if(!r.ok) alert(data.msg || "Error"); else alert("Añadido")
  }
  if(!p) return <div className="container">Cargando...</div>
  return <div className="container">
    <h2>{p.name}</h2>
    {p.image_url && <img src={p.image_url} style={{maxWidth:"250px"}}/>}
    <p>{p.description}</p>
    <p><b>{p.price} €</b></p>
    <button className="btn btn-primary" onClick={add} disabled={!token}>Añadir al carrito</button>
    {!token && <p className="text-danger small mt-2">Inicia sesión para comprar.</p>}
  </div>
}