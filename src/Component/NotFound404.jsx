import { NavLink } from "react-router-dom"

function NotFound404() {
    return (
        <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
            <div style={{ textAlign: "center", fontFamily: "Oswald, sans serif" }}>
                <h1 style={{ fontSize: 150, margin: 0, fontWeight: "bold", lineHeight: "150px" }}>404</h1>
                <h2 style={{ marginTop: 20, fontSize: 30 }}>Không tồn tại</h2>
                <p>Trang bạn đang muốn truy cập không tồn tại! <NavLink style={{ fontWeight: "bold" }} reloadDocument to={"/"}>Về trang chủ</NavLink></p>
            </div>
        </div>
    )
}
export default NotFound404