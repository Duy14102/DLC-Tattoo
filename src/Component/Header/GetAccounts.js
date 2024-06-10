import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

function GetAccounts({ token, useEffect, NavLink, cookies }) {
    const [accounts, setAccounts] = useState(null)
    const decode = jwtDecode(token)
    useEffect(() => {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAccounts`,
            params: {
                id: decode.userId
            }
        }
        axios(configuration).then((res) => {
            setAccounts(res.data)
        })
    }, [decode.userId])

    const logoutUser = () => {
        cookies.remove("TOKEN", { path: '/' });
        window.location.href = "/"
    }
    return (
        <div className="avatarUser">
            {accounts?.image ? (
                <img alt="" src={accounts.image} />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
            )}
            <div className="dropdownAvatar">
                <NavLink reloadDocument to={decode.userRole === 1 ? "/UserPanel" : "/AdminPanel"}>{decode.userRole === 1 ? "Tài khoản" : "Quản trị"}</NavLink>
                <button onClick={() => logoutUser()} type="button">Thoát</button>
            </div>
        </div>
    )
}
export default GetAccounts