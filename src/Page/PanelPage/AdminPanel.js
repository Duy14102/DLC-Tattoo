import { jwtDecode } from "jwt-decode"
import Cookies from "universal-cookie"
import NotFound404 from "../../Component/NotFound404"
import AdminSideBar from "../../Component/AdminPanelComponent/AdminSideBar"
import AdminMainBar from "../../Component/AdminPanelComponent/AdminMainBar"
import { useEffect, useState } from "react"

function AdminPanel() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    useEffect(() => {
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
    }, [])
    if (!token) {
        return NotFound404()
    } else {
        const decode = jwtDecode(token)
        if (decode.userRole !== 2) {
            return NotFound404()
        }
    }
    return (
        <div style={{ display: "flex", background: "#101010", width: "100%", height: "auto" }}>
            <AdminSideBar />

            <AdminMainBar useState={useState} token={jwtDecode(token)} useEffect={useEffect} />
        </div>
    )
}
export default AdminPanel