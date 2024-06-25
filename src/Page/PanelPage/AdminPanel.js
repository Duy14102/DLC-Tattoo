import { jwtDecode } from "jwt-decode"
import Cookies from "universal-cookie"
import NotFound404 from "../../Component/NotFound404"
import AdminSideBar from "../../Component/AdminPanelComponent/AdminSideBar"
import AdminMainBar from "../../Component/AdminPanelComponent/AdminMainBar"
import { useEffect, useState } from "react"
import axios from "axios"

function AdminPanel() {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <AdminSideBar accounts={accounts} token={decode} getAccounts={getAccounts} useEffect={useEffect} axios={axios} />

            <AdminMainBar useState={useState} useEffect={useEffect} accounts={accounts} getAccounts={getAccounts} token={decode} />
        </div>
    )
}
export default AdminPanel