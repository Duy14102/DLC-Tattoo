import { NavLink } from "react-router-dom"
import Logo from "../../Assets/Image/DLC-logo.png"
import "./Header.css"
import { useEffect } from "react"

function Header() {
    useEffect(() => {
        const header = document.querySelector(".mainHeader");
        window.addEventListener('scroll', e => {
            header.style.background = window.scrollY > 88 ? '#101010' : null;
            header.style.position = window.scrollY > 88 ? 'fixed' : "absolute";
        });
    }, [])
    return (
        <div className="mainHeader">
            <div className="insideMainHeader">
                <NavLink className="logoBrand" reloadDocument to={"/"}>
                    <img src={Logo} alt="" />
                    <p>Tattoo Studio</p>
                </NavLink>
                <div className="barsNextToBrand">
                    <NavLink reloadDocument to={"/"}>Trang chủ</NavLink>
                    <NavLink reloadDocument to={"/TattooSamplePage"}>Hình Mẫu</NavLink>
                    <NavLink reloadDocument to={"/GalleryPage"}>Hậu trường</NavLink>
                    <NavLink reloadDocument to={"/BookingPage"}>Booking</NavLink>
                    <NavLink reloadDocument to={"/BlogPage"}>Blog</NavLink>
                    <NavLink reloadDocument to={"/LoginUser"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
export default Header