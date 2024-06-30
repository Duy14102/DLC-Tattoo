import { useEffect, useReducer, useRef } from "react";
import UserHeaderTabs from "./UserHeaderTabs"
import { toast } from "react-toastify";
import ToastUpdate from "../../Toastify/ToastUpdate";
import axios from "axios";
import socketIOClient from "socket.io-client";

function UserBookingTabs({ token }) {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        name: "",
        phone: "",
        date: "",
        time: "",
        note: "",
        cancelReason: "",
        haveBooking: null,
        wantUpdateBooking: false,
        wantDeleteBooking: false,
        bookingId: [],
    })
    const socketRef = useRef();
    const toastNow = useRef(null)
    useEffect(() => {
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('AddBookingSuccess', data => {
            if (data.phone === localStorage?.getItem("bookingSave")) {
                setState({ name: "", phone: "", date: "", time: "", note: "" })
                ToastUpdate({ type: 1, message: "Booking thành công!", refCur: toastNow.current })
                getBookingsX(localStorage?.getItem("bookingSave"))
            }
        })

        socketRef.current.on('CancelBookingSuccess', data => {
            if (data.phone === localStorage?.getItem("bookingSave")) {
                localStorage.removeItem("bookingSave")
                setState({ haveBooking: null, wantDeleteBooking: false, cancelReason: "" })
                ToastUpdate({ type: 1, message: "Hủy booking thành công!", refCur: toastNow.current })
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const bookingPhone = localStorage?.getItem("bookingSave")
    useEffect(() => {
        if (bookingPhone) {
            getBookingsX(bookingPhone)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingPhone])

    function getBookingsX(e) {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetSpecBooking`,
            params: {
                phone: e
            }
        }
        axios(configuration).then((res) => {
            setState({ haveBooking: res.data })
        })
    }

    function updateBooking(e) {
        e.preventDefault()
        toastNow.current = toast.loading("Chờ một chút...")
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateBooking`,
            data: {
                id: state.haveBooking._id,
                name: state.name,
                phone: state.phone,
                date: state.date,
                time: state.time,
                note: state.note,
                samples: state.bookingId
            }
        }
        axios(configuration).then(() => {
            if (state.phone) {
                localStorage.setItem("bookingSave", state.phone)
            }
            getBookingsX(localStorage.getItem("bookingSave"))
            setState({ name: "", phone: "", date: "", time: "", note: "", bookingId: [], wantUpdateBooking: false })
            ToastUpdate({ type: 1, message: "Cập nhật booking thành công!", refCur: toastNow.current })
        })
    }

    function cancelBooking() {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { id: state.haveBooking._id, reason: state.cancelReason, phone: localStorage.getItem("bookingSave") }
        socketRef.current.emit('CancelBooking', data)
    }
    return (
        <div>
            <UserHeaderTabs quote={"Booking"} />

            {state.haveBooking ? (
                <form onSubmit={(e) => updateBooking(e)} className="formBooking">
                    <h4 className="formHaveH4">Thông tin booking</h4>
                    <div style={state.wantUpdateBooking ? null : { pointerEvents: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                            <input type="text" defaultValue={state.haveBooking.name} onChange={(e) => setState({ name: e.target.value })} required />
                            <input type="tel" defaultValue={state.haveBooking.phone} onChange={(e) => setState({ phone: e.target.value })} required />
                        </div>
                        {state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                            <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, textAlign: "end", paddingTop: 5 }}>Số điện thoại không hợp lệ!</p>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                            <input defaultValue={state.haveBooking.date} onChange={(e) => setState({ date: e.target.value })} type="date" required />
                            <input defaultValue={state.haveBooking.time} onChange={(e) => setState({ time: e.target.value })} type="time" required />
                        </div>
                        {state.date !== "" && new Date(state.date) < Date.now() ? (
                            <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, textAlign: "end", paddingTop: 5 }}>Ngày không hợp lệ!</p>
                        ) : null}
                        <textarea defaultValue={state.haveBooking.note} onChange={(e) => setState({ note: e.target.value })} style={{ marginTop: 20 }} placeholder="Ghi chú"></textarea>
                    </div>
                    {state.wantDeleteBooking ? (
                        <input value={state.cancelReason} onChange={(e) => setState({ cancelReason: e.target.value })} style={{ marginTop: 20 }} placeholder="Lý do hủy..." />
                    ) : null}
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        {state.haveBooking.status === 1 && !state.wantUpdateBooking && !state.wantDeleteBooking ? (
                            <>
                                <button onClick={() => setState({ wantUpdateBooking: true })} type="button">Cập nhật</button>
                                <button onClick={() => setState({ wantDeleteBooking: true })} style={{ background: "tomato" }} type="button">Hủy booking</button>
                            </>
                        ) : null}
                        {state.wantUpdateBooking ? (
                            <>
                                <button type="submit">Xong</button>
                                <button onClick={() => setState({ wantUpdateBooking: false })} style={{ background: "gray" }} type="button">Hủy</button>
                            </>
                        ) : state.wantDeleteBooking ? (
                            <>
                                <button onClick={() => cancelBooking()} style={{ background: "tomato" }} type="button">Xác nhận</button>
                                <button onClick={() => setState({ wantDeleteBooking: false })} style={{ background: "gray" }} type="button">Hủy</button>
                            </>
                        ) : null}
                    </div>
                </form>
            ) : (
                <p className="noBookingText" align="center">Bạn không có lịch booking nào!</p>
            )}
        </div>
    )
}
export default UserBookingTabs