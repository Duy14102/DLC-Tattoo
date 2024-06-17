import Modal from "react-responsive-modal"

function PlusSessionModal({ state, setState }) {
    const dataArray = state.sessionAdd
    function addSession(e) {
        e.preventDefault()
        if (!state.price && state.sessionPrice) {
            setState({ warningAddSession: "Điền giá tổng trước!" })
            return false
        }
        if (state.sessionPrice && parseInt(state.sessionAdd.reduce((acc, o) => { return acc + parseInt(o.price) }, 0)) + parseInt(state.sessionPrice) > parseInt(state.price)) {
            setState({ warningAddSession: "Giá buổi lớn hơn giá tổng!" })
            return false
        }
        const chooseThis = state.sessionAdd
        const data = { title: state.sessionTitle, price: state.sessionPrice, time: state.sessionTime, content: state.sessionContent }
        chooseThis.push(data)
        setState({ sessionAdd: chooseThis, modalOpen: false, sessionTitle: null, sessionPrice: null, sessionTime: null, sessionContent: null, warningAddSession: null })
    }

    function updateSession(e) {
        e.preventDefault()
        if (parseInt(dataArray.reduce((acc, o) => { return acc + parseInt(o.price) }, 0)) > parseInt(state.price)) {
            setState({ warningUpdateSession: "Giá buổi lớn hơn giá tổng!" })
            return false
        }
        setState({ sessionAdd: dataArray, modalOpen: false, warningUpdateSession: null })
    }

    return (
        <Modal open={state.modalOpen} onClose={() => setState({ modalOpen: false, modalData: null, modalIndex: null })} center>
            <h4 className='modalTitle'>{state.modalType === 1 ? "Thêm buổi cho hình xăm" : "Cập nhật buổi xăm"}</h4>
            {state.modalType === 1 ? (
                <form onSubmit={(e) => addSession(e)}>
                    <div className="inputPassword">
                        <input style={{ width: "100%" }} value={state.sessionTitle} onChange={(e) => setState({ sessionTitle: e.target.value })} className="inputWeird" placeholder="Tiêu đề..." required />
                    </div>
                    <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0 }}>* Lưu ý : Để trống giá sẽ thành <a href="tel:+8400000000" style={{ textDecoration: "none", color: "#904d03" }}>liên hệ</a></p>
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} value={state.sessionPrice} onChange={(e) => setState({ sessionPrice: e.target.value })} className="inputWeird" placeholder="Giá cả...." />
                    </div>
                    {state.warningAddSession ? (
                        <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>{state.warningAddSession}</p>
                    ) : null}
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} value={state.sessionTime} onChange={(e) => setState({ sessionTime: e.target.value })} className="inputWeird" placeholder="Thời gian..." required />
                    </div>
                    <div className="inputPassword">
                        <textarea style={{ width: "100%" }} value={state.sessionContent} onChange={(e) => setState({ sessionContent: e.target.value })} className="inputWeird" placeholder="Mô tả...." required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                        <button type='submit' className='yesForm yesNoButton'>Thêm</button>
                        <button type='button' onClick={() => setState({ modalOpen: false, sessionTitle: null, sessionPrice: null, sessionTime: null, sessionContent: null })} className='noForm yesNoButton'>Hủy</button>
                    </div>
                </form>
            ) : (
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
                    <div className="inputPassword">
                        <input type="number" style={{ width: "100%" }} defaultValue={state.modalData?.time} onChange={(e) => dataArray[state.modalIndex].time = e.target.value} className="inputWeird" placeholder="Thời gian..." required />
                    </div>
                    <div className="inputPassword">
                        <textarea style={{ width: "100%" }} defaultValue={state.modalData?.content} onChange={(e) => dataArray[state.modalIndex].content = e.target.value} className="inputWeird" placeholder="Mô tả...." required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                        <button type='submit' className='yesForm yesNoButton'>Xong</button>
                        <button type='button' onClick={() => setState({ modalOpen: false, modalData: null, modalIndex: null })} className='noForm yesNoButton'>Hủy</button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
export default PlusSessionModal