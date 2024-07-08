import { useReducer } from "react"
import ReactPaginate from "react-paginate";
import AccountManageModal from "../../Modal/AccountManageModal";
import SearchBar from "./SearchBar";

function AccountsTabs({ toast, useRef, axios, ToastUpdate, useEffect, id }) {
    const toastNow = useRef(null)
    const currentPage = useRef();
    const sortPlace = [{ title: "Thông tin cá nhân", x: 1, y: -1 }, { title: "Ngày gia nhập", x: 2, y: -2 }, { title: "Lần cuối truy cập", x: 3, y: -3 }, { title: "Vai trò", x: 4, y: -4 }, { title: "Trạng thái", x: 5, y: -5 },]
    const limit = 8
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        phone: "",
        password: "",
        repeatPassword: "",
        reasonBan: "",
        search: "",
        sorted: null,
        contentSearch: null,
        avatar: null,
        accounts: null,
        seePassword: false,
        seeRepeatPassword: false,
        modal: false,
        type: null,
        dataModalPass: null,
        wantAddAdmin: false,
        pageCount: 6
    })

    useEffect(() => {
        currentPage.current = 1;
        getAccounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch])

    function getAccounts() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAllAccounts`,
            params: {
                page: currentPage.current,
                limit: limit,
                search: state.contentSearch,
                sorted: state.sorted
            }
        }
        axios(configuration).then((res) => {
            setState({ accounts: res.data.results.result, pageCount: res.data.results.pageCount });
        })
    }

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getAccounts();
    }

    function handleSorted(x, y) {
        if (state.sorted) {
            state.sorted === x ? setState({ sorted: y }) : setState({ sorted: x })
        } else {
            setState({ sorted: x })
        }
        getAccounts()
    }

    function convertToBase64(e) {
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setState({ avatar: reader.result })
            };
            reader.onerror = (err) => {
                console.log(err);
            }
        }
    }

    function submitSignup(e) {
        e.preventDefault()
        if (state.repeatPassword !== state.password || !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) || state.password.length < 8) {
            return false
        } else {
            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/Register`,
                data: {
                    phone: state.phone,
                    password: state.password,
                    avatar: state.avatar,
                    role: 2
                }
            }
            toastNow.current = toast.loading("Chờ một chút...")
            axios(configuration).then((res) => {
                ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
                setState({ phone: "", password: "", repeatPassword: "", seePassword: false, seeRepeatPassword: false })
            }).catch((err) => {
                ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
            })
        }
    }
    return (
        <>
            <div className="topBlobTaps">
                <SearchBar state={state} setState={setState} useEffect={useEffect} searchWhat={"Nhập số điện thoại..."} />
                <button onClick={() => state.wantAddAdmin ? setState({ wantAddAdmin: false }) : setState({ wantAddAdmin: true })} className="addNewBlog">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d={state.wantAddAdmin ? "M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" : "M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"} /></svg> {state.wantAddAdmin ? "Bỏ tạo" : "Tạo admin"}
                </button>
            </div>
            {state.wantAddAdmin ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <form onSubmit={(e) => submitSignup(e)} className="formNewBlogs" style={{ width: window.innerWidth <= 991 ? "95vw" : "60%" }}>
                        <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0, textAlign: "end" }}>* Lưu ý : Ảnh nên dưới <b style={{ color: "#904d03" }}>1mb</b> để tối ưu website</p>
                        <div className='separateUp'>
                            <div className="titlePlace" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <input style={{ fontSize: 18, height: 55 }} type="tel" className="accountInput" value={state.phone} onChange={(e) => setState({ phone: e.target.value })} placeholder="Số điện thoại..." required />
                                {state.phone !== "" && !/((09|03|07|08|05)+([0-9]{8})\b)/g.test(state.phone) ? (
                                    <p className="warningFind">Số điện thoại không hợp lệ!</p>
                                ) : null}
                                <div className="inputPassword overlayThis">
                                    <input className="accountInput" type={state.seePassword ? "text" : "password"} placeholder="Mật khẩu..." value={state.password} onChange={(e) => setState({ password: e.target.value })} required />
                                    <button type="button" onClick={() => state.seePassword ? setState({ seePassword: false }) : setState({ seePassword: true })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.seePassword ? "M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" : "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"} /></svg>
                                    </button>
                                </div>
                                {state.password !== "" && state.password.length < 8 ? (
                                    <p className="warningFind">Mật khẩu phải nhiều hơn 8 kí tự!</p>
                                ) : null}
                                <div className="inputPassword overlayThis">
                                    <input className="accountInput" type={state.seeRepeatPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu..." value={state.repeatPassword} onChange={(e) => setState({ repeatPassword: e.target.value })} required />
                                    <button type="button" onClick={() => state.seeRepeatPassword ? setState({ seeRepeatPassword: false }) : setState({ seeRepeatPassword: true })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.seeRepeatPassword ? "M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" : "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"} /></svg>
                                    </button>
                                </div>
                                {state.repeatPassword !== "" && state.repeatPassword !== state.password ? (
                                    <p className="warningFind">Mật khẩu không trùng khớp!</p>
                                ) : null}
                            </div>
                            <div className='thumbPlace'>
                                {state.avatar ? (
                                    <img alt="" src={state.avatar} />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                )}
                                <svg className='appearAfterImg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                <input type='file' onChange={convertToBase64} />
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <button type='submit' className='yesForm yesNoButton'>Xong</button>
                            <button type='button' onClick={() => setState({ wantAddAdmin: false })} className='noForm yesNoButton'>Hủy</button>
                        </div>
                    </form>
                </div>
            ) : null}
            <div style={{ overflowX: "auto" }}>
                <table className="accountTable">
                    <thead>
                        <tr>
                            {sortPlace.map((u, index) => {
                                return (
                                    <th key={index}>
                                        <div onClick={() => handleSorted(u.x, u.y)} className="flexInThead">
                                            {u.title}
                                            <div className="sortInThead">
                                                <span style={{ color: state.sorted === u.x ? "#904d03" : null }}>▲</span>
                                                <span style={{ color: state.sorted === u.y ? "#904d03" : null }}>▲</span>
                                            </div>
                                        </div>
                                    </th>
                                )
                            })}
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.accounts?.map((i) => {
                            return (
                                <tr key={i._id}>
                                    <td className="coverInTd">
                                        <div className="tableUserImage">
                                            {i.userimage ? (
                                                <img alt="" src={i.userimage} width={"100%"} height={"100%"} />
                                            ) : (
                                                <svg style={{ width: "75%", height: "75%", fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                                            )}
                                        </div>
                                        <p>{i.phonenumber}</p>
                                    </td>
                                    <td>{new Date(i.createdAt).toLocaleString()}</td>
                                    <td>{i.lastLogin ? new Date(i.lastLogin).toLocaleString() : "Chưa đăng nhập"}</td>
                                    <td>{i.role === 1 ? "Người dùng" : "Admin"}</td>
                                    <td>
                                        <span style={{ color: i.status.state === 1 ? "#09c167" : "#e13534" }}>{i.status.state === 1 ? "🟢 Hoạt động" : "🔴 Khóa"}</span>
                                        {i.status.state === 2 ? (
                                            <><br />{`( ${i.status.reason} )`}</>
                                        ) : null}
                                    </td>
                                    {i.role === 1 ? (
                                        <td>
                                            <div className="buttonFlexInTd">
                                                {i.status.state === 2 ? (
                                                    <>
                                                        <button onClick={() => setState({ modal: true, type: 3, dataModalPass: i._id })} title="Mở tài khoản"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z" /></svg></button>
                                                        <button onClick={() => setState({ modal: true, type: 2, dataModalPass: i._id })} title="Xóa tài khoản"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg></button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setState({ modal: true, type: 1, dataModalPass: i._id })} title="Khóa tài khoản"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" /></svg></button>
                                                )}
                                            </div>
                                        </td>
                                    ) : null}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={state.pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                marginPagesDisplayed={2}
                containerClassName="pagination justify-content-center text-nowrap"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage.current - 1}
            />
            <AccountManageModal open={state} setOpen={setState} axios={axios} getAccounts={getAccounts} toast={toast} ToastUpdate={ToastUpdate} id={state.dataModalPass} useRef={useRef} useEffect={useEffect} Tokenid={id} />
        </>
    )
}
export default AccountsTabs