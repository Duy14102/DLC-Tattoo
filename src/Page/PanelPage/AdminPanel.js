import { jwtDecode } from "jwt-decode"
import Cookies from "universal-cookie"
import NotFound404 from "../../Component/NotFound404"
import AdminSideBar from "../../Component/AdminPanelComponent/AdminSideBar"
import AdminMainBar from "../../Component/AdminPanelComponent/AdminMainBar"
import { useEffect, useState } from "react"

function AdminPanel() {
    var decode = null
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    if (token) {
        decode = jwtDecode(token)
    }
    useEffect(() => {
        if (decode && decode.userRole === 2) {
            const collapseBtn = document.getElementById("collapseBtn");
            const container = document.querySelector(".mainAdminSideBar");
            collapseBtn.addEventListener("click", () => {
                const container2 = document.querySelector(".mainAdminSideBarCollapse");
                if (container2) {
                    container.classList.remove("mainAdminSideBarCollapse");
                } else {
                    container.classList.add("mainAdminSideBarCollapse");
                }
            });
        }
    }, [decode])
    if (!token) {
        return NotFound404()
    } else {
        if (decode.userRole !== 2) {
            return NotFound404()
        }
    }
    return (
        <div style={{ display: "flex", background: "#101010", width: "100%", minHeight: "inherit" }}>
            <AdminSideBar />

            <AdminMainBar useState={useState} token={jwtDecode(token)} useEffect={useEffect} />
        </div>
    )
}
export default AdminPanel