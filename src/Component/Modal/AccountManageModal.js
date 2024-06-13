import Modal from "react-responsive-modal"

function AccountManageModal({ open, setOpen, axios, getAccounts, toast, ToastUpdate, id, useRef }) {
    const toastNow = useRef(null)
    function deleteAccounts() {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/DeleteAccount`,
            data: {
                id: id
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setOpen({ modal: false, type: null, dataModalPass: null })
            getAccounts()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function banAccounts(e) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/BanAccount`,
            data: {
                id: id,
                reason: open.reasonBan
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setOpen({ modal: false, type: null, dataModalPass: null, reasonBan: "" })
            getAccounts()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function UnbanAccounts() {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UnbanAccount`,
            data: {
                id: id,
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setOpen({ modal: false, type: null, dataModalPass: null })
            getAccounts()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <Modal open={open.modal} onClose={() => setOpen({ modal: false, type: null, dataModalPass: null })} center>
            <h4 className='modalTitle'>{open.type === 1 ? "Bạn chắc chắn muốn khóa tài khoản ?" : open.type === 2 ? "Bạn chắc chắn muốn xóa tài khoản ?" : open.type === 3 ? "Bạn chắc chắn muốn mở tài khoản ?" : null}</h4>
            {open.type === 1 ? (
                <form onSubmit={(e) => banAccounts(e)}>
                    <div className="inputPassword">
                        <input style={{ width: "100%" }} value={open.reasonBan} onChange={(e) => setOpen({ reasonBan: e.target.value })} className="inputWeird" placeholder="Lý do khóa..." required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                        <button type='submit' className='yesForm yesNoButton'>Khóa</button>
                        <button type='button' onClick={() => setOpen({ modal: false, type: null, dataModalPass: null })} className='noForm yesNoButton'>Hủy</button>
                    </div>
                </form>
            ) : open.type === 2 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                    <button type='button' onClick={() => deleteAccounts()} className='yesForm yesNoButton'>Xóa</button>
                    <button type='button' onClick={() => setOpen({ modal: false, type: null, dataModalPass: null })} className='noForm yesNoButton'>Hủy</button>
                </div>
            ) : open.type === 3 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                    <button type='button' onClick={() => UnbanAccounts()} className='yesForm yesNoButton'>Mở</button>
                    <button type='button' onClick={() => setOpen({ modal: false, type: null, dataModalPass: null })} className='noForm yesNoButton'>Hủy</button>
                </div>
            ) : null}
        </Modal>
    )
}
export default AccountManageModal