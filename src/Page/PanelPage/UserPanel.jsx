import "../../Component/UserPanelComponent/UserPanel.css"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState, useRef, lazy } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import Cookies from "universal-cookie"
import ToastUpdate from "../../Component/Toastify/ToastUpdate"
const NotFound404 = lazy(() => import("../../Component/NotFound404"))
const UserSideBar = lazy(() => import("../../Component/UserPanelComponent/UserSideBar"))
const UserMainBar = lazy(() => import("../../Component/UserPanelComponent/UserMainBar"))

function UserPanel() {
    document.title = "DLC Tattoo | Quản lý thông tin | Sắp xếp lịch booking"
    var decode = null
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    if (token) {
        decode = jwtDecode(token)
    }
    const [accounts, setAccounts] = useState(null)
    const [openBars, setOpenBars] = useState(false)
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
    }, [])
    
    if (!token) {
        return NotFound404()
    } else {
        if (decode.userRole !== 1) {
            return NotFound404()
        }
    }
    return (
        <div className="mainUserPanelMain">
            <div className="coverSideBarRespon">
                <button onClick={() => openBars ? setOpenBars(false) : setOpenBars(true)} className="buttonCoverSideBarRespon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z" /></svg>
                </button>
                {(window.innerWidth <= 991 && openBars) || window.innerWidth > 991 ? (
                    <UserSideBar accounts={accounts} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} axios={axios} decode={decode} useEffect={useEffect} />
                ) : null}
            </div>

            <UserMainBar accounts={accounts} decode={decode} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} axios={axios} />
        </div>
    )
}
export default UserPanel