import "./Login.css"
import { lazy, useReducer, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";
import ToastUpdate from "../../Component/Toastify/ToastUpdate";
const SignIn = lazy(() => import("../../Component/AccountPageComponent/SignIn"))
const NotFound404 = lazy(() => import("../../Component/NotFound404"))

function LoginAdmin() {
    document.title = "DLC Tattoo | Admin đăng nhập"
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    if (token) {
        return NotFound404()
    }
    return (
        <div className="mainLoginUser" style={{ height: "100vh" }}>
            <div className="container right-panel-active">
                {/* <!-- Sign In --> */}
                <SignIn useReducer={useReducer} useRef={useRef} axios={axios} type={"LoginAdmin"} toast={toast} ToastUpdate={ToastUpdate} cookies={cookies} />

                {/* <!-- Overlay --> */}
                <div className="container__overlay">
                    <div className="overlay"></div>
                </div>
            </div>
        </div>
    )
}
export default LoginAdmin