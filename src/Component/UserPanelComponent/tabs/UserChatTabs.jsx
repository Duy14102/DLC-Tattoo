import { useEffect, useReducer } from "react"
import UserHeaderTabs from "./UserHeaderTabs"
import socketIOClient from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import axios from "axios";
import ToastError from "../../Toastify/ToastError";
import { LazyLoadImage } from "react-lazy-load-image-component";

function UserChatTabs({ useRef, decode, toast, ToastUpdate, getAccounts }) {
    const toastNow = useRef(null)
    const socketRef = useRef();
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        roomChat: null,
        chatState: "",
        imageChatState: null,
        showEmoji: false,
        loading: false,
    })

    useEffect(() => {
        getChatRoom()
        socketRef.current = socketIOClient.connect(`${process.env.REACT_APP_apiAddress}`)

        socketRef.current.on('ChatStartSuccess', data => {
            if (decode.userId === data.id) {
                getChatRoom()
                ToastUpdate({ type: 1, message: "Phòng chat đã được mở!", refCur: toastNow.current })
            }
        })

        socketRef.current.on('ChatStartFail', data => {
            if (decode.userId === data.id) {
                ToastUpdate({ type: 2, message: "Phòng chat mở thất bại!", refCur: toastNow.current })
            }
        })

        socketRef.current.on('ChatSendSuccess', data => {
            if (decode.userId === data.id) {
                setState({ chatState: "", loading: false })
                getChatRoom()
            }
        })

        socketRef.current.on('ChatSendAdminSuccess', data => {
            if (decode.userId === data.userId) {
                getChatRoom()
            }
        })

        socketRef.current.on('DeleteChatSuccess', data => {
            if (decode.userId === data.userId) {
                getChatRoom()
                getAccounts()
                ToastError({ message: "Đoạn chat đã bị xóa!" })
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getChatRoom() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetChatRoom`,
            params: {
                userId: decode.userId
            }
        }
        axios(configuration).then((res) => {
            setState({ roomChat: res.data })
        }).catch(() => {
            setState({ roomChat: null })
        })
    }

    function chatStart() {
        toastNow.current = toast.loading("Chờ một chút...")
        const data = { userId: decode.userId }
        socketRef.current.emit('ChatStart', data)
    }

    function chatSend(e, id) {
        e.preventDefault()
        setState({ loading: true })
        const data = { roomId: id, userId: decode.userId, chat: state.chatState, image: state.imageChatState }
        socketRef.current.emit('ChatSend', data)
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
        <div>
            <UserHeaderTabs quote={"Trò chuyện"} />
            <div style={{ marginTop: 25 }}>
                {state?.roomChat ? (
                    <div className="chatRoom">
                        <div className="chatPlace">
                            <p className="abbortTime">Phòng chat mở lúc {new Date(state?.roomChat.createdAt).toLocaleString()}</p>
                            {state?.roomChat.data.map((i, index) => {
                                return (
                                    <div key={index} className={i.id === decode.userId ? "rightSideChat" : "leftSideChat"}>
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
                        <form onSubmit={(e) => chatSend(e, state.roomChat._id)} className="inputChatPlace" style={state.imageChatState ? { height: "15%" } : null}>
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
                    </div>
                ) : (
                    <button onClick={() => chatStart()} type="button" style={{ height: 38 }} className="buttonSelfish buttonA">Bắt đầu chat</button>
                )}
            </div>
            {state.loading ? (
                <span className="rotateLoading">↻</span>
            ) : null}
        </div>
    )
}
export default UserChatTabs