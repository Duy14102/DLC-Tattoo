import { jwtDecode } from "jwt-decode"
import Cookies from "universal-cookie"
import { lazy, useEffect, useState } from "react"
import axios from "axios"
const NotFound404 = lazy(() => import("../../Component/NotFound404"))
const AdminSideBar = lazy(() => import("../../Component/AdminPanelComponent/AdminSideBar"))
const AdminMainBar = lazy(() => import("../../Component/AdminPanelComponent/AdminMainBar"))

function AdminPanel() {
    document.title = "DLC Tattoo | Quản trị admin"
    const [accounts, setAccounts] = useState(null)
    var decode = null
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    if (token) {
        decode = jwtDecode(token)
    }

    function getAccounts() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAccounts`,
            params: {
                id: decode.userId
            }
        }
        axios(configuration).then((res) => {
            setAccounts(res.data)
        })
    }

    useEffect(() => {
        if (decode && decode.userRole === 2) {
            const collapseBtn = document.getElementById("collapseBtn");
            const container = document.querySelector(".mainAdminSideBar");
            const callbackButton = document.querySelector(".closeAdminBarRepson")
            callbackButton.addEventListener("click", () => {
                container.classList.remove("mainAdminSideBarCollapse");
            })
            collapseBtn.addEventListener("click", () => {
                const container2 = document.querySelector(".mainAdminSideBarCollapse");
                if (container2) {
                    container.classList.remove("mainAdminSideBarCollapse");
                } else {
                    container.classList.add("mainAdminSideBarCollapse");
                }
            });
        }
        getAccounts()
    }, [])

    if (!token) {
        return NotFound404()
    } else {
        if (decode.userRole !== 2) {
            return NotFound404()
        }
    }
    return (
        <div style={{ display: "flex", background: "#101010", width: "100%", minHeight: "inherit" }}>
            <AdminSideBar accounts={accounts} token={decode} getAccounts={getAccounts} useEffect={useEffect} axios={axios} />

            <AdminMainBar useState={useState} useEffect={useEffect} accounts={accounts} getAccounts={getAccounts} token={decode} />
        </div>
    )
}
export default AdminPanel