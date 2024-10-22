import { Outlet } from "react-router-dom";
import { lazy } from "react";
const SmokeLoader = lazy(() => import("./Component/SmokeLoader"))
const Header = lazy(() => import("./Component/Header/Header"))
const Footer = lazy(() => import("./Component/Footer/Footer"))

function Layout() {
    return (
        <>
            <SmokeLoader />

            <Header />

            <Outlet />

            <Footer />
        </>
    )
}
export default Layout