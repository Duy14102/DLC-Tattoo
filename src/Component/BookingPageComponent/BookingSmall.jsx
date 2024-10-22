import "./BookingSmall.css"
import { Fragment, useEffect, useReducer, useRef } from "react";
import { toast } from "react-toastify";
import socketIOClient from "socket.io-client";
import ToastUpdate from "../Toastify/ToastUpdate";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode"
import AddSamplesUser from "../Modal/AddSamplesUser";
import ToastSuccess from "../Toastify/ToastSuccess";
import ToastError from "../Toastify/ToastError";
import { LazyLoadImage } from "react-lazy-load-image-component";

function BookingSmall() {
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
        modalOpen2: false, samplesId: [], wantType: null, pageCount2: 6, samplesForAdd: null, search2: "", contentSearch2: null, moreSamples: false, allSamples: []
    })
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const socketRef = useRef();
    const toastNow = useRef(null)
    useEffect(() => {
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('AddBookingSuccess', data => {
            if (data.phone === localStorage?.getItem("bookingSave")) {
                getBookingsX(localStorage?.getItem("bookingSave"))
                setState({ name: "", phone: "", date: "", time: "", note: "" })
                ToastUpdate({ type: 1, message: "Booking thành công!", refCur: toastNow.current })
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

        socketRef.current.on('CancelBookingByAdminSuccess', data => {
            if (localStorage?.getItem("bookingSave") === data.phone) {
                getBookingsX(localStorage?.getItem("bookingSave"))
                ToastError({ message: "Đơn booking bị hủy!" })
                localStorage.removeItem("bookingSave")
            }
        })

        socketRef.current.on('ConfirmBookingSuccess', data => {
            if (localStorage?.getItem("bookingSave") === data.phone) {
                getBookingsX(localStorage?.getItem("bookingSave"))
                ToastSuccess({ message: "Đơn booking được xác nhận!" })
            }
        })

        socketRef.current.on('DoneBookingSuccess', data => {
            if (localStorage?.getItem("bookingSave") === data.phone) {
                getBookingsX(localStorage?.getItem("bookingSave"))
                ToastSuccess({ message: "Đơn booking hoàn thành!" })
                localStorage.removeItem("bookingSave")
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, [])

    const bookingPhone = localStorage?.getItem("bookingSave")
    useEffect(() => {
        if (bookingPhone) {
            getBookingsX(bookingPhone)
        }
    }, [bookingPhone])

    useEffect(() => {
        if (token) {
            const configuration = {
                method: "get",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAccounts`,
                params: {
                    id: jwtDecode(token).userId
                }
            }
            axios(configuration).then((res) => {
                setState({ phone: res.data.phone })
            }).catch((err) => console.log(err))
        }
    }, [token])

    function getBookingsX(e) {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetSpecBooking`,
            params: {
                phone: e
            }
        }
        axios(configuration).then((res) => {
            setState({ haveBooking: res.data.resa, allSamples: res.data.samples })
        }).catch((err) => console.log(err))
    }

    function addBooking(e) {
        e.preventDefault()
        if (!token) {
            if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) || new Date(state.date) < Date.now()) {
                return false
            }
        } else {
            if (new Date(state.date) < Date.now()) {
                return false
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        localStorage.setItem("bookingSave", state.phone)
        const data = { name: state.name, phone: state.phone, date: state.date, time: state.time, note: state.note }
        socketRef.current.emit('AddBooking', data)
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
        }).catch((err) => console.log(err))
    }

    function cancelBooking() {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { id: state.haveBooking._id, reason: state.cancelReason, phone: localStorage.getItem("bookingSave") }
        socketRef.current.emit('CancelBooking', data)
    }

    function deleteMainDish(id) {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/DeleteBookingMainDish`,
            data: {
                bookingId: state.haveBooking?._id,
                sessionId: id,
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ wantUpdateBooking: false })
            getBookingsX(localStorage?.getItem("bookingSave"))
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <div className="mainBookingSmall">
            <div className="leftDesc">
                <h5>DLC Tattoo Studio</h5>
                <p style={{ margin: "0 0 30px 0" }}>Hãy đến DLC Tattoo để thấy sự khác biệt và chỉ trả tiền khi bạn hài lòng với kết quả bạn nhận được. Với dịch vụ chuyên nghiệp cùng tinh thần nghệ thuật và sáng tạo trong từng hình xăm, DLC Tattoo dẫn trở thành địa chỉ đáng tin cậy, được nhiều khách hàng yêu thích và ủng hộ.</p>
                <div className="information">
                    <div className="svgCover">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-45 0 452 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>
                    </div>
                    <div>
                        <h6>Địa chỉ</h6>
                        <p style={{ margin: 0 }}>Số 10 đường 10 TP.HCM</p>
                    </div>
                </div>
                <div className="information">
                    <div className="svgCover">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>
                    </div>
                    <div>
                        <h6>Số điện thoại</h6>
                        <p style={{ margin: 0 }}><a href="tel:+8400000000">+84 000 000 00</a></p>
                    </div>
                </div>
                <div className="information">
                    <div className="svgCover">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>
                    </div>
                    <div>
                        <h6>Gmail</h6>
                        <p style={{ margin: 0 }}>DLCtattoo@gmail.com</p>
                    </div>
                </div>
            </div>
            {state.haveBooking ? (
                <form onSubmit={(e) => updateBooking(e)} className="rightForm">
                    <h5>Thông tin booking</h5>
                    <div className="insideRightForm" style={state.wantUpdateBooking ? null : { pointerEvents: "none" }}>
                        <input key={state.haveBooking.name} defaultValue={state.haveBooking.name} onChange={(e) => setState({ name: e.target.value })} type="text" placeholder="Họ và tên" required />
                        <input key={state.haveBooking.phone} defaultValue={state.haveBooking.phone} onChange={(e) => setState({ phone: e.target.value })} type="tel" placeholder="Số điện thoại" required />
                        {state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                            <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, paddingTop: 5 }}>Số điện thoại không hợp lệ!</p>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                            <input key={state.haveBooking.date} defaultValue={state.haveBooking.date} onChange={(e) => setState({ date: e.target.value })} type="date" required />
                            <input key={state.haveBooking.time} defaultValue={state.haveBooking.time} onChange={(e) => setState({ time: e.target.value })} type="time" required />
                        </div>
                        {state.date !== "" && new Date(state.date) < Date.now() ? (
                            <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, paddingTop: 5 }}>Ngày không hợp lệ!</p>
                        ) : null}
                        <textarea key={`note + ${state.haveBooking.note}`} defaultValue={state.haveBooking.note} onChange={(e) => setState({ note: e.target.value })} required placeholder="Ghi chú"></textarea>
                    </div>
                    <div style={{ marginTop: 20 }} type="button" onClick={() => setState(state.moreSamples ? { moreSamples: false } : { moreSamples: true })} className="openMoreSamples"><span style={state.moreSamples ? { rotate: "90deg" } : null} >➤</span> {state?.haveBooking?.samples ? state?.haveBooking?.samples.length : "0"} hình mẫu</div>
                    {state.moreSamples ? (
                        <div style={{ marginTop: 10 }}>
                            {state?.haveBooking?.samples?.filter(item => item.type === 1).length > 0 ? (
                                <div className="textUnderMoreSamples">Mẫu có sẵn</div>
                            ) : null}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
                                {state?.haveBooking?.samples?.filter(item => item.type === 1).map((u) => {
                                    return (
                                        <Fragment key={u.id}>
                                            {state?.allSamples?.filter(item2 => item2._id === u.id).map((y) => {
                                                return (
                                                    <div key={y._id} className="samplesImage"><LazyLoadImage onClick={() => window.location.href = y.thumbnail} alt="Image" src={y.thumbnail} />
                                                        {state.wantUpdateBooking ? (
                                                            <div onClick={() => deleteMainDish(u.id)} className="deleteSamples">x</div>
                                                        ) : null}
                                                    </div>
                                                )
                                            })}
                                        </Fragment>
                                    )
                                })}
                            </div>
                            {state?.haveBooking?.samples?.filter(item => item.type === 2).length > 0 ? (
                                <div className="textUnderMoreSamples" style={{ marginTop: 10 }}>Mẫu tự thêm</div>
                            ) : null}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
                                {state?.haveBooking?.samples?.filter(item => item.type === 2).map((u) => {
                                    return (
                                        <a href={u.image} key={u.id} className="samplesImage"><LazyLoadImage alt="Image" src={u.image} /></a>
                                    )
                                })}
                            </div>
                        </div>
                    ) : null}
                    {state.wantDeleteBooking ? (
                        <input value={state.cancelReason} onChange={(e) => setState({ cancelReason: e.target.value })} style={{ marginTop: 15 }} placeholder="Lý do hủy..." />
                    ) : null}
                    <div style={{ marginTop: 15 }}>
                        {state.haveBooking.status === 1 && !state.wantUpdateBooking && !state.wantDeleteBooking ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <button onClick={() => setState({ wantUpdateBooking: true })} type="button">Cập nhật</button>
                                <button onClick={() => setState({ wantDeleteBooking: true })} style={{ background: "tomato" }} type="button">Hủy booking</button>
                            </div>
                        ) : null}
                        {state.wantUpdateBooking ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <button type="submit">Xong</button>
                                <button onClick={() => setState({ wantUpdateBooking: false })} style={{ background: "gray" }} type="button">Hủy</button>
                                <button onClick={() => setState({ modalOpen2: true, modalData3: state.haveBooking })} style={{ background: "#096FAD", textWrap: "nowrap" }} type="button">+ Thêm</button>
                            </div>
                        ) : state.wantDeleteBooking ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <button onClick={() => cancelBooking()} style={{ background: "tomato" }} type="button">Xác nhận</button>
                                <button onClick={() => setState({ wantDeleteBooking: false })} style={{ background: "gray" }} type="button">Hủy</button>
                            </div>
                        ) : null}
                    </div>
                </form>
            ) : (
                <form onSubmit={(e) => addBooking(e)} className="rightForm">
                    <h5>Booking form</h5>
                    <div className="insideRightForm">
                        <input value={state.name} onChange={(e) => setState({ name: e.target.value })} type="text" placeholder="Họ và tên" required />
                        {token ? null : (
                            <input value={state.phone} onChange={(e) => setState({ phone: e.target.value })} type="tel" placeholder="Số điện thoại" required />
                        )}
                        {state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                            <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, paddingTop: 5 }}>Số điện thoại không hợp lệ!</p>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                            <input value={state.date} onChange={(e) => setState({ date: e.target.value })} type="date" required />
                            <input value={state.time} onChange={(e) => setState({ time: e.target.value })} type="time" required />
                        </div>
                        {state.date !== "" && new Date(state.date) < Date.now() ? (
                            <p style={{ color: "tomato", fontWeight: 400, fontFamily: "Oswald", letterSpacing: 1, margin: 0, paddingTop: 5 }}>Ngày không hợp lệ!</p>
                        ) : null}
                        <textarea value={state.note} onChange={(e) => setState({ note: e.target.value })} required placeholder="Ghi chú"></textarea>
                        <button type="submit">Book lịch xăm</button>
                    </div>
                </form>
            )}
            <AddSamplesUser toast={toast} toastNow={toastNow} ToastUpdate={ToastUpdate} useEffect={useEffect} useRef={useRef} axios={axios} getBooking={getBookingsX} state={state} setState={setState} />
        </div>
    )
}
export default BookingSmall