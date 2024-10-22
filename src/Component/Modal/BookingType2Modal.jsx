import { LazyLoadImage } from "react-lazy-load-image-component";
import Modal from "react-responsive-modal"

function BookingType2Modal({ state, setState, axios, getBooking, toast, toastNow, ToastUpdate }) {
    function updateBookingSessionPrice(e) {
        e.preventDefault()
        var realSession = state.sessionFix
        if (state.sessionFix.length < 1) {
            realSession = state?.modalDataX?.payingSession
        }
        var valueArr = realSession.map(function (item) { return item.title });
        var isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) !== idx
        });
        if (isDuplicate) {
            return setState({ checkTitle: true })
        }
        if (realSession.reduce((acc, curr) => { return acc + parseInt(curr.price) }, 0) > state.modalDataX?.price) {
            return setState({ warningOverPrice: true })
        }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateBookingSessionPrice2`,
            data: {
                bookingId: state.modalData3?._id,
                sessionId: state.modalDataX?.id,
                realSession: realSession
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then(() => {
            setState({ modalOpen3: false, modalData: null, modalData3: null, wantChangeSessionPrice: false, indexSessionPrice: null, sessionFix: [], checkTitle: false, warningOverPrice: false })
            getBooking()
            ToastUpdate({ type: 1, message: "Cập nhật hình mẫu thành công!", refCur: toastNow.current })
        })
    }

    function updateMainDish(e) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateBookingMainDish`,
            data: {
                bookingId: state.modalData3?._id,
                sessionId: state.modalDataX?.id,
                title: state.updateTitle,
                price: state.updatePrice,
                image: state.addImage
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ modalOpen3: false, modalData: null, modalData3: null, wantChangeMainDish: false, updateTitle: "", updatePrice: "", addImage: null })
            getBooking()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function convertToBase64(e) {
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setState({ addImage: reader.result })
            };
            reader.onerror = (err) => {
                console.log(err);
            }
        }
    }

    function deleteMainDish() {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/DeleteBookingMainDish`,
            data: {
                bookingId: state.modalData3?._id,
                sessionId: state.modalDataX?.id,
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ modalOpen3: false, modalDataX: null, modalData3: null, wantChangeSessionPrice: false, indexSessionPrice: null, sessionFix: [], checkTitle: false, wantChangeMainDish: false, updateTitle: "", updatePrice: "", addImage: null })
            getBooking()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function updatePayingPrice(indexS, type, e) {
        const data = state?.modalDataX?.payingSession
        if (type === 1) {
            data[indexS].title = e
        }
        if (type === 2) {
            data[indexS].time = e
        }
        if (type === 3) {
            data[indexS].content = e
        }
        if (type === 4) {
            data[indexS].price = e
        }
        if (type === 5) {
            data[indexS].hasPaying = e
        }
        setState({ sessionFix: data })
    }

    function updateType2Session(indexS, type, e) {
        const data = state.sessionFix
        if (type === 1) {
            data[indexS].title = e
        }
        if (type === 2) {
            data[indexS].time = e
        }
        if (type === 3) {
            data[indexS].content = e
        }
        if (type === 4) {
            data[indexS].price = e
        }
        setState({ sessionFix: data })
    }

    function addType2Session() {
        const data = state.sessionFix
        const dataPush = { title: "", time: "", content: "", price: "", hasPaying: 0 }
        data.push(dataPush)
        setState({ sessionFix: data })
    }

    function deleteType2Session(e) {
        const data = state.sessionFix
        data.splice(e, 1)
        setState({ sessionFix: data })
    }
    return (
        <Modal open={state.modalOpen3} onClose={() => setState({ modalOpen3: false, modalDataX: null, modalData3: null, wantChangeSessionPrice: false, indexSessionPrice: null, sessionFix: [], checkTitle: false, wantChangeMainDish: false, updateTitle: "", updatePrice: "", addImage: null, warningOverPrice: false, })} center>
            <h4 className='modalTitle'>Chi tiết buổi xăm</h4>
            <div className='fatherAddType2'>
                <form onSubmit={(e) => updateMainDish(e)} style={{ marginBottom: 15 }}>
                    <div className='addType2'>
                        <div className='addType2FirstChild'>
                            <div style={{ fontFamily: "Oswald", color: "#fff", width: "100%" }} className="coverWithHonor">
                                <label htmlFor="labelTitle" style={{ textWrap: "nowrap" }}>Tiêu đề</label>:
                                {state.wantChangeMainDish ? (
                                    <input autoComplete="off" id="labelTitle" type='text' defaultValue={state?.modalDataX?.title} onChange={(e) => setState({ updateTitle: e.target.value })} placeholder='Nhập tiêu đề...' required />
                                ) : (
                                    <input disabled id="labelTitle" type='text' defaultValue={state?.modalDataX?.title} placeholder='Nhập tiêu đề...' />
                                )}
                            </div>
                            <div style={{ fontFamily: "Oswald", color: "#fff", justifyContent: "flex-start", width: "100%" }} className="coverWithHonor">
                                <label htmlFor="labelTitle">Giá</label>:
                                {state.wantChangeMainDish ? (
                                    <input autoComplete="off" type='number' defaultValue={state?.modalDataX?.price} onChange={(e) => setState({ updatePrice: e.target.value })} placeholder='Nhập giá...' />
                                ) : (
                                    <input disabled type='text' defaultValue={state?.modalDataX?.price} placeholder='Nhập giá...' />
                                )}
                            </div>
                            <p style={{ fontFamily: "Oswald", fontWeight: 400, letterSpacing: 1, color: "#999", margin: 0, fontSize: 14 }}><b>Lưu ý</b>: Để trống giá sẽ thành liên hệ!</p>
                        </div>
                        {state.modalData3?.status === 1 || state.modalData3?.status === 2 ? (
                            <div style={state.wantChangeMainDish ? null : { pointerEvents: "none" }} className='addType2SecondChild'>
                                <LazyLoadImage alt='Image' src={state.addImage ? state.addImage : state.modalDataX?.image} />
                                <svg className='hoverSvgXXX' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                <input onChange={convertToBase64} type='file' />
                            </div>
                        ) : state.modalData3?.status === 3 || state.modalData3?.status === 4 ? (
                            <a href={state.modalDataX?.image} className="addType2SecondChild2">
                                <LazyLoadImage alt='Image' src={state.modalDataX?.image} />
                            </a>
                        ) : null}
                    </div>
                    {state.modalData3?.status === 1 || state.modalData3?.status === 2 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, margin: "5px 0 0 0" }}>
                            {!state.wantChangeMainDish && !state.wantDeleteMainDish ? (
                                <>
                                    <button onClick={() => setState({ wantChangeMainDish: true })} type='button' className='plusSessionType2'>Cập nhật</button>
                                    <button onClick={() => setState({ wantDeleteMainDish: true })} style={{ background: "tomato" }} type='button' className='plusSessionType2'>Xóa</button>
                                </>
                            ) : null}
                            {state.wantChangeMainDish ? (
                                <>
                                    <button type='submit' className='plusSessionType2'>Xong</button>
                                    <button onClick={() => setState({ wantChangeMainDish: false, updateTitle: "", updatePrice: "", addImage: null })} type='button' style={{ background: "gray" }} className='plusSessionType2'>Hủy</button>
                                </>
                            ) : null}
                            {state.wantDeleteMainDish ? (
                                <>
                                    <button onClick={() => deleteMainDish()} type='button' style={{ background: "tomato" }} className='plusSessionType2'>Xóa</button>
                                    <button onClick={() => setState({ wantDeleteMainDish: false })} type='button' style={{ background: "gray" }} className='plusSessionType2'>Hủy</button>
                                </>
                            ) : null}
                        </div>
                    ) : null}
                </form>
                {state?.modalDataX?.payingSession.length > 0 ? (
                    <>
                        {state?.modalDataX?.payingSession.map((i, index) => {
                            return (
                                <form onSubmit={((e) => updateBookingSessionPrice(e))} key={index} className="detailSession" style={{ marginTop: index > 0 ? 15 : null }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: window.innerWidth <= 991 ? "column" : null, gap: window.innerWidth <= 991 ? 10 : null, marginBottom: 15 }}>
                                        <div className="coverWithHonor">
                                            <label htmlFor="labelTitle">Tiêu đề</label>:
                                            {state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                                <input onChange={(e) => updatePayingPrice(index, 1, e.target.value)} id="labelTitle" type='text' defaultValue={i.title} placeholder='Nhập tiêu đề...' required />
                                            ) : (
                                                <input disabled id="labelTitle" type='text' defaultValue={i.title} placeholder='Nhập tiêu đề...' />
                                            )}
                                        </div>
                                        <div className="coverWithHonor">
                                            <label htmlFor="labelTitle">Thời gian</label>:
                                            {state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                                <input onChange={(e) => updatePayingPrice(index, 2, e.target.value)} type='text' defaultValue={i.time} placeholder='Nhập thời gian...' required />
                                            ) : (
                                                <input disabled type='text' defaultValue={i.time} placeholder='Nhập thời gian...' />
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: window.innerWidth <= 991 ? "column" : null, gap: window.innerWidth <= 991 ? 10 : null, marginBottom: 15 }}>
                                        <div className="coverWithHonor">
                                            <label htmlFor="labelTitle">Nội dung</label>:
                                            {state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                                <input onChange={(e) => updatePayingPrice(index, 3, e.target.value)} type='text' defaultValue={i.content} placeholder='Nhập nội dung...' required />
                                            ) : (
                                                <input disabled type='text' defaultValue={i.content} placeholder='Nhập nội dung...' />
                                            )}
                                        </div>
                                        <div className="coverWithHonor">
                                            <label htmlFor="labelTitle">Giá</label>:
                                            {state.wantChangeSessionPrice && state.indexSessionPrice === index && state.modalDataX?.price ? (
                                                <input onChange={(e) => updatePayingPrice(index, 4, e.target.value)} type='number' defaultValue={i.price} placeholder={state.modalDataX?.price ? 'Nhập giá...' : 'Nhập giá tổng!'} />
                                            ) : (
                                                <input disabled type='number' defaultValue={i.price} placeholder={state.modalDataX?.price ? 'Nhập giá...' : 'Nhập giá tổng!'} />
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: window.innerWidth <= 991 ? "column" : null, gap: window.innerWidth <= 991 ? 10 : null, }}>
                                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                            <b>Đã thanh toán</b> :
                                            {state.wantChangeSessionPrice && state.indexSessionPrice === index ? (
                                                <input onChange={(e) => updatePayingPrice(index, 5, e.target.value)} defaultValue={i.hasPaying} className="inputPayingPrice" required />
                                            ) : (
                                                <input disabled defaultValue={i.hasPaying} className="inputPayingPrice" />
                                            )}
                                            / <p style={state.modalDataX?.price && state.modalDataX?.price <= i.hasPaying ? { color: "#09c167" } : { color: "#e13534" }}>{i.price ? i.price : "Liên hệ"}</p>
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
                                    </div>
                                </form>
                            )
                        })}
                        {state.checkTitle ? (
                            <p style={{ fontFamily: "Oswald", fontWeight: 400, letterSpacing: 1, color: "tomato", margin: 0, fontSize: 14, textAlign: "center" }}>Tiêu đề bị trùng!</p>
                        ) : state.warningOverPrice ? (
                            <p style={{ fontFamily: "Oswald", fontWeight: 400, letterSpacing: 1, color: "tomato", margin: 0, fontSize: 14, textAlign: "center" }}>Giá buổi cao hơn giá tổng!</p>
                        ) : null}
                    </>
                ) : (
                    <div className='fatherAddType2'>
                        <form onSubmit={(e) => updateBookingSessionPrice(e)}>
                            <div style={{ textAlign: "end", marginTop: 10 }}>
                                <button onClick={() => addType2Session()} type='button' className='plusSessionType2'>+ Buổi</button>
                            </div>
                            <div className='sessionOnOver'>
                                {state.sessionFix.length > 0 ? (
                                    state.sessionFix.map((i, indexS) => {
                                        return (
                                            <div key={indexS} className='sessionOnOverX'>
                                                <div className='sessionOnOverChild'>
                                                    <input defaultValue={i.title} onChange={(e) => updateType2Session(indexS, 1, e.target.value)} placeholder='Tiêu đề buổi...' required />
                                                    <input defaultValue={i.time} onChange={(e) => updateType2Session(indexS, 2, e.target.value)} placeholder='Thời gian...' required />
                                                    <input defaultValue={i.content} onChange={(e) => updateType2Session(indexS, 3, e.target.value)} placeholder='Nội dung...' required />
                                                    <input style={{ pointerEvents: state.modalDataX?.price ? null : "none" }} defaultValue={i.price} onChange={(e) => updateType2Session(indexS, 4, e.target.value)} placeholder={state.modalDataX?.price ? 'Nhập giá...' : 'Nhập giá tổng!'} />
                                                </div>
                                                <button type='button' onClick={() => deleteType2Session(indexS)} className='deleteSessionType2Add'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                                </button>
                                            </div>
                                        )
                                    })
                                ) : null}
                            </div>
                            {state.checkTitle ? (
                                <p style={{ fontFamily: "Oswald", fontWeight: 400, letterSpacing: 1, color: "tomato", margin: 0, fontSize: 14, textAlign: "center" }}>Tiêu đề bị trùng!</p>
                            ) : null}
                            {state.sessionFix.length > 0 ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                                    <button type='submit' className='yesForm yesNoButton'>Xong</button>
                                    <button type='button' onClick={() => setState({ modalOpen3: false, modalDataX: null, modalData3: null, sessionFix: [], checkTitle: false })} className='noForm yesNoButton'>Hủy</button>
                                </div>
                            ) : null}
                        </form>
                    </div>
                )}
            </div>
        </Modal>
    )
}
export default BookingType2Modal