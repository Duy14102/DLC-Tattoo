import { useReducer } from "react"
import UserHeaderTabs from "./UserHeaderTabs"

function ChangePhoneTabs({ accounts, decode, getAccounts, toast, ToastUpdate, useRef, axios }) {
    const toastNow = useRef(null)
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        phone: "",
        wantChangePhone: false,
    })

    function changePhone(e) {
        e.preventDefault()
        if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone)) { return false }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdatePhone`,
            data: {
                id: decode.userId,
                phone: state.phone
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ wantChangePhone: false, phone: "" })
            getAccounts()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <div>
            <UserHeaderTabs quote={"Đổi số điện thoại"} />
            <div className="coverChangePhoneUnder">
                <form onSubmit={(e) => changePhone(e)} className="changePhoneUnder">
                    <input onChange={(e) => setState({ phone: e.target.value })} style={state.wantChangePhone ? null : { pointerEvents: "none", background: "rgba(255,255,255,0.1)" }} defaultValue={accounts?.phone} type="text" required />
                    {state.wantChangePhone ? (
                        <>
                            <button className="buttonSelfish buttonA" type="submit">Xong</button>
                            <button onClick={() => setState({ wantChangePhone: false })} className="buttonSelfish buttonB" type="button">Hủy</button>
                        </>
                    ) : (
                        <button onClick={() => setState({ wantChangePhone: true })} className="buttonSelfish buttonA" type="button">Thay đổi</button>
                    )}
                </form>
                {state.wantChangePhone && state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                    <p className="warningText">Số điện thoại không hợp lệ!</p>
                ) : null}
            </div>
        </div>
    )
}
export default ChangePhoneTabs