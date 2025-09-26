import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Products } from "./pages/shop/Products";
import { ProductDetail } from "./pages/shop/ProductDetail";
import { Cart } from "./pages/shop/Cart";
import { Profile } from "./pages/auth/Profile";
import { AuthPage } from "./pages/auth/AuthPage";
import { RequireAuth } from "./components/RequireAuth";
import { Checkout } from "./pages/shop/Checkout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Products />} />
        <Route path="single/:theId" element={<Single />} />
        <Route path="demo" element={<Demo />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:pid" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);