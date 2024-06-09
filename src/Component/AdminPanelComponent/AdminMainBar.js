import axios from "axios"
import AdminAccountModal from "../Modal/AdminAccountModal"
import "./AdminPanel.css"
import MainBarHeader from "./MainBarHeader"

function AdminMainBar({ useState, token, useEffect }) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState(null)
    const [accounts, setAccounts] = useState(null)
    useEffect(() => {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAccounts`,
            params: {
                id: token.userId
            }
        }
        axios(configuration).then((res) => {
            setAccounts(res.data)
        })
    }, [token.userId])
    return (
        <div className="mainAdminMainBar">
            <MainBarHeader setOpen={setOpen} axios={axios} accounts={accounts} setType={setType} />

            <AdminAccountModal open={open} setOpen={setOpen} axios={axios} token={token} type={type} />
        </div>
    )
}
export default AdminMainBar