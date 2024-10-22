import EmojiPicker from "emoji-picker-react"
import { Fragment, useReducer } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import socketIOClient from "socket.io-client";

function ChatTabs({ useEffect, axios, token, useRef, toast }) {
    const toastNow = useRef(null)
    const socketRef = useRef();
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        roomChat: null,
        chatState: "",
        showEmoji: false,
        chatStorage: null,
        loading: false,
    })

    useEffect(() => {
        getChatRoom()
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        if (localStorage.getItem("chatRoom")) {
            getChatRoomSpecific(localStorage.getItem("chatRoom"))
        }

        socketRef.current.on('ChatStartSuccess', data => {
            getChatRoom()
        })

        socketRef.current.on('ChatSendSuccess', data => {
            getChatRoom()
            if (localStorage.getItem("chatRoom") === data.id) {
                getChatRoomSpecific(data.id)
            }
        })

        socketRef.current.on('ChatSendAdminSuccess', data => {
            if (token.userId === data.adminId) {
                setState({ chatState: "", loading: false })
                getChatRoom()
                getChatRoomSpecific(data.userId)
            }
        })

        socketRef.current.on('DeleteChatSuccess', data => {
            if (token.userId === data.adminId && data.userId === localStorage.getItem("chatRoom")) {
                localStorage.removeItem("chatRoom")
                window.location.reload()
            } else if (token.userId === data.adminId && data.userId !== localStorage.getItem("chatRoom")) {
                window.location.reload()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const chatRoomX = localStorage.getItem("chatRoom")
    useEffect(() => {
        if (chatRoomX) {
            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateNotificationChatTabs`,
                data: {
                    id: chatRoomX,
                    adminId: token.userId
                }
            }
            axios(configuration).then(() => {
                getChatRoom()
                getChatRoomSpecific(chatRoomX)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatRoomX])

    function getChatRoomSpecific(e) {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetChatRoom`,
            params: {
                userId: e
            }
        }
        axios(configuration).then((res) => {
            setState({ chatStorage: res.data })
        }).catch(() => {
            setState({ chatStorage: null })
        })
    }

    function getChatRoom() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetChatRoomAdmin`,
        }
        axios(configuration).then((res) => {
            setState({ roomChat: res.data })
        }).catch(() => {
            setState({ roomChat: null })
        })
    }

    function changeChatRoom(dataCall) {
        localStorage.setItem("chatRoom", dataCall)
        window.location.reload()
    }

    function outChatRoom() {
        localStorage.removeItem("chatRoom")
        window.location.reload()
    }

    function chatSendAdmin(e, roomId, userId) {
        e.preventDefault()
        setState({ loading: true })
        const data = { roomId: roomId, userId: userId, adminId: token.userId, image: state.imageChatState }
        socketRef.current.emit('ChatSendAdmin', data)
    }

    function deleteChat(roomId, userId) {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { roomId: roomId, userId: userId, adminId: token.userId }
        socketRef.current.emit('DeleteChat', data)
    }

    function convertToBase64(e) {
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setState({ imageChatState: reader.result })
            };
            reader.onerror = (err) => {
                console.log(err);
            }
        }
    }

    return (
        <div className="coverChatAll">
            <div style={window.innerWidth > 991 ? null : window.innerWidth <= 991 && localStorage.getItem("chatRoom") ? { display: "none" } : window.innerWidth <= 991 && !localStorage.getItem("chatRoom") ? { width: "100%", display: "block" } : null} className="chatSide">
                {state?.roomChat?.room.map((i) => {
                    return (
                        <div onClick={() => changeChatRoom(i.createdBy)} key={i._id} className={state.chatStorage?._id === i._id ? "chatSideChild chatSideChildActive" : "chatSideChild"}>
                            <div className="chatSideChildLeft">
                                <div className="avatarCoverChild">
                                    {state?.roomChat?.user.filter(item => item._id === i.createdBy).map((e) => {
                                        return (
                                            <Fragment key={e._id}>
                                                {e.userimage ? (
                                                    <LazyLoadImage alt="Image" src={e.userimage} width={"100%"} height={"100%"} />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                                                )}
                                            </Fragment>
                                        )
                                    })}
                                </div>
                                <div style={{ width: "100%", overflow: "hidden" }}>
                                    {state?.roomChat?.user.filter(item => item._id === i.createdBy).map((e) => {
                                        return (
                                            <p key={e._id} className="nameChatSide">{e.phonenumber}</p>
                                        )
                                    })}
                                    {i.data.length > 0 ? (
                                        i.data.slice(-1).map((a) => {
                                            return (
                                                <p key={a} className="contentChatSide">{a.id === token.userId ? "Bạn: " : null}{a.chat}</p>
                                            )
                                        })
                                    ) : (
                                        <p className="contentChatSide">Hãy chat gì đó nào!</p>
                                    )}
                                </div>
                                <button onClick={() => deleteChat(i._id, i.createdBy)} className="deleteChat">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                </button>
                            </div>
                            {i.data.filter(item => item.id !== token.userId && item.status === 1).length > 0 ? (
                                <div className="chatSideChildRight"><span>{i.data.filter(item => item.id !== token.userId && item.status === 1).length}</span></div>
                            ) : null}
                        </div>
                    )
                })}
            </div>
            <div style={window.innerWidth > 991 ? null : window.innerWidth <= 991 && localStorage.getItem("chatRoom") ? { display: "block", width: "100%", position: "relative" } : window.innerWidth <= 991 && !localStorage.getItem("chatRoom") ? { display: "none" } : null} className="chatRoom">
                {state?.chatStorage ? (
                    <>
                        <button onClick={() => outChatRoom()} className="backChatRoomRespon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
                        </button>
                        <div className="chatPlace">
                            <p className="abbortTime">Phòng chat mở lúc {new Date(state?.chatStorage?.createdAt).toLocaleString()}</p>
                            {state?.chatStorage?.data.map((i, index) => {
                                return (
                                    <div key={index} className={i.id === token.userId ? "rightSideChat" : "leftSideChat"}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                            {i.chat !== "" ? (
                                                <span>{i.chat}
                                                    <p>{new Date(i.time).toLocaleDateString() !== new Date(Date.now()).toLocaleDateString() ? new Date(i.time).toLocaleString() : new Date(i.time).toLocaleTimeString()}</p>
                                                </span>
                                            ) : null}
                                            {i.image ? (
                                                <a href={i.image}><LazyLoadImage alt="Image" src={i.image} /></a>
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <form onSubmit={(e) => chatSendAdmin(e, state?.chatStorage._id, state?.chatStorage.createdBy)} style={state.imageChatState ? { height: "15%" } : null} className="inputChatPlace">
                            <div className="fatherInput">
                                {state.imageChatState ? (
                                    <div className="haveImageChat">
                                        <LazyLoadImage alt="Image" src={state.imageChatState} width={"100%"} height={"100%"} />
                                        <button onClick={() => setState({ imageChatState: null })} type="button" className="closeImageChat">x</button>
                                    </div>
                                ) : null}
                                {state.imageChatState ? (
                                    <input autoComplete="off" value={state.chatState} onChange={(e) => setState({ chatState: e.target.value })} type="text" />
                                ) : (
                                    <input autoComplete="off" value={state.chatState} onChange={(e) => setState({ chatState: e.target.value })} type="text" required />
                                )}
                            </div>
                            <input type="submit" style={{ display: "none" }} />
                            <div className="coverButtonRightChat">
                                <button className="emojiButton" onClick={() => state.showEmoji ? setState({ showEmoji: false }) : setState({ showEmoji: true })} type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
                                    {state.showEmoji ? (
                                        <EmojiPicker className="emojiPickerShow" theme="auto" emojiStyle="facebook" lazyLoadEmojis={true} onEmojiClick={(e) => setState({ chatState: state.chatState + e.emoji, showEmoji: false })} />
                                    ) : null}
                                </button>
                                <button type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                    <input onChange={convertToBase64} type="file" style={{ opacity: 0, width: "100%", height: "100%", top: 0, left: 0, position: "absolute", cursor: "pointer" }} />
                                </button>
                                <button type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" /></svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <h4 className="chatRoomEmpty">Hãy chọn 1 người phía bên trái để chat!</h4>
                )}
            </div>
            {state.loading ? (
                <span className="rotateLoading">↻</span>
            ) : null}
        </div>
    )
}
export default ChatTabs