import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Products } from "./pages/shop/Products";
import { ProductDetail } from "./pages/shop/ProductDetail";
import { Cart } from "./pages/shop/Cart";
import { Profile } from "./pages/auth/Profile";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:pid" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  )
);