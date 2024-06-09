import { useReducer, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import SignIn from "../../Component/AccountPageComponent/SignIn";
import ToastUpdate from "../../Component/Toastify/ToastUpdate";
import "./Login.css"
import Cookies from "universal-cookie";
import NotFound404 from "../../Component/NotFound404"

function LoginAdmin() {
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