import { Fragment } from "react"
import AddSamplesUser from "../Modal/AddSamplesUser"
import { LazyLoadImage } from "react-lazy-load-image-component"

function HaveBooking({ state, setState, axios, toastNow, toast, ToastUpdate, getBookingsX, socketRef, token, useEffect, useRef }) {
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
        <>
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
                <div style={{ marginTop: 20 }} type="button" onClick={() => setState(state.moreSamples ? { moreSamples: false } : { moreSamples: true })} className="openMoreSamples"><span style={state.moreSamples ? { rotate: "90deg" } : null} >➤</span> {state?.haveBooking?.samples.length} hình mẫu</div>
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
                    <input value={state.cancelReason} onChange={(e) => setState({ cancelReason: e.target.value })} style={{ marginTop: 20 }} placeholder="Lý do hủy..." />
                ) : null}
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
            </form>
            <AddSamplesUser toast={toast} toastNow={toastNow} ToastUpdate={ToastUpdate} useEffect={useEffect} useRef={useRef} axios={axios} getBooking={getBookingsX} state={state} setState={setState} />
        </>
    )
}
export default HaveBooking