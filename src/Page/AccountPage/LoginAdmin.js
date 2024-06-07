import { useReducer, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import SignIn from "../../Component/AccountPageComponent/SignIn";
import ToastUpdate from "../../Component/Toastify/ToastUpdate";
import "./Login.css"

function LoginAdmin() {
    return (
        <div className="mainLoginUser" style={{ height: "100vh" }}>
            <div className="container right-panel-active">
                {/* <!-- Sign In --> */}
                <SignIn useReducer={useReducer} useRef={useRef} axios={axios} type={"LoginAdmin"} toast={toast} ToastUpdate={ToastUpdate} />

                {/* <!-- Overlay --> */}
                <div className="container__overlay">
                    <div className="overlay"></div>
                </div>
            </div>
        </div>
    )
}
export default LoginAdmin