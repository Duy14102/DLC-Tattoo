import Modal from "react-responsive-modal"

function PlusJobsModal({ state, setState, axios, toast, ToastUpdate, toastNow, token, getAccounts }) {
    function addTodoList(e) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/AddTodoList`,
            data: {
                id: token.userId,
                jobs: state.jobs
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            getAccounts()
            setState({ modalOpen: false, jobs: "" })
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <Modal open={state.modalOpen} onClose={() => setState({ modalOpen: false, jobs: "" })} center>
            <h4 className='modalTitle'>Thêm việc cần làm</h4>
            <form onSubmit={(e) => addTodoList(e)}>
                <textarea value={state.jobs} onChange={(e) => setState({ jobs: e.target.value })} className="textareaTodoList" placeholder="Điền việc cần làm..." required />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                    <button type="submit" className="yesForm yesNoButton">Xong</button>
                    <button type="button" onClick={() => setState({ modalOpen: false, jobs: "" })} className="noForm yesNoButton">Hủy</button>
                </div>
            </form>
        </Modal>
    )
}
export default PlusJobsModal