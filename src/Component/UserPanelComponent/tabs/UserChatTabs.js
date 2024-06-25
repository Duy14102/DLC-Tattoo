import { useEffect, useReducer } from "react"
import UserHeaderTabs from "./UserHeaderTabs"
import socketIOClient from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import axios from "axios";
import ToastError from "../../Toastify/ToastError";

function UserChatTabs({ useRef, decode, toast, ToastUpdate }) {
    const toastNow = useRef(null)
    const socketRef = useRef();
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        roomChat: null,
        chatState: "",
        showEmoji: false,
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
                setState({ chatState: "" })
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
        const data = { roomId: id, userId: decode.userId, chat: state.chatState }
        socketRef.current.emit('ChatSend', data)
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
                                        <span>{i.chat}
                                            <p>{new Date(i.time).toLocaleDateString() !== new Date(Date.now()).toLocaleDateString() ? new Date(i.time).toLocaleString() : new Date(i.time).toLocaleTimeString()}</p>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <form onSubmit={(e) => chatSend(e, state.roomChat._id)} className="inputChatPlace">
                            <input autoComplete="off" value={state.chatState} onChange={(e) => setState({ chatState: e.target.value })} type="text" required />
                            <input type="submit" style={{ display: "none" }} />
                            <div className="emojiButton">
                                <button onClick={() => state.showEmoji ? setState({ showEmoji: false }) : setState({ showEmoji: true })} type="button">😊</button>
                                {state.showEmoji ? (
                                    <EmojiPicker className="emojiPickerShow" theme="auto" emojiStyle="facebook" lazyLoadEmojis={true} onEmojiClick={(e) => setState({ chatState: state.chatState + e.emoji, showEmoji: false })} />
                                ) : null}
                            </div>
                            <div className="sendButton">
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
        </div>
    )
}
export default UserChatTabs