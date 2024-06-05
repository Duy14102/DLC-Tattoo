import { NavLink } from "react-router-dom"
import "./Login.css"

function LoginAdmin() {
    return (
        <div className="mainLoginUser" style={{ height: "100vh" }}>
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

                {/* <!-- Overlay --> */}
                <div className="container__overlay">
                    <div className="overlay"></div>
                </div>
            </div>
        </div>
    )
}
export default LoginAdmin