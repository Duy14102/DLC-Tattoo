import Cookies from "universal-cookie";

function MainBarHeader({ setOpen, axios, accounts, setType, getAccounts, toast, ToastUpdate, useRef, id }) {
    const cookies = new Cookies()
    const toastNow = useRef(null)
    function convertToBase64(e) {
        toastNow.current = toast.loading("Chờ một chút...")
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/ChangeAvatar`,
                data: {
                    id: id,
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
    const logoutAdmin = () => {
        cookies.remove("TOKEN", { path: '/' });
        localStorage.clear()
        window.location.href = "/"
    }
    return (
        <div style={{ padding: "0 24px" }}>
            <div className="headerMainBar">
                <div style={{ display: "flex", alignItems: "center", margin: "20px 10px", gap: 15 }}>
                    <button id="collapseBtn" className="collapseBar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                    </button>
                    <div className="sayHi">{new Date().getHours() >= 4 && new Date().getHours() < 11 ? "☀️ Buổi sáng vui vẻ" : new Date().getHours() >= 11 && new Date().getHours() < 13 ? "🌤️ Buổi trưa vui vẻ" : new Date().getHours() >= 13 && new Date().getHours() < 18 ? "🌅 Buổi chiều vui vẻ" : new Date().getHours() >= 18 && new Date().getHours() < 22 ? "🌙 Buổi tối vui vẻ" : "💤 Buổi đêm vui vẻ"}, <span style={{ color: "#904d03" }}>Admin</span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="bellNoti">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /></svg>
                        <p>1</p>
                        <div className="notiShow">
                            <h5 className="notiHead">Thông báo</h5>
                            <div className="notiLight">
                                <div className="titleNoti">
                                    <span>Booking</span>
                                    <span>6/9/2024 - 19:25</span>
                                </div>
                                <div className="messageNoti">
                                    <span>Xin phép admin ạ, chuyện là e có 1 case máy để lâu k dùng có nhu cầu pass lại cho ae, cấu hình: </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="avatarMainBar">
                        {accounts?.image ? (
                            <img alt="" src={accounts.image} className="hoverImg" />
                        ) : (
                            <svg className="hoverSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                        )}
                        <div className="profileShow">
                            <h5 className="profileHead">Tài khoản</h5>
                            <div className="faceProfile">
                                <div className="avatarInput">
                                    {accounts?.image ? (
                                        <img alt="" src={accounts.image} />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                                    )}
                                    <input onChange={convertToBase64} type="file" />
                                </div>
                                <div>
                                    <p>{accounts?.phone}</p>
                                    <p>Admin</p>
                                </div>
                            </div>
                            <h5 className="profileHead">Quản lí</h5>
                            <div onClick={() => { setOpen(true); setType(1) }} className="optionsProfile">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
                                <span>Đổi số điện thoại</span>
                            </div>
                            <div onClick={() => { setOpen(true); setType(2) }} className="optionsProfile">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" /></svg>
                                <span>Đổi mật khẩu</span>
                            </div>
                            <div onClick={() => logoutAdmin()} className="optionsProfile">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg>
                                <span>Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MainBarHeader