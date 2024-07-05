import { Zoom, toast } from 'react-toastify';

function ToastSuccess({ message }) {
    toast.success(message, {
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
export default ToastSuccess