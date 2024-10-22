import "./Login.css"
import { lazy, useEffect, useReducer, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";
import ToastUpdate from "../../Component/Toastify/ToastUpdate";
import { Helmet } from "react-helmet";
const SignIn = lazy(() => import("../../Component/AccountPageComponent/SignIn"))
const SignUp = lazy(() => import("../../Component/AccountPageComponent/SignUp"))
const NotFound404 = lazy(() => import("../../Component/NotFound404"))

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
            <Helmet>
                <title>DLC Tattoo | Đăng nhập</title>
                <meta name="description" content="DLC Tattoo | Đăng nhập" />
                <meta property="og:url" content="https://dlctattoo.netlify.app" />
                <meta property="og:site_name" content="DLC Tattoo" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:type" content="website" />
            </Helmet>
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