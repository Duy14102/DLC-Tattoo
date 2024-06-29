import "./Booking.css"
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import socketIOClient from "socket.io-client";
import ToastUpdate from "../Toastify/ToastUpdate";
import axios from "axios";
import HaveBooking from "./HaveBooking";

function Booking({ type, state, setState }) {
    const socketRef = useRef();
    const toastNow = useRef(null)
    useEffect(() => {
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('AddBookingSuccess', data => {
            if (data.phone === localStorage?.getItem("bookingSave")) {
                if (type === 2) {
                    setState({ wantBooking: false, bookingId: [], warningBooking: false, name: "", phone: "", date: "", time: "", note: "", modalFav: false })
                } else {
                    setState({ name: "", phone: "", date: "", time: "", note: "" })
                }
                ToastUpdate({ type: 1, message: "Booking thành công!", refCur: toastNow.current })
                getBookingsX(localStorage?.getItem("bookingSave"))
            }
        })

        socketRef.current.on('AddBookingFail', data => {
            if (data.phone === localStorage?.getItem("bookingSave")) {
                localStorage.removeItem("bookingSave")
                ToastUpdate({ type: 2, message: "Booking thất bại!", refCur: toastNow.current })
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
    }, [type])

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

    function addBooking(e) {
        e.preventDefault()
        if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) || new Date(state.date) < Date.now()) {
            return false
        }
        toastNow.current = toast.loading("Chờ một chút...")
        localStorage.setItem("bookingSave", state.phone)
        var data = null
        if (type === 2) {
            data = { name: state.name, phone: state.phone, date: state.date, time: state.time, note: state.note, samples: state.bookingId }
        } else {
            data = { name: state.name, phone: state.phone, date: state.date, time: state.time, note: state.note }
        }
        socketRef.current.emit('AddBooking', data)
    }
    return (
        type === 1 ? (
            <div className="mainBooking">
                <div className="insideMainBooking">
                    <div style={{ marginBottom: 20, width: "48%" }}>
                        <p className="titleSub">Book lịch xăm</p>
                        <p className="titleMain">Hẹn ngày xăm</p>
                        <p className="content">Hãy chọn và xem xét ngày để chúng tôi sắp xếp cho bạn lịch trình xăm hoàn hảo nhất. Và hãy nhớ rằng sau khi đặt lịch chúng tôi sẽ liên hệ để thảo luận cũng như là tư vấn cho bạn nên hãy chú ý điện thoại!</p>
                        <div style={{ display: "flex", marginTop: 25, gap: 15, alignItems: "center" }}>
                            <svg style={{ width: 40, height: 40, fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>
                            <div>
                                <p className="titleSub">SĐT liên hệ</p>
                                <a href="tel:+8400000000" className="phoneClick">+84 000 000 00</a>
                            </div>
                        </div>
                    </div>
                    {state.haveBooking ? (
                        <HaveBooking state={state} setState={setState} axios={axios} toastNow={toastNow} toast={toast} ToastUpdate={ToastUpdate} getBookingsX={getBookingsX} socketRef={socketRef} />
                    ) : (
                        <form onSubmit={(e) => addBooking(e)} className="formBooking">
                            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                                <input type="text" value={state.name} onChange={(e) => setState({ name: e.target.value })} placeholder="Họ và tên" required />
                                <input type="tel" value={state.phone} onChange={(e) => setState({ phone: e.target.value })} placeholder="Số điện thoại" required />
                            </div>
                            {state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                                <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, textAlign: "end", paddingTop: 5 }}>Số điện thoại không hợp lệ!</p>
                            ) : null}
                            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                                <input value={state.date} onChange={(e) => setState({ date: e.target.value })} type="date" required />
                                <input value={state.time} onChange={(e) => setState({ time: e.target.value })} type="time" required />
                            </div>
                            {state.date !== "" && new Date(state.date) < Date.now() ? (
                                <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, textAlign: "end", paddingTop: 5 }}>Ngày không hợp lệ!</p>
                            ) : null}
                            <textarea value={state.note} onChange={(e) => setState({ note: e.target.value })} style={{ marginTop: 20 }} placeholder="Ghi chú"></textarea>
                            <button type="submit">Book lịch xăm</button>
                        </form>
                    )}
                </div>
            </div>
        ) : (
            <form onSubmit={(e) => addBooking(e)} style={{ width: "100%" }} className="formBooking">
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <input value={state.name} onChange={(e) => setState({ name: e.target.value })} type="text" placeholder="Họ và tên" required />
                    <input value={state.phone} onChange={(e) => setState({ phone: e.target.value })} type="tel" placeholder="Số điện thoại" required />
                </div>
                {state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                    <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, textAlign: "end", paddingTop: 5 }}>Số điện thoại không hợp lệ!</p>
                ) : null}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                    <input value={state.date} onChange={(e) => setState({ date: e.target.value })} type="date" required />
                    <input value={state.time} onChange={(e) => setState({ time: e.target.value })} type="time" required />
                </div>
                {state.date !== "" && new Date(state.date) < Date.now() ? (
                    <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, textAlign: "end", paddingTop: 5 }}>Ngày không hợp lệ!</p>
                ) : null}
                <textarea value={state.note} onChange={(e) => setState({ note: e.target.value })} style={{ marginTop: 20 }} placeholder="Ghi chú"></textarea>
                <button type="submit">Book lịch xăm</button>
            </form>
        )
    )
}
export default Booking