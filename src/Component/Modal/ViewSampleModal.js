import Modal from "react-responsive-modal"

function ViewSampleModal({ state, setState }) {
    return (
        <Modal open={state.modalOpen} onClose={() => setState({ modalOpen: false})} center>
            <h4 className='modalTitle'>Chi tiết buổi xăm</h4>
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
                        <div style={{ display: "flex", gap: 5 }}>
                            <b style={{ textWrap: "nowrap" }}>Nội dung</b> : <p>{i.content}</p>
                        </div>
                    </div>
                )
            })}
        </Modal>
    )
}
export default ViewSampleModal