import axios from "axios"
import { useReducer, useRef } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import socketIOClient from "socket.io-client";

function GetAccounts({ token, useEffect, NavLink, cookies, jwtDecode, logoutUser }) {
    const socketRef = useRef();
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        accounts: null,
        openNoti: false,
        openAcc: false,
        appearNewNoti: false,
        upSlice: 1
    })
    const decode = jwtDecode(token)
    useEffect(() => {
        getAccounts()
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('BanAccountSuccess', data => {
            if (decode.userId === data.id) {
                cookies.remove("TOKEN", { path: '/' });
                window.location.href = "/"
            }
        })

        socketRef.current.on('DeleteChatSuccess', data => {
            if (decode.userId === data.userId) {
                getAccounts()
            }
        })

        socketRef.current.on('CancelBookingByAdminSuccess', data => {
            if (state?.phonenumber === data.phone) {
                getAccounts()
            }
        })

        socketRef.current.on('ConfirmBookingSuccess', data => {
            if (state?.phonenumber === data.phone) {
                getAccounts()
            }
        })

        socketRef.current.on('DoneBookingSuccess', data => {
            if (state?.phonenumber === data.phone) {
                getAccounts()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (state.openNoti) {
            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateNotification`,
                data: {
                    id: decode.userId,
                }
            }
            axios(configuration).then(() => {
                setTimeout(() => {
                    getAccounts()
                }, 3000);
            }).catch((err) => console.log(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.openNoti])

    function getAccounts() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAccounts`,
            params: {
                id: decode.userId
            }
        }
        axios(configuration).then((res) => {
            setState({ accounts: res.data })
        }).catch((err) => console.log(err))
    }

    function navigateNoti(e) {
        localStorage.setItem("tabs", e)
        window.location.href = "/UserPanel"
    }
    return (
        <>
            <div className="avatarUser">
                <svg onClick={() => setState(state.openNoti ? { openNoti: false } : { openNoti: true, openAcc: false })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /></svg>
                {state.accounts?.notification.filter(item => item.status === 1).length > 0 ? (
                    <div className="countNotiHeader">{state.accounts?.notification.filter(item => item.status === 1).length}</div>
                ) : null}
                {state.openNoti ? (
                    <div className="notiShow">
                        <div style={{ padding: 15 }}>
                            <h5 className="notiHead">Thông báo</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {state.accounts?.notification.length < 1 ? (
                                    <h4 className="noNoti">Thông báo trống!</h4>
                                ) : (
                                    state.accounts?.notification.slice(0, state.upSlice * 5).sort((a, b) => a.status - b.status).map((i, indexN) => {
                                        return (
                                            <div onClick={() => navigateNoti(i.place)} key={indexN} className={i.status === 1 ? "notiLight notiLightActive" : "notiLight"}>
                                                <div className="titleNoti">
                                                    <span>{i.place}</span>
                                                    <span>{new Date(i.time).toLocaleString()}</span>
                                                </div>
                                                <div className="messageNoti">
                                                    <span>{i.title}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                        {state.accounts?.notification.length > 5 && state.accounts?.notification.length > state.upSlice * 5 ? (
                            <div onClick={() => setState({ upSlice: state.upSlice + 1 })} className="moreNotiButton">Xem thêm</div>
                        ) : null}
                    </div>
                ) : null}
            </div>
            <div className="avatarUser">
                {state.accounts?.image ? (
                    <LazyLoadImage onClick={() => setState(state.openAcc ? { openAcc: false } : { openAcc: true, openNoti: false })} alt="Image" src={state.accounts.image} />
                ) : (
                    <svg onClick={() => setState(state.openAcc ? { openAcc: false } : { openAcc: true, openNoti: false })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                )}
                {state.openAcc ? (
                    <div className="dropdownAvatar">
                        <NavLink reloadDocument to={decode.userRole === 1 ? "/UserPanel" : "/AdminPanel"}>{decode.userRole === 1 ? "Tài khoản" : "Quản trị"}</NavLink>
                        <button onClick={() => logoutUser()} type="button">Thoát</button>
                    </div>
                ) : null}
            </div>
        </>
    )
}
export default GetAccounts