import { useEffect, useReducer, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import SignIn from "../../Component/AccountPageComponent/SignIn";
import SignUp from "../../Component/AccountPageComponent/SignUp";
import ToastUpdate from "../../Component/Toastify/ToastUpdate";
import "./Login.css"
import Cookies from "universal-cookie";
import NotFound404 from "../../Component/NotFound404"

function LoginUser() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    useEffect(() => {
        if (!token) {
            const signInBtn = document.getElementById("signIn");
            const signUpBtn = document.getElementById("signUp");
            const container = document.querySelector(".container");

            signInBtn.addEventListener("click", () => {
                container.classList.remove("right-panel-active");
            });

            signUpBtn.addEventListener("click", () => {
                container.classList.add("right-panel-active");
            });
        }
    }, [token])
    if (token) {
        return NotFound404()
    }
    return (
        <div className="mainLoginUser" style={{ height: "100%" }}>
            <div className="container right-panel-active">
                {/* <!-- Sign In --> */}
                <SignIn useReducer={useReducer} useRef={useRef} axios={axios} type={"LoginUser"} toast={toast} ToastUpdate={ToastUpdate} cookies={cookies} />

                {/* <!-- Sign Up --> */}
                <SignUp useReducer={useReducer} useRef={useRef} axios={axios} toast={toast} ToastUpdate={ToastUpdate} />

                {/* <!-- Overlay --> */}
                <div className="container__overlay">
                    <div className="overlay">
                        <div className="overlay__panel overlay--left">
                            <button className="btn" id="signIn">Đăng ký</button>
                        </div>
                        <div className="overlay__panel overlay--right">
                            <button className="btn" id="signUp">Đăng nhập</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginUser