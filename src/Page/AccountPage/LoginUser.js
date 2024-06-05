import { useEffect } from "react";
import "./Login.css"
import { NavLink } from "react-router-dom";

function LoginUser() {
    useEffect(() => {
        const signInBtn = document.getElementById("signIn");
        const signUpBtn = document.getElementById("signUp");
        const container = document.querySelector(".container");

        signInBtn.addEventListener("click", () => {
            container.classList.remove("right-panel-active");
        });

        signUpBtn.addEventListener("click", () => {
            container.classList.add("right-panel-active");
        });
    }, [])
    return (
        <div className="mainLoginUser" style={{ height: "100%" }}>
            <div className="container right-panel-active">
                {/* <!-- Sign In --> */}
                <div className="container__form container--signup">
                    <form className="form" id="form2">
                        <h2 className="form__title">Đăng nhập</h2>
                        <input type="tel" placeholder="Số điện thoại" className="input" required />
                        <input type="password" placeholder="Mật khẩu" className="input" required />
                        <NavLink reloadDocument className="link">Quên mật khẩu?</NavLink>
                        <button type="submit" className="btn">Đăng nhập</button>
                    </form>
                </div>

                {/* <!-- Sign Up --> */}
                <div className="container__form container--signin">
                    <form className="form" id="form1">
                        <h2 className="form__title">Đăng ký</h2>
                        <input type="tel" placeholder="Số điện thoại" className="input" required />
                        <input type="password" placeholder="Mật khẩu" className="input" required />
                        <input type="password" placeholder="Nhập lại mật khẩu" className="input" required />
                        <button type="submit" className="btn">Đăng ký</button>
                    </form>
                </div>

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