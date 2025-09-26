import { Outlet, useLocation } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
    const { pathname } = useLocation();
    const onAuth = pathname.startsWith("/auth");
    return (
        <ScrollToTop>
            {!onAuth && <Navbar />}
            <Outlet />
            {!onAuth && <Footer />}
        </ScrollToTop>
    )
}