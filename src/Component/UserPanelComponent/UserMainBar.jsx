import ChangePasswordTabs from "./tabs/ChangePasswordTabs"
import ChangePhoneTabs from "./tabs/ChangePhoneTabs"
import UserBookingTabs from "./tabs/UserBookingTabs"
import UserChatTabs from "./tabs/UserChatTabs"

function UserMainBar({ accounts, decode, getAccounts, toast, ToastUpdate, useRef, axios }) {
    return (
        <div className="mainAdminMainBar">
            <div className="contentMainBar">
                {localStorage.getItem("tabs") === "Booking" ? (
                    <UserBookingTabs token={decode} getAccounts={getAccounts} />
                ) : localStorage.getItem("tabs") === "Chat" ? (
                    <UserChatTabs useRef={useRef} decode={decode} toast={toast} ToastUpdate={ToastUpdate} getAccounts={getAccounts} />
                ) : localStorage.getItem("tabs") === "ChangePhone" ? (
                    <ChangePhoneTabs accounts={accounts} decode={decode} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} axios={axios} />
                ) : localStorage.getItem("tabs") === "ChangePassword" ? (
                    <ChangePasswordTabs decode={decode} toast={toast} ToastUpdate={ToastUpdate} useRef={useRef} axios={axios} />
                ) : null}
            </div>
        </div>
    )
}
export default UserMainBar