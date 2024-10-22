import { NavLink } from "react-router-dom"
import Logo from "../../Assets/Image/DLC-logo.png"
import "./Header.css"
import { useEffect, useReducer } from "react"
import Cookies from "universal-cookie"
import GetAccounts from "./GetAccounts"
import { jwtDecode } from "jwt-decode"
import { LazyLoadImage } from "react-lazy-load-image-component"

function Header() {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        openBars: false
    })
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    useEffect(() => {
        const header = document.querySelector(".mainHeader");
        window.addEventListener('scroll', e => {
            header.style.background = window.scrollY > 88 ? '#101010' : null;
            header.style.position = window.scrollY > 88 ? 'fixed' : "absolute";
        });
    }, [])

    const logoutUser = () => {
        cookies.remove("TOKEN", { path: '/' });
        localStorage.removeItem("tabs")
        window.location.href = "/"
    }
    return (
        <div className="mainHeader">
            <div className="insideMainHeader">
                <NavLink className="logoBrand" reloadDocument to={"/"}>
                    <LazyLoadImage src={Logo} alt="Image" />
                    <p>Tattoo Studio</p>
                </NavLink>
                <div className="responsive responsiveBars">
                    <button onClick={() => setState(state.openBars ? { openBars: false } : { openBars: true })} className="responsiveBarsChild" style={{ width: "100%", height: "100%" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d={state.openBars ? "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" : "M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"} /></svg>
                    </button>
                </div>
                <div className="barsNextToBrand">
                    <NavLink className={"cateInHeader"} reloadDocument to={"/"}>Trang chủ</NavLink>
                    <NavLink className={"cateInHeader"} reloadDocument to={"/TattooSamplePage/Newtoold/All/All"}>Hình Mẫu</NavLink>
                    <NavLink className={"cateInHeader"} reloadDocument to={"/GalleryPage"}>Hậu trường</NavLink>
                    <NavLink className={"cateInHeader"} reloadDocument to={"/BookingPage"}>Booking</NavLink>
                    <NavLink className={"cateInHeader"} reloadDocument to={"/BlogPage"}>Blog</NavLink>
                    <NavLink className={"cateInHeader"} reloadDocument to={"/FavouritePage/Newtoold/All/All"}>Yêu thích</NavLink>
                    {token ? (
                        <GetAccounts token={token} useEffect={useEffect} NavLink={NavLink} cookies={cookies} jwtDecode={jwtDecode} logoutUser={logoutUser} />
                    ) : (
                        <NavLink title="Tài khoản" reloadDocument to={"/LoginUserPage"}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                        </NavLink>
                    )}
                </div>
            </div>
            {state.openBars ? (
                <div className="activeBarsOnBars">
                    <NavLink reloadDocument to={"/"}>Trang chủ</NavLink>
                    <NavLink reloadDocument to={"/TattooSamplePage/Newtoold/All/All"}>Hình Mẫu</NavLink>
                    <NavLink reloadDocument to={"/GalleryPage"}>Hậu trường</NavLink>
                    <NavLink reloadDocument to={"/BookingPage"}>Booking</NavLink>
                    <NavLink reloadDocument to={"/BlogPage"}>Blog</NavLink>
                    <NavLink reloadDocument to={"/FavouritePage/Newtoold/All/All"}>Yêu thích</NavLink>
                    {token ? (
                        <>
                            <NavLink reloadDocument to={jwtDecode(token).userRole === 1 ? "/UserPanel" : "/AdminPanel"}>{jwtDecode(token).userRole === 1 ? "Tài khoản" : "Quản trị"}</NavLink>
                            <button onClick={() => logoutUser()}>Đăng xuất</button>
                        </>
                    ) : (
                        <NavLink reloadDocument to={"/LoginUserPage"}>Đăng nhập</NavLink>
                    )}
                </div>
            ) : null}
        </div>
    )
}
export default Header