import { useReducer } from "react"

function GalleryTabs({ axios, toast, ToastUpdate, useRef, useEffect }) {
    const toastNow = useRef(null)
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        allGallerys: null,
        search: "",
        video: "",
        updateVideo: "",
        contentSearch: null,
        wantEditVideo: false,
        indexEditVideo: null,
    })

    useEffect(() => {
        GetGal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function GetGal() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetGallerys`,
        }
        axios(configuration).then((res) => {
            setState({ allGallerys: res.data })
        })
    }

    function convertToBase64(e, type, sData) {
        toastNow.current = toast.loading("Chờ một chút...")
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                if (type === 1) {
                    const configuration = {
                        method: "post",
                        url: `${process.env.REACT_APP_apiAddress}/api/v1/AddImageGallery`,
                        data: {
                            image: reader.result
                        }
                    }
                    axios(configuration).then((res) => {
                        GetGal()
                        ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
                    }).catch((err) => {
                        ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
                    })
                } else {
                    const configuration = {
                        method: "post",
                        url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateImageGallery`,
                        data: {
                            id: sData,
                            image: reader.result
                        }
                    }
                    axios(configuration).then((res) => {
                        GetGal()
                        ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
                    }).catch((err) => {
                        ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
                    })
                }
            };
            reader.onerror = (err) => {
                console.log(err);
            }
        }
    }

    function deleteGallery(e, z) {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/DeleteGallery`,
            data: {
                id: e,
                type: z
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            GetGal()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function getSrcYoutube(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        const ID = (match && match[2].length === 11) ? match[2] : null
        return 'https://www.youtube.com/embed/' + ID
    }

    function addVideo(e) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/AddVideoGallery`,
            data: {
                video: getSrcYoutube(state.video)
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ video: "" })
            GetGal()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function updateVideo(e, id) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateVideoGallery`,
            data: {
                id: id,
                video: state.updateVideo
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ updateVideo: "", wantEditVideo: false, indexEditVideo: null })
            GetGal()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <>
            <p style={{ fontFamily: "Oswald", fontWeight: 400, margin: 0, color: "#999", fontSize: 18, letterSpacing: 1, textAlign: "end" }}>Sức chứa tối đa của ảnh&video : <span style={{ color: "#904d03" }}>8</span></p>
            <div className="coverGallery">
                {state.allGallerys?.filter((item) => item.title === "image").map((i, index) => {
                    return (
                        <div style={index > 3 ? { marginTop: 15 } : null} key={i._id} className="inputImageXY">
                            <div className="haveImage">
                                <img alt="" src={i.data} />
                                <svg className="wantEditSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
                                <input type="file" onChange={(e) => convertToBase64(e, 2, i._id)} />
                                <button onClick={() => deleteGallery(i._id, 1)} className="trashImage">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
                {state.allGallerys?.filter((item) => item.title === "image").length >= 8 ? null : (
                    <div style={state.allGallerys?.filter((item) => item.title === "image").length > 3 ? { marginTop: 15 } : null} className="inputImageXY">
                        <div className="haventImage">
                            <svg className="wantAddSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                            <p>Nhấn để thêm ảnh</p>
                            <input type="file" onChange={(e) => convertToBase64(e, 1)} />
                        </div>
                    </div>
                )}
            </div>
            <div className="coverGalleryVideo">
                {state.allGallerys?.filter((item) => item.title === "video").length >= 8 ? null : (
                    <form onSubmit={(e) => addVideo(e)} className="topGalleryVideo">
                        <input placeholder="Copy link từ youtube và dán vào đây..." value={state.video} onChange={(e) => setState({ video: e.target.value })} type="text" required />
                        <button type="submit"><b>+</b> Thêm</button>
                    </form>
                )}
                <div style={state.allGallerys?.filter((item) => item.title === "video").length > 0 ? { marginTop: 15 } : null} className="videoShowUp">
                    {state.allGallerys?.filter((item) => item.title === "video").map((i, index) => {
                        return (
                            <form onSubmit={(e) => updateVideo(e, i._id)} key={i._id} className="videoElement">
                                <p>Video {index + 1} :</p>
                                <input onChange={(e) => setState({ updateVideo: e.target.value })} defaultValue={i.data} style={state.wantEditVideo && state.indexEditVideo === index ? null : { pointerEvents: "none", background: "rgba(255,255,255,0.1)" }} type="text" required />
                                <div className="buttonVideoElement">
                                    {state.wantEditVideo && state.indexEditVideo === index ? (
                                        <>
                                            <button type="submit">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                                            </button>
                                            <button type="button" onClick={() => setState({ wantEditVideo: false, indexEditVideo: null })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button type="button" onClick={() => setState({ wantEditVideo: true, indexEditVideo: index })} className="specialNow">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                        </button>
                                    )}
                                    <button type="button" onClick={() => window.open(i.data)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                                    </button>
                                    <button type="button" onClick={() => deleteGallery(i._id, 2)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                    </button>
                                </div>
                            </form>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
export default GalleryTabs