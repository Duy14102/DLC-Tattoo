import { Modal } from 'react-responsive-modal';

function AddType2Booking({ state, setState, getBooking, toast, toastNow, ToastUpdate, axios }) {
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

    function addType2Session() {
        const data = state.sessionType2Add
        const dataPush = { title: "", time: "", content: "", price: "", hasPaying: 0 }
        data.push(dataPush)
        setState({ sessionType2Add: data })
    }

    function deleteType2Session(e) {
        const data = state.sessionType2Add
        data.splice(e, 1)
        setState({ sessionType2Add: data })
    }

    function updateType2Session(indexS, type, e) {
        const data = state.sessionType2Add
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
        setState({ sessionType2Add: data })
    }

    function newSamplesToBooking(e) {
        e.preventDefault()
        if (state.sessionType2Add.reduce((acc, curr) => { return acc + parseInt(curr.price) }, 0) > state.addPrice) {
            return setState({ warningOverPrice: true })
        }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/AddSamplesToBooking`,
            data: {
                id: state?.modalData3._id,
                session: state.sessionType2Add,
                image: state.addImage,
                title: state.addTitle,
                price: state.addPrice
            }
        }
        var valueArr = state.sessionType2Add.map(function (item) { return item.title });
        var isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) !== idx
        });
        if (isDuplicate) {
            return setState({ checkTitle: true })
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            getBooking()
            setState({ modalOpen2: false, addImage: null, addTitle: "", addPrice: "", sessionType2Add: [], modalData3: null, checkTitle: false, warningOverPrice: false })
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <Modal open={state.modalOpen2} onClose={() => setState({ modalOpen2: false, addImage: null, addTitle: "", addPrice: "", sessionType2Add: [], modalData3: null, checkTitle: false, warningOverPrice: false })} center>
            <h4 className='modalTitle'>Thêm hình mẫu</h4>
            <div className='fatherAddType2'>
                <form onSubmit={(e) => newSamplesToBooking(e)}>
                    <div className='addType2'>
                        <div className='addType2FirstChild'>
                            <input type='text' value={state.addTitle} onChange={(e) => setState({ addTitle: e.target.value })} placeholder='Nhập tiêu đề...' required />
                            <input type='number' value={state.addPrice} onChange={(e) => setState({ addPrice: e.target.value })} placeholder='Nhập giá...' />
                            <p style={{ fontFamily: "Oswald", fontWeight: 400, letterSpacing: 1, color: "#999", margin: 0, fontSize: 14 }}><b>Lưu ý</b>: Để trống giá sẽ thành liên hệ!</p>
                        </div>
                        <div className='addType2SecondChild'>
                            {state.addImage ? (
                                <>
                                    <img alt='' src={state.addImage} />
                                    <svg className='hoverSvgXXX' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                </>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                            )}
                            <input type='file' onChange={convertToBase64} required />
                        </div>
                    </div>
                    <div style={{ textAlign: "end", marginTop: 10 }}>
                        <button onClick={() => addType2Session()} type='button' className='plusSessionType2'>+ Buổi</button>
                    </div>
                    <div className='sessionOnOver'>
                        {state.sessionType2Add.length > 0 ? (
                            state.sessionType2Add.map((i, indexS) => {
                                return (
                                    <div key={indexS} className='sessionOnOverX'>
                                        <div className='sessionOnOverChild'>
                                            <input defaultValue={i.title} onChange={(e) => updateType2Session(indexS, 1, e.target.value)} placeholder='Tiêu đề buổi...' required />
                                            <input defaultValue={i.time} onChange={(e) => updateType2Session(indexS, 2, e.target.value)} placeholder='Thời gian...' required />
                                            <input defaultValue={i.content} onChange={(e) => updateType2Session(indexS, 3, e.target.value)} placeholder='Nội dung...' required />
                                            <input style={state.addPrice ? null : { pointerEvents: "none" }} defaultValue={i.price} onChange={(e) => updateType2Session(indexS, 4, e.target.value)} placeholder={state.addPrice ? 'Giá...' : 'Nhập giá tổng!'} />
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
                    ) : state.warningOverPrice ? (
                        <p style={{ fontFamily: "Oswald", fontWeight: 400, letterSpacing: 1, color: "tomato", margin: 0, fontSize: 14, textAlign: "center" }}>Giá buổi cao hơn giá tổng!</p>
                    ) : null}
                    {state.addTitle !== "" && state.addImage && state.sessionType2Add.length > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                            <button type='submit' className='yesForm yesNoButton'>Xong</button>
                            <button type='button' onClick={() => setState({ modalOpen2: false, addImage: null, addTitle: "", addPrice: "", sessionType2Add: [], modalData3: null, checkTitle: false })} className='noForm yesNoButton'>Hủy</button>
                        </div>
                    ) : null}
                </form>
            </div>
        </Modal>
    )
}

export default AddType2Booking