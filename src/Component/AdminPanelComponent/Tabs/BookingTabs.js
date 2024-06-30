import { Fragment, useReducer } from "react"
import SearchBar from "./SearchBar"
import ReactPaginate from 'react-paginate';
import socketIOClient from "socket.io-client";

function BookingTabs({ axios, toast, ToastUpdate, useRef, useEffect, token }) {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        search: "",
        cancelReason: "",
        addImage: null,
        allBookings: null,
        allSamples: null,
        contentSearch: null,
        pageCount: 6,
        moreSamples: false,
        wantCancel: false,
        filter: 0
    })
    const toastNow = useRef(null)
    const socketRef = useRef();
    const currentPage = useRef();
    const limit = 4

    useEffect(() => {
        currentPage.current = 1
        getBooking()
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('ConfirmBookingSuccess', data => {
            if (token.userId === data.adminId) {
                getBooking()
                ToastUpdate({ type: 1, message: "Xác nhận thành công!", refCur: toastNow.current })
            }
        })

        socketRef.current.on('CancelBookingByAdminSuccess', data => {
            if (token.userId === data.adminId) {
                getBooking()
                ToastUpdate({ type: 1, message: "Hủy booking thành công!", refCur: toastNow.current })
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch, state.filter])

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

    function convertToBase64(e, id) {
        toastNow.current = toast.loading("Chờ một chút...")
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                const configuration = {
                    method: "post",
                    url: `${process.env.REACT_APP_apiAddress}/api/v1/AddSamplesToBooking`,
                    data: {
                        id: id,
                        samples: reader.result
                    }
                }
                axios(configuration).then((res) => {
                    getBooking()
                    ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
                }).catch((err) => {
                    ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
                })
            };
            reader.onerror = (err) => {
                console.log(err);
            }
        }
    }

    function confirmBooking(id) {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { bookingId: id, adminId: token.userId }
        socketRef.current.emit('ConfirmBooking', data)
    }

    function cancelBooking(id) {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { bookingId: id, adminId: token.userId, reason: state.cancelReason }
        socketRef.current.emit('CancelBookingByAdmin', data)
    }
    return (
        <>
            <div className="topBlobTaps">
                <SearchBar state={state} setState={setState} useEffect={useEffect} />
                <select onChange={(e) => setState({ filter: e.target.value })}>
                    <option value={null} hidden>Lọc kết quả</option>
                    <option value={1}>Đang chờ</option>
                    <option value={2}>Xác nhận</option>
                    <option value={3}>Hoàn thành</option>
                    <option value={4}>Bị hủy</option>
                </select>
            </div>

            <div className='blogAllWrap'>
                {state.allBookings?.map((i) => {
                    return (
                        <div key={i._id} className='blogAllContent' style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <input defaultValue={i.name} type="text" className="inputOfBooking" />
                                    <input defaultValue={i.phone} type="tel" className="inputOfBooking" />
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <input defaultValue={i.date} type="date" className="inputOfBooking" />
                                    <input defaultValue={i.time} type="time" className="inputOfBooking" />
                                </div>
                                <textarea defaultValue={i.note} typeof="text" style={{ width: "100%", height: 150 }} className="inputOfBooking" />
                            </div>
                            {state.wantCancel ? (
                                <input value={state.cancelReason} onChange={(e) => setState({ cancelReason: e.target.value })} style={{ width: "100%" }} type="text" className="inputOfBooking" placeholder="Lý do hủy..." />
                            ) : null}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <button onClick={() => setState(state.moreSamples ? { moreSamples: false } : { moreSamples: true })} className="openMoreSamples"><span style={state.moreSamples ? { rotate: "90deg" } : null} >➤</span> {i.samples.length} hình mẫu</button>
                                {i.status === 4 ? (
                                    <div className="cancelReasonText">Lý do: <span>{i.cancelReason && i.cancelReason !== "" ? i.cancelReason : "Không rõ"}</span></div>
                                ) : null}
                                {i.status === 1 || i.status === 2 ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {state.wantCancel ? (
                                            <>
                                                <button onClick={() => cancelBooking(i._id)} style={{ background: "#e13534" }} className="yesNoButton">Xong</button>
                                                <button onClick={() => setState({ wantCancel: false })} style={{ background: "gray" }} className="yesNoButton">Bỏ</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => confirmBooking(i._id)} style={{ background: "#09c167" }} className="yesNoButton">Xác nhận</button>
                                                <button onClick={() => setState({ wantCancel: true })} style={{ background: "#e13534" }} className="yesNoButton">Hủy</button>
                                            </>
                                        )}
                                        <button style={{ position: "relative", pointerEvents: i.samples.length >= 5 ? "none" : null, opacity: i.samples.length >= 5 ? 0.5 : null }} className="yesForm yesNoButton">+ Thêm
                                            <input onChange={(e) => convertToBase64(e, i._id)} style={{ opacity: 0, top: 0, left: 0, position: "absolute", width: "100%", height: "100%", cursor: "pointer" }} type="file" />
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                            {state.moreSamples ? (
                                <>
                                    {i.samples.filter(item => item.type === 1).length > 0 ? (
                                        <div className="textUnderMoreSamples">Mẫu có sẵn</div>
                                    ) : null}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {i.samples.filter(item => item.type === 1).map((u) => {
                                            return (
                                                <Fragment key={u.id}>
                                                    {state?.allSamples.filter(item2 => item2._id === u.id).map((y) => {
                                                        return (
                                                            <a key={y._id} href={y.thumbnail} className="samplesImage"><img alt="" src={y.thumbnail} /></a>
                                                        )
                                                    })}
                                                </Fragment>
                                            )
                                        })}
                                    </div>
                                    {i.samples.filter(item => item.type === 2).length > 0 ? (
                                        <div className="textUnderMoreSamples" style={{ marginTop: 10 }}>Mẫu tự thêm</div>
                                    ) : null}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {i.samples.filter(item => item.type === 2).map((u, indexU) => {
                                            return (
                                                <a key={indexU} href={u.link} className="samplesImage"><img alt="" src={u.link} /></a>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : null}
                            <p className='textDate'>{new Date(i.createdAt).toLocaleString()} - <span style={i.status === 1 ? { color: "#fff" } : i.status === 2 ? { color: "#09c167" } : i.status === 3 ? { color: "#e4c342" } : { color: "#e13534" }}>{i.status === 1 ? "⚪ Đang chờ" : i.status === 2 ? "🟢 Xác nhận" : i.status === 3 ? "🟡 Hoàn thành" : "🔴 Bị hủy"}</span></p>
                        </div>
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
        </>
    )
}
export default BookingTabs