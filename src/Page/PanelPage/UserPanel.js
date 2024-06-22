import { jwtDecode } from "jwt-decode"
import Cookies from "universal-cookie"
import NotFound404 from "../../Component/NotFound404"
import UserSideBar from "../../Component/UserPanelComponent/UserSideBar"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import ToastUpdate from "../../Component/Toastify/ToastUpdate"
import UserMainBar from "../../Component/UserPanelComponent/UserMainBar"

function UserPanel() {
    var decode = null
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    if (token) {
        decode = jwtDecode(token)
    }
    const [accounts, setAccounts] = useState(null)
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
        getAccounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (!token) {
        return NotFound404()
    } else {
        if (decode.userRole !== 1) {
            return NotFound404()
        }
    }
    return (
        <div style={{ display: "flex", background: "#101010", width: "100%", padding: "120px 20%", minHeight: "inherit" }}>
            <UserSideBar accounts={accounts} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} axios={axios} decode={decode} />

            <UserMainBar accounts={accounts} decode={decode} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} axios={axios} />
        </div>
    )
}
export default UserPanel