import { useReducer } from "react"
import UserHeaderTabs from "./UserHeaderTabs"

function ChangePasswordTabs({ decode, toast, ToastUpdate, useRef, axios }) {
    const toastNow = useRef(null)
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        password: "",
        repeatPassword: "",
        seePassword: false,
        seeRepeatPassword: false,
        wantChangePassword: false,
    })

    function changePassword(e) {
        e.preventDefault()
        if (state.password.length < 8) { return false }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdatePassword`,
            data: {
                id: decode.userId,
                oldPassword: state.password,
                password: state.repeatPassword
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ password: "", repeatPassword: "", seePassword: false, seeRepeatPassword: false, wantChangePassword: false })
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <div>
            <UserHeaderTabs quote={"Đổi mật khẩu"} />
            <form onSubmit={(e) => changePassword(e)}>
                <div className="coverChangePasswordUnder">
                    <div style={state.wantChangePassword ? null : { pointerEvents: "none", background: "rgba(255,255,255,0.1)" }} className="inputPassword">
                        <input className="accountInput" type={state.seePassword ? "text" : "password"} placeholder="Mật khẩu cũ..." value={state.password} onChange={(e) => setState({ password: e.target.value })} required />
                        <button type="button" onClick={() => state.seePassword ? setState({ seePassword: false }) : setState({ seePassword: true })}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.seePassword ? "M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" : "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"} /></svg>
                        </button>
                    </div>
                    <div style={state.wantChangePassword ? null : { pointerEvents: "none", background: "rgba(255,255,255,0.1)" }} className="inputPassword">
                        <input className="accountInput" type={state.seeRepeatPassword ? "text" : "password"} placeholder="Mật khẩu mới..." value={state.repeatPassword} onChange={(e) => setState({ repeatPassword: e.target.value })} required />
                        <button type="button" onClick={() => state.seeRepeatPassword ? setState({ seeRepeatPassword: false }) : setState({ seeRepeatPassword: true })}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.seeRepeatPassword ? "M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" : "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"} /></svg>
                        </button>
                    </div>
                    {state.repeatPassword !== "" && state.repeatPassword.length < 8 ? (
                        <p className="warningText">Mật khẩu phải nhiều hơn 8 kí tự!</p>
                    ) : null}
                </div>
                <div style={{ marginTop: 15 }}>
                    {state.wantChangePassword ? (
                        <>
                            <button style={{ height: 38, marginRight: 10 }} className="buttonSelfish buttonA" type="submit">Xong</button>
                            <button style={{ height: 38 }} onClick={() => setState({ wantChangePassword: false })} className="buttonSelfish buttonB" type="button">Hủy</button>
                        </>
                    ) : (
                        <button style={{ height: 38 }} onClick={() => setState({ wantChangePassword: true })} className="buttonSelfish buttonA" type="button">Thay đổi</button>
                    )}
                </div>
            </form>
        </div>
    )
}
export default ChangePasswordTabs