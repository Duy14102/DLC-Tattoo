import { Zoom, toast } from 'react-toastify';

function ToastError({ message }) {
    toast.error(message, {
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
export default ToastError