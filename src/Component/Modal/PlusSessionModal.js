import Modal from "react-responsive-modal"
import 'react-responsive-modal/styles.css';

function PlusSessionModal({ state, setState }) {
    const dataArray = state.modalType === 2 ? state.sessionAdd : state.modalType === 4 ? state.updateSessionAdd : null
    function addSession(e) {
        e.preventDefault()
        if (state.modalType === 1) {
            if (!state.price && state.sessionPrice) {
                setState({ warningAddSession: "Điền giá tổng trước!" })
                return false
            }
            const biggy = state.sessionAdd.reduce((acc, o) => {
                var sum = null
                if (o.price) {
                    sum = acc + parseInt(o.price)
                }
                return sum
            }, 0)
            if (state.sessionPrice && biggy + parseInt(state.sessionPrice) > parseInt(state.price)) {
                setState({ warningAddSession: "Giá buổi lớn hơn giá tổng!" })
                return false
            }
            const chooseThis = state.sessionAdd
            const data = { title: state.sessionTitle, price: state.sessionPrice, time: state.sessionTime, content: state.sessionContent }
            chooseThis.push(data)
            setState({ sessionAdd: chooseThis, modalOpen: false, modalType: null, sessionTitle: null, sessionPrice: null, sessionTime: null, sessionContent: null, warningAddSession: null })
        } else if (state.modalType === 3) {
            if (!state.modalData?.price && state.sessionPrice) {
                if (!state.updatePrice) {
                    setState({ warningAddSession2: "Điền giá tổng trước!" })
                    return false
                }
            }
            const biggy = state.updateSessionAdd.reduce((acc, o) => {
                var sum = null
                if (o.price) {
                    sum = acc + parseInt(o.price)
                }
                return sum
            }, 0)
            if (state.sessionPrice && state.modalData?.price && !state.updatePrice) {
                if (biggy + parseInt(state.sessionPrice) > state.modalData?.price) {
                    setState({ warningAddSession2: "Giá buổi lớn hơn giá tổng!" })
                    return false
                }
            } else if (state.sessionPrice && state.updatePrice) {
                if (biggy + parseInt(state.sessionPrice) > state.updatePrice) {
                    setState({ warningAddSession2: "Giá buổi lớn hơn giá tổng!" })
                    return false
                }
            }
            const chooseThis = state.updateSessionAdd
            const data = { title: state.sessionTitle, price: state.sessionPrice, time: state.sessionTime, content: state.sessionContent }
            chooseThis.push(data)
            setState({ updateSessionAdd: chooseThis, modalOpen: false, modalType: null, sessionTitle: null, sessionPrice: null, sessionTime: null, sessionContent: null, warningAddSession2: null })
        }
    }

    function updateSession(e) {
        e.preventDefault()
        const biggy = dataArray.reduce((acc, o) => {
            var sum = null
            if (o.price) {
                sum = acc + parseInt(o.price)
            }
            return sum
        }, 0)
        if (state.modalType === 2) {
            if (biggy > parseInt(state.price)) {
                setState({ warningUpdateSession: "Giá buổi lớn hơn giá tổng!" })
                return false
            }
            setState({ sessionAdd: dataArray, modalOpen: false, warningUpdateSession: null, modalData: null, modalData2: null, modalIndex: null, modalType: null })
        }
        if (state.modalType === 4) {
            if (state.modalData2?.price && !state.updatePrice && biggy > parseInt(state.modalData2?.price)) {
                setState({ warningUpdateSession2: "Giá buổi lớn hơn giá tổng!" })
                return false
            }
            if (state.updatePrice && biggy > parseInt(state.modalData2?.price)) {
                setState({ warningUpdateSession2: "Giá buổi lớn hơn giá tổng!" })
                return false
            }
            setState({ updateSessionAdd: dataArray, modalOpen: false, warningUpdateSession2: null, modalData: null, modalData2: null, modalIndex: null, modalType: null })
        }
    }

    return (
        <Modal open={state.modalOpen} onClose={() => setState({ modalOpen: false, modalData: null, modalData2: null, modalIndex: null, modalType: null })} center>
            <h4 className='modalTitle'>{state.modalType === 1 || state.modalType === 3 ? "Thêm buổi cho hình xăm" : "Cập nhật buổi xăm"}</h4>
            {state.modalType === 1 || state.modalType === 3 ? (
                <form onSubmit={(e) => addSession(e)}>
                    <div className="inputPassword">
                        <input style={{ width: "100%" }} value={state.sessionTitle} onChange={(e) => setState({ sessionTitle: e.target.value })} className="inputWeird" placeholder="Tiêu đề..." required />
                    </div>
                    <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0 }}>* Lưu ý : Để trống giá sẽ thành <a href="tel:+8400000000" style={{ textDecoration: "none", color: "#904d03" }}>liên hệ</a></p>
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} value={state.sessionPrice} onChange={(e) => setState({ sessionPrice: e.target.value })} className="inputWeird" placeholder="Giá cả...." />
                    </div>
                    {state.warningAddSession && state.modalType === 1 ? (
                        <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>{state.warningAddSession}</p>
                    ) : null}
                    {state.warningAddSession2 && state.modalType === 3 ? (
                        <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>{state.warningAddSession2}</p>
                    ) : null}
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} value={state.sessionTime} onChange={(e) => setState({ sessionTime: e.target.value })} className="inputWeird" placeholder="Thời gian..." required />
                    </div>
                    <div className="inputPassword">
                        <textarea style={{ width: "100%" }} value={state.sessionContent} onChange={(e) => setState({ sessionContent: e.target.value })} className="inputWeird" placeholder="Mô tả...." required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                        <button type='submit' className='yesForm yesNoButton'>Thêm</button>
                        <button type='button' onClick={() => setState({ modalOpen: false, sessionTitle: null, sessionPrice: null, sessionTime: null, sessionContent: null, warningAddSession: null, warningAddSession2: null })} className='noForm yesNoButton'>Hủy</button>
                    </div>
                </form>
            ) : state.modalType === 2 || state.modalType === 4 ? (
                <form onSubmit={(e) => updateSession(e)}>
                    <div className="inputPassword">
                        <input style={{ width: "100%" }} defaultValue={state.modalData?.title} onChange={(e) => dataArray[state.modalIndex].title = e.target.value} className="inputWeird" placeholder="Tiêu đề..." required />
                    </div>
                    <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0 }}>* Lưu ý : Để trống giá sẽ thành <a href="tel:+8400000000" style={{ textDecoration: "none", color: "#904d03" }}>liên hệ</a></p>
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} onChange={(e) => dataArray[state.modalIndex].price = e.target.value} defaultValue={state.modalData?.price} className="inputWeird" placeholder="Giá cả...." />
                    </div>
                    {state.warningUpdateSession ? (
                        <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>{state.warningUpdateSession}</p>
                    ) : null}
                    {state.warningUpdateSession2 ? (
                        <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>{state.warningUpdateSession2}</p>
                    ) : null}
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} defaultValue={state.modalData?.time} onChange={(e) => dataArray[state.modalIndex].time = e.target.value} className="inputWeird" placeholder="Thời gian..." required />
                    </div>
                    <div className="inputPassword">
                        <textarea style={{ width: "100%" }} defaultValue={state.modalData?.content} onChange={(e) => dataArray[state.modalIndex].content = e.target.value} className="inputWeird" placeholder="Mô tả...." required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                        <button type='submit' className='yesForm yesNoButton'>Xong</button>
                        <button type='button' onClick={() => setState({ modalOpen: false, modalData: null, modalData2: null, modalIndex: null, warningUpdateSession: null, warningUpdateSession2: null, modalType: null })} className='noForm yesNoButton'>Hủy</button>
                    </div>
                </form>
            ) : null}
        </Modal>
    )
}
export default PlusSessionModal