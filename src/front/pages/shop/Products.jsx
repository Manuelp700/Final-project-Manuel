import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const Products = () => {
  const [items,setItems]=useState([])
  const backend = import.meta.env.VITE_BACKEND_URL
  useEffect(()=>{ fetch(`${backend}/api/products`).then(r=>r.json()).then(setItems) },[])
  return <div className="container">
    <h2>Productos</h2>
    <div className="row">
      {items.map(p=> <div className="col-3 mb-3" key={p.id}>
        <div className="card h-100">
          {p.image_url && <img src={p.image_url} className="card-img-top" />}
          <div className="card-body">
            <h6>{p.name}</h6>
            <p className="small">{p.price} €</p>
            <Link className="btn btn-sm btn-outline-primary" to={`/products/${p.id}`}>Ver</Link>
          </div>
        </div>
      </div>)}
    </div>
  </div>
}