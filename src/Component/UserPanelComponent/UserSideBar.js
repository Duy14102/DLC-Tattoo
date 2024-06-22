import "./UserPanel.css"

function UserSideBar({ accounts, getAccounts, toast, ToastUpdate, useRef, axios, decode }) {
    const toastNow = useRef(null)
    function changeTabs(e) {
        localStorage.setItem("tabs", e)
        window.location.reload()
    }

    function convertToBase64(e) {
        toastNow.current = toast.loading("Chờ một chút...")
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/ChangeAvatar`,
                data: {
                    id: decode.userId,
                    base64: reader.result
                }
            }
            axios(configuration).then((res) => {
                getAccounts()
                ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
            }).catch((err) => {
                ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
            })
        };
        reader.onerror = () => {
            ToastUpdate({ type: 2, message: "Thay avatar thất bại!", refCur: toastNow.current })
        }
    }
    return (
        <div className="mainAdminSideBar">
            <div className="logoA">
                <div className="pictureCollect">
                    {accounts?.image ? (
                        <img alt="" src={accounts.image} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                    )}
                    <input type="file" onChange={convertToBase64} />
                </div>
                <p>{accounts?.phone}</p>
            </div>
            <div className="navBarA">
                <div className="captionA">
                    <span>Quản lí chung</span>
                </div>
                <div onClick={() => changeTabs("Booking")} className={localStorage.getItem("tabs") === "Booking" ? "optionsA active" : "optionsA"}>
                    <div className="optionsLeftA">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm80 64c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80z" /></svg>
                        <p>Booking</p>
                    </div>
                    <p className="optionsNotiA">2</p>
                </div>
                <div onClick={() => changeTabs("Chat")} className={localStorage.getItem("tabs") === "Chat" ? "optionsA active" : "optionsA"}>
                    <div className="optionsLeftA">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                        <p>Trò chuyện</p>
                    </div>
                    <p className="optionsNotiA">5</p>
                </div>
            </div>
            <div className="navBarA">
                <div className="captionA">
                    <span>Quản lí tài khoản</span>
                </div>
                <div onClick={() => changeTabs("ChangePhone")} className={localStorage.getItem("tabs") === "ChangePhone" ? "optionsA active" : "optionsA"}>
                    <div className="optionsLeftA">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>
                        <p>Đổi số điện thoại</p>
                    </div>
                </div>
                <div onClick={() => changeTabs("ChangePassword")} className={localStorage.getItem("tabs") === "ChangePassword" ? "optionsA active" : "optionsA"}>
                    <div className="optionsLeftA">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" /></svg>
                        <p>Đổi mật khẩu</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserSideBar