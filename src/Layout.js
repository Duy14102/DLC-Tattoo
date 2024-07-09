import { Outlet } from "react-router-dom";
import Header from "./Component/Header/Header";
import Footer from "./Component/Footer/Footer";
import SmokeLoader from "./Component/SmokeLoader";

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