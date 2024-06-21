import axios from "axios"
import AdminAccountModal from "../Modal/AdminAccountModal"
import "./AdminPanel.css"
import MainBarHeader from "./MainBarHeader"
import DashboardTabs from "./Tabs/DashboardTabs"
import ChatTabs from "./Tabs/ChatTabs"
import BookingTabs from "./Tabs/BookingTabs"
import SampleTabs from "./Tabs/SampleTabs"
import BlogTabs from "./Tabs/BlogTabs"
import AccountsTabs from "./Tabs/AccountsTabs"
import { toast } from 'react-toastify';
import ToastUpdate from '../Toastify/ToastUpdate';
import { useRef } from "react"
import GalleryTabs from "./Tabs/GalleryTabs"

function AdminMainBar({ useState, token, useEffect }) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState(null)
    const [accounts, setAccounts] = useState(null)
    function getAccounts() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAccounts`,
            params: {
                id: token.userId
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
    return (
        <div className="mainAdminMainBar">
            <MainBarHeader setOpen={setOpen} axios={axios} accounts={accounts} setType={setType} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} id={token.userId} />
            <div className="contentMainBar">
                {localStorage.getItem("tabs") === "Dashboard" ? (
                    <DashboardTabs />
                ) : localStorage.getItem("tabs") === "Chat" ? (
                    <ChatTabs />
                ) : localStorage.getItem("tabs") === "Booking" ? (
                    <BookingTabs />
                ) : localStorage.getItem("tabs") === "Sample" ? (
                    <SampleTabs useEffect={useEffect} axios={axios} useRef={useRef} toast={toast} ToastUpdate={ToastUpdate} />
                ) : localStorage.getItem("tabs") === "Blog" ? (
                    <BlogTabs axios={axios} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} useEffect={useEffect} />
                ) : localStorage.getItem("tabs") === "Accounts" ? (
                    <AccountsTabs toast={toast} useRef={useRef} axios={axios} ToastUpdate={ToastUpdate} useEffect={useEffect} id={token.userId} />
                ) : localStorage.getItem("tabs") === "Gallery" ? (
                    <GalleryTabs axios={axios} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} useEffect={useEffect} />
                ) : null}
            </div>
            <AdminAccountModal open={open} setOpen={setOpen} axios={axios} token={token} type={type} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} />
        </div>
    )
}
export default AdminMainBar