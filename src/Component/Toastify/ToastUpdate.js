import { Zoom, toast } from 'react-toastify';

function ToastUpdate({ type, message, refCur }) {
    toast.update(refCur, {
        render: message,
        type: type === 1 ? "success" : "error",
        isLoading: false,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
    })
}
export default ToastUpdate