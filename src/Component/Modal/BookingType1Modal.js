import Modal from "react-responsive-modal"

function BookingType1Modal({ state, setState, axios, getBooking, toast, toastNow, ToastUpdate }) {
    function updateBookingSessionPrice(e, sessionId, realSession) {
        e.preventDefault()
        const dataPush = { sessionTitle: sessionId, price: state.payingPrice }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateBookingSessionPrice`,
            data: {
                bookingId: state.modalData3?._id,
                sessionId: state.modalData2?.id,
                price: dataPush,
                realSession: realSession
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then(() => {
            setState({ modalOpen: false, modalData: null, modalData2: null, modalData3: null, payingPrice: null, wantChangeSessionPrice: false, indexSessionPrice: null })
            getBooking()
            ToastUpdate({ type: 1, message: "Cập nhật giá thành công!", refCur: toastNow.current })
        })
    }
    const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);
    return (
        <Modal open={state.modalOpen} onClose={() => setState({ modalOpen: false, modalData: null, modalData2: null, modalData3: null, payingPrice: null, wantChangeSessionPrice: false, indexSessionPrice: null })} center>
            <h4 className='modalTitle'>Chi tiết buổi xăm</h4>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, fontFamily: "Oswald", color: "#fff" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "73%", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <b style={{ fontSize: 17 }}>Tiêu đề</b> : <p style={{ margin: 0, color: "#999", fontWeight: 400, wordBreak: "break-all" }}>{state?.modalData?.title}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <b style={{ fontSize: 17 }}>Giá</b> : <p style={{ margin: 0, color: "#999", fontWeight: 400, wordBreak: "break-all" }}>{state.modalData?.price ? state.modalData?.price : "Liên hệ"}</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                            <b style={{ fontSize: 17 }}>Tiêu đề phụ</b> : <p style={{ margin: 0, color: "#999", fontWeight: 400, wordBreak: "break-all" }}>{state?.modalData?.content}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <b style={{ fontSize: 17 }}>Đánh giá</b> : <p className="rateXXX">{state.modalData?.rate.count === 0 ? rating(5) : rating(state.modalData?.session.rate.count)}</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                        <b style={{ fontSize: 17 }}>Danh mục</b> : <p style={{ margin: 0, color: "#999", fontWeight: 400, wordBreak: "break-all" }}>{state?.modalData?.categories.data.reduce((acc, curr) => { return `${acc + curr.cate}, `.replace("0", "") }, 0)}</p>
                    </div>
                </div>
                <a href={state.modalData?.thumbnail} style={{ width: "25%", height: 125, overflow: "hidden", borderRadius: 6 }}>
                    <img alt='' src={state.modalData?.thumbnail} width={"100%"} height={"100%"} />
                </a>
            </div>
            {state.modalData?.session.data.map((i, index) => {
                return (
                    <div key={index} className="detailSession" style={{ marginTop: index > 0 ? 15 : null }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <b>Tiêu đề</b> : <p>{i.title}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <b>Thời gian</b> : <p>{i.time} giờ</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
                            <div style={{ display: "flex", gap: 5 }}>
                                <b style={{ textWrap: "nowrap" }}>Nội dung</b> : <p>{i.content}</p>
                            </div>
                            <div style={{ display: "flex", gap: 5 }}>
                                <b>Giá</b> : <p>{i.price ? i.price : "Liên hệ"}</p>
                            </div>
                        </div>
                        <form onSubmit={((e) => updateBookingSessionPrice(e, i.title, state?.modalData2?.payingSession))} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                <b>Đã thanh toán</b> :
                                {state?.modalData2?.payingSession?.filter(item => item.sessionTitle === i.title).length > 0 ? (
                                    state?.modalData2?.payingSession?.filter(item => item.sessionTitle === i.title).map((r) => {
                                        return (
                                            state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                                <input key={r} onChange={(e) => setState({ payingPrice: e.target.value })} defaultValue={r.price} className="inputPayingPrice" required />
                                            ) : (
                                                <input key={r} disabled onChange={(e) => setState({ payingPrice: e.target.value })} defaultValue={r.price} className="inputPayingPrice" />
                                            )
                                        )
                                    })
                                ) : (
                                    state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                        <input onChange={(e) => setState({ payingPrice: e.target.value })} defaultValue={0} className="inputPayingPrice" required />
                                    ) : (
                                        <input disabled onChange={(e) => setState({ payingPrice: e.target.value })} defaultValue={0} className="inputPayingPrice" />
                                    )
                                )}
                                / <p style={i.price && i.price === state.modalData2?.payingSession?.reduce((acc, curr) => { return acc + parseInt(curr.price) }, 0) ? { color: "#09c167" } : { color: "#e13534" }}>{i.price ? i.price : "Liên hệ"}</p>
                            </div>
                            {state.modalData3?.status === 1 || state.modalData3?.status === 2 ? (
                                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                    {!state.wantChangeSessionPrice && state.indexSessionPrice !== index ? (
                                        <button type="button" onClick={() => setState({ wantChangeSessionPrice: true, indexSessionPrice: index })} className="functionToSession" title="Cập nhật giá">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                        </button>
                                    ) : null}
                                    {state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                        <>
                                            <button type="submit" className="functionToSession" title="Xác nhận">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 576 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                                            </button>
                                            <button type="button" onClick={() => setState({ wantChangeSessionPrice: false, indexSessionPrice: null })} className="functionToSession" title="Hủy">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -30 576 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            ) : null}
                        </form>
                    </div>
                )
            })}
        </Modal>
    )
}
export default BookingType1Modal