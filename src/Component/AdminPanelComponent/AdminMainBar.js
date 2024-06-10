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
                    <SampleTabs />
                ) : localStorage.getItem("tabs") === "Blog" ? (
                    <BlogTabs axios={axios} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} />
                ) : localStorage.getItem("tabs") === "Accounts" ? (
                    <AccountsTabs />
                ) : null}
            </div>
            <AdminAccountModal open={open} setOpen={setOpen} axios={axios} token={token} type={type} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} />
        </div>
    )
}
export default AdminMainBar