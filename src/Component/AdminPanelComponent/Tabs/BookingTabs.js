import { Fragment, useReducer } from "react"
import SearchBar from "./SearchBar"
import ReactPaginate from 'react-paginate';
import socketIOClient from "socket.io-client";
import BookingType1Modal from "../../Modal/BookingType1Modal";
import AddType2Booking from "../../Modal/AddType2Booking";
import BookingType2Modal from "../../Modal/BookingType2Modal";
import ToastWarning from "../../Toastify/ToastWarning";
import ToastSuccess from "../../Toastify/ToastSuccess";

function BookingTabs({ axios, toast, ToastUpdate, useRef, useEffect, token }) {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        search: "", search2: "",
        cancelReason: "",
        addTitle: "",
        addPrice: "",
        updateTitle: "", updatePrice: "",
        updateBookingName: "", updateBookingPhone: "", updateBookingDate: "", updateBookingTime: "", updateBookingNote: "", priceDone: "",
        mainIndex: null, mainIndex2: null,
        addImage: null,
        allBookings: null,
        allSamples: null,
        samplesForAdd: null,
        contentSearch: null, contentSearch2: null,
        moreSamples: false,
        wantCancel: false, wantUpdate: false, wantDone: false, checkPriceDone: false,
        modalOpen: false, modalData: null, modalData2: null, modalData3: null,
        modalOpen2: false, modalOpen3: false, modalDataX: null,
        payingPrice: null,
        wantChangeSessionPrice: false, indexSessionPrice: null, wantType: null,
        checkTitle: false, wantChangeMainDish: false, warningOverPrice: false,
        sessionType2Add: [],
        sessionFix: [],
        samplesId: [],
        filter: 0, pageCount: 6, pageCount2: 6
    })
    const toastNow = useRef(null)
    const socketRef = useRef();
    const currentPage = useRef();
    const limit = 4

    useEffect(() => {
        currentPage.current = 1
        getBooking()
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('AddBookingSuccess', data => {
            getBooking()
            ToastSuccess({ message: "1 đơn booking mới!" })
        })

        socketRef.current.on('ConfirmBookingSuccess', data => {
            if (token.userId === data.adminId) {
                getBooking()
                ToastUpdate({ type: 1, message: "Xác nhận thành công!", refCur: toastNow.current })
            }
        })

        socketRef.current.on('DoneBookingSuccess', data => {
            if (token.userId === data.adminId) {
                getBooking()
                setState({ wantDone: false, checkPriceDone: false, priceDone: "", mainIndex: null })
                ToastUpdate({ type: 1, message: "Hoàn thành thành công!", refCur: toastNow.current })
            }
        })

        socketRef.current.on('CancelBookingByAdminSuccess', data => {
            if (token.userId === data.adminId) {
                getBooking()
                setState({ wantCancel: false, mainIndex: null, cancelReason: "" })
                ToastUpdate({ type: 1, message: "Hủy booking thành công!", refCur: toastNow.current })
            }
        })

        socketRef.current.on('CancelBookingSuccess', data => {
            getBooking()
            ToastWarning({ message: "1 đơn booking bị hủy!" })
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch, state.filter])

    useEffect(() => {
        if (state.search !== "") {
            const debounceResult = setTimeout(() => {
                setState({ contentSearch: state.search })
            }, 750);
            return () => clearTimeout(debounceResult)
        } else {
            setTimeout(() => {
                setState({ contentSearch: null })
            }, 750);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.search])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getBooking();
    }

    function getBooking() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetBookingAdmin`,
            params: {
                page: currentPage.current,
                limit: limit,
                search: state.contentSearch,
                filter: state.filter
            }
        }
        axios(configuration).then((res) => {
            setState({ allBookings: res.data.results.result, pageCount: res.data.results.pageCount, allSamples: res.data.results.samples });
        })
    }

    function updateBooking(e, id) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateRealBooking`,
            data: {
                id: id,
                name: state.updateBookingName,
                phone: state.updateBookingPhone,
                date: state.updateBookingDate,
                time: state.updateBookingTime,
                note: state.updateBookingNote
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            getBooking()
            setState({ updateBookingName: "", updateBookingPhone: "", updateBookingDate: "", updateBookingTime: "", updateBookingNote: "", wantUpdate: false, mainIndex: null })
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        })
    }

    function confirmBooking(id, phone) {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { bookingId: id, adminId: token.userId, phone: phone }
        socketRef.current.emit('ConfirmBooking', data)
    }

    function doneBooking(id, phone) {
        if (state.priceDone === "") {
            return setState({ checkPriceDone: true })
        }
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { bookingId: id, adminId: token.userId, phone: phone, priceDone: state.priceDone }
        socketRef.current.emit('DoneBooking', data)
    }

    function cancelBooking(id, phone) {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { bookingId: id, adminId: token.userId, phone: phone, reason: state.cancelReason }
        socketRef.current.emit('CancelBookingByAdmin', data)
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <div className="topBlobTaps">
                <SearchBar state={state} setState={setState} useEffect={useEffect} searchWhat={"Nhập số điện thoại..."} />
                <select onChange={(e) => setState({ filter: e.target.value })}>
                    <option value={null} hidden>Lọc kết quả</option>
                    <option value={1}>Đang chờ</option>
                    <option value={2}>Xác nhận</option>
                    <option value={3}>Hoàn thành</option>
                    <option value={4}>Bị hủy</option>
                </select>
            </div>

            <div className='blogAllWrap'>
                {state.allBookings?.map((i, index) => {
                    return (
                        <form onSubmit={(e) => updateBooking(e, i._id)} key={i._id} className='blogAllContent' style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={state.mainIndex !== null && state.mainIndex !== index ? { pointerEvents: "none" } : null}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, pointerEvents: state.wantUpdate ? null : "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <input defaultValue={i.name} onChange={(e) => setState({ updateBookingName: e.target.value })} type="text" className="inputOfBooking" required />
                                        <input defaultValue={i.phone} onChange={(e) => setState({ updateBookingPhone: e.target.value })} type="tel" className="inputOfBooking" required />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <input defaultValue={i.date} onChange={(e) => setState({ updateBookingDate: e.target.value })} type="date" className="inputOfBooking" required />
                                        <input defaultValue={i.time} onChange={(e) => setState({ updateBookingTime: e.target.value })} type="time" className="inputOfBooking" required />
                                    </div>
                                    <textarea defaultValue={i.note} onChange={(e) => setState({ updateBookingNote: e.target.value })} typeof="text" style={{ width: "100%", height: 150 }} className="inputOfBooking" />
                                </div>
                            </div>
                            {state.wantCancel && index === state.mainIndex ? (
                                <input value={state.cancelReason} onChange={(e) => setState({ cancelReason: e.target.value })} style={{ width: "100%" }} type="text" className="inputOfBooking" placeholder="Lý do hủy..." />
                            ) : null}
                            {state.wantDone && index === state.mainIndex ? (
                                <input value={state.priceDone} onChange={(e) => setState({ priceDone: e.target.value })} style={{ width: "100%" }} type="number" className="inputOfBooking" placeholder="Nhập số tiền thanh toán..." />
                            ) : null}
                            {state.checkPriceDone && index === state.mainIndex ? (
                                <p style={{ fontFamily: "Oswald", fontWeight: 400, color: "tomato", letterSpacing: 1, margin: 0, paddingLeft: 5 }}>Nhập số tiền thanh toán!</p>
                            ) : null}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: window.innerWidth <= 991 ? "column-reverse" : null, gap: window.innerWidth <= 991 ? 10 : null, pointerEvents: state.mainIndex !== null && state.mainIndex !== index ? "none" : null }}>
                                <button type="button" onClick={() => setState(state.moreSamples && state.mainIndex2 === index ? { moreSamples: false, mainIndex2: null } : { moreSamples: true, mainIndex2: index })} className="openMoreSamples"><span style={state.moreSamples && state.mainIndex2 === index ? { rotate: "90deg" } : null} >➤</span> {i.samples.length} hình mẫu</button>
                                {i.status === 4 && index === state.mainIndex ? (
                                    <div className="cancelReasonText">Lý do: <span>{i.cancelReason && i.cancelReason !== "" ? i.cancelReason : "Không rõ"}</span></div>
                                ) : null}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {i.status === 3 ? (
                                        <div className="totalPriceBooking">Tổng tiền : <span style={{ color: "#fff" }}>{VND.format(i.totalPrice)}</span></div>
                                    ) : null}
                                    {state.wantDone && index === state.mainIndex ? (
                                        <>
                                            <button type="button" onClick={() => doneBooking(i._id, i.phone)} style={{ background: "#ffc700" }} className="yesNoButton">Xong</button>
                                            <button type="button" onClick={() => setState({ wantDone: false, mainIndex: null, checkPriceDone: false, priceDone: "" })} style={{ background: "gray" }} className="yesNoButton">Bỏ</button>
                                        </>
                                    ) : null}
                                    {i.status === 2 && !state.wantCancel && !state.wantUpdate && !state.wantDone ? (
                                        <button type="button" onClick={() => setState({ wantDone: true, mainIndex: index })} style={{ background: "#ffc700" }} className="yesNoButton">Hoàn thành</button>
                                    ) : null}
                                    {i.status === 1 && !state.wantCancel && !state.wantUpdate ? (
                                        <button type="button" onClick={() => confirmBooking(i._id, i.phone)} style={{ background: "#09c167" }} className="yesNoButton">Xác nhận</button>
                                    ) : null}
                                    {(i.status === 1 || i.status === 2) && !state.wantCancel && !state.wantUpdate && !state.wantDone ? (
                                        <>
                                            <button type="button" onClick={() => setState({ wantCancel: true, mainIndex: index })} style={{ background: "#e13534" }} className="yesNoButton">Hủy</button>
                                            <button type="button" onClick={() => setState({ wantUpdate: true, mainIndex: index })} style={{ background: "#096fad" }} className="yesNoButton">Cập nhật</button>
                                        </>
                                    ) : null}
                                    {state.wantCancel && index === state.mainIndex ? (
                                        <>
                                            <button type="button" onClick={() => cancelBooking(i._id, i.phone)} style={{ background: "#e13534" }} className="yesNoButton">Xong</button>
                                            <button type="button" onClick={() => setState({ wantCancel: false, mainIndex: null })} style={{ background: "gray" }} className="yesNoButton">Bỏ</button>
                                        </>
                                    ) : null}
                                    {state.wantUpdate && index === state.mainIndex ? (
                                        <>
                                            <button type="submit" style={{ background: "#e13534" }} className="yesNoButton">Xong</button>
                                            <button type="button" onClick={() => setState({ wantUpdate: false, mainIndex: null })} style={{ background: "gray" }} className="yesNoButton">Bỏ</button>
                                        </>
                                    ) : null}
                                    {(i.status === 1 || i.status === 2) ? (
                                        <button type="button" onClick={() => setState({ modalOpen2: true, modalData3: i })} style={{ pointerEvents: i.samples.length >= 5 ? "none" : null, opacity: i.samples.length >= 5 ? 0.5 : null }} className="yesForm yesNoButton">+ Thêm</button>
                                    ) : null}
                                </div>
                            </div>
                            {state.moreSamples && state.mainIndex2 === index ? (
                                <>
                                    {i.samples.filter(item => item.type === 1).length > 0 ? (
                                        <>
                                            <div className="textUnderMoreSamples">Mẫu có sẵn</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                {i.samples.filter(item => item.type === 1).map((u) => {
                                                    return (
                                                        <Fragment key={u.id}>
                                                            {state?.allSamples.filter(item2 => item2._id === u.id).map((y) => {
                                                                return (
                                                                    <button type="button" id="clickModal" onClick={() => setState({ modalOpen: true, modalData: y, modalData2: u, modalData3: i })} key={y._id} className="samplesImage"><img alt="" src={y.thumbnail} /></button>
                                                                )
                                                            })}
                                                        </Fragment>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    ) : null}
                                    {i.samples.filter(item => item.type === 2).length > 0 ? (
                                        <>
                                            <div className="textUnderMoreSamples" style={{ marginTop: 10 }}>Mẫu tự thêm</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                {i.samples.filter(item => item.type === 2).map((u) => {
                                                    return (
                                                        <button type="button" key={u.id} onClick={() => setState({ modalOpen3: true, modalDataX: u, modalData3: i })} className="samplesImage"><img alt="" src={u.image} /></button>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    ) : null}
                                </>
                            ) : null}
                            <p className='textDate'>{new Date(i.createdAt).toLocaleString()} - <span style={i.status === 1 ? { color: "#fff" } : i.status === 2 ? { color: "#09c167" } : i.status === 3 ? { color: "#e4c342" } : { color: "#e13534" }}>{i.status === 1 ? "⚪ Đang chờ" : i.status === 2 ? "🟢 Xác nhận" : i.status === 3 ? "🟡 Hoàn thành" : "🔴 Bị hủy"}</span></p>
                        </form>
                    )
                })}
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={state.pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                marginPagesDisplayed={2}
                containerClassName="pagination justify-content-center text-nowrap"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage.current - 1}
            />
            <BookingType1Modal state={state} setState={setState} axios={axios} getBooking={getBooking} toast={toast} toastNow={toastNow} ToastUpdate={ToastUpdate} />
            <BookingType2Modal state={state} setState={setState} axios={axios} getBooking={getBooking} toast={toast} toastNow={toastNow} ToastUpdate={ToastUpdate} />
            <AddType2Booking state={state} setState={setState} getBooking={getBooking} toast={toast} toastNow={toastNow} ToastUpdate={ToastUpdate} axios={axios} useRef={useRef} useEffect={useEffect} ReactPaginate={ReactPaginate} />
        </>
    )
}
export default BookingTabs