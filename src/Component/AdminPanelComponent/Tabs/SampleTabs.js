import { useReducer } from "react"
import SearchBar from "./SearchBar";
import PlusSessionModal from "../../Modal/PlusSessionModal";
import ReactPaginate from 'react-paginate';

function SampleTabs({ useEffect, axios, toast, ToastUpdate, useRef, }) {
    const toastNow = useRef(null)
    const currentPage = useRef();
    const limit = 4
    const AllCate = ["Bắp tay", "Cẳng tay", "Bàn tay", "Bắp chân", "Cẳng chân", "Bàn chân", "Cổ", "Sườn", "Ngực", "Bụng", "Mông", "Vai", "Lưng"]
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        search: "", title: "", content: "", thumbnail: "", openCateChooseInput: "", openCateChooseInput2: "", updateTitle: "", updateContent: "", updateThumbnail: "",
        price: undefined,
        cateChoose: [],
        sessionAdd: [],
        allSamples: null,
        openCateChooseInputResult: null,
        openCateChooseInputResult2: null,
        indexChange: null,
        contentSearch: null,
        sessionTitle: undefined,
        sessionPrice: undefined,
        sessionTime: undefined,
        sessionContent: undefined,
        modalOpen: false,
        modalType: null,
        modalData: null,
        modalIndex: null,
        warningCate: false,
        openCateChooseButton: false,
        openCateChooseButton2: false,
        wantDelete: false,
        wantChangeTitle: false,
        wantChangeContent: false,
        wantChangeCate: false,
        wantChangeSession: false,
        warningAddSession: null,
        warningUpdateSession: null,
        wantAddSample: false,
        pageCount: 6
    })

    useEffect(() => {
        currentPage.current = 1;
        getSamples()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch])

    useEffect(() => {
        if (state.openCateChooseInput !== "") {
            const debounceResult = setTimeout(() => {
                setState({ openCateChooseInputResult: state.openCateChooseInput })
            }, 750);
            return () => clearTimeout(debounceResult)
        } else {
            setTimeout(() => {
                setState({ openCateChooseInputResult: null })
            }, 750);
        }
        if (state.openCateChooseInput2 !== "") {
            const debounceResult = setTimeout(() => {
                setState({ openCateChooseInputResult2: state.openCateChooseInput2 })
            }, 750);
            return () => clearTimeout(debounceResult)
        } else {
            setTimeout(() => {
                setState({ openCateChooseInputResult2: null })
            }, 750);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.openCateChooseInput, state.openCateChooseInput2])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getSamples();
    }

    function getSamples() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAllSample`,
            params: {
                page: currentPage.current,
                limit: limit,
                search: state.contentSearch
            }
        }
        axios(configuration).then((res) => {
            setState({ allSamples: res.data.results.result, pageCount: res.data.results.pageCount });
        })
    }

    function convertToBase64(e, type, index) {
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                if (type === 1) {
                    setState({ thumbnail: reader.result })
                } else {
                    setState({ updateThumbnail: reader.result, indexChange: index })
                }
            };
            reader.onerror = (err) => {
                console.log(err);
            }
        }
    }

    function addNewSample(e) {
        e.preventDefault()
        if (state.cateChoose.length < 1) {
            setState({ warningCate: true })
            return false
        }
        if (parseInt(state.sessionAdd.reduce((acc, o) => { return acc + parseInt(o.price) }, 0)) > parseInt(state.price)) {
            return false
        }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/AddSample`,
            data: {
                title: state.title,
                content: state.content,
                price: state.price,
                thumbnail: state.thumbnail,
                categories: state.cateChoose,
                session: state.sessionAdd
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ title: "", thumbnail: "", content: "", price: undefined, cateChoose: [], sessionAdd: [], wantAddSample: false, warningCate: false })
            getSamples()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function wrapCateChoose(e) {
        const chooseThis = state.cateChoose
        chooseThis.push(e)
        setState({ cateChoose: chooseThis })
    }

    function deleteItem(e, type) {
        const chooseThis = type === 1 ? state.cateChoose : state.sessionAdd
        chooseThis.splice(e, 1)
        setState(type === 1 ? { cateChoose: chooseThis } : { sessionAdd: chooseThis })
    }

    function deleteSamples(e) {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/DeleteSample`,
            data: {
                id: e
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ wantDelete: false, indexChange: null })
            getSamples()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    // function updateSamples(e) {
    //     const configuration = {
    //         method: "post",
    //         url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateBlog`,
    //         data: {
    //             id: e,
    //             title: state.updateTitle,
    //             subtitle: state.updateSubtitle,
    //             thumbnail: state.updateThumbnail,
    //             content: state.updateContent
    //         }
    //     }
    //     toastNow.current = toast.loading("Chờ một chút...")
    //     axios(configuration).then((res) => {
    //         setState({ indexChange: null, wantChangeContent: false, wantChangeSubtitle: false, wantChangeTitle: false, updateContent: "", updateSubtitle: "", updateThumbnail: "", updateTitle: "", appearWarning: true })
    //         getBlogs()
    //         ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
    //         setTimeout(() => {
    //             setState({ appearWarning: false })
    //         }, 5000);
    //     }).catch((err) => {
    //         ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
    //     })
    // }
    return (
        <>
            <div className="topBlobTaps">
                <SearchBar state={state} setState={setState} useEffect={useEffect} />
                <button onClick={() => state.wantAddSample ? setState({ wantAddSample: false }) : setState({ wantAddSample: true })} className="addNewBlog">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.wantAddSample ? "M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z" : "M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"} /></svg> {state.wantAddSample ? "Bỏ tạo" : "Tạo hình"}
                </button>
            </div>
            {state.wantAddSample ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <form onSubmit={(e) => addNewSample(e)} className="formNewBlogs" style={{ width: "60%" }}>
                        <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0, textAlign: "end" }}>* Lưu ý : Ảnh nên dưới <b style={{ color: "#904d03" }}>1mb</b> để tối ưu website</p>
                        <div className='separateUp'>
                            <div className='titlePlace'>
                                <input rows={1} value={state.title} onChange={(e) => setState({ title: e.target.value })} placeholder="Tiêu đề..." required />
                                <textarea rows={3} value={state.content} onChange={(e) => setState({ content: e.target.value })} style={{ fontSize: 20, marginTop: 15, height: 120 }} placeholder="Mô tả..." required />
                            </div>
                            <div className='thumbPlace'>
                                {state.thumbnail ? (
                                    <img alt='' src={state.thumbnail} />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                )}
                                <svg className='appearAfterImg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                <input onChange={(e) => convertToBase64(e, 1)} type='file' required />
                            </div>
                        </div>
                        <div className="sampleDownFlex">
                            <input value={state.price} onChange={(e) => setState({ price: e.target.value })} type="number" rows={1} placeholder="Giá cả..." />
                            <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0 }}>* Lưu ý : Để trống giá sẽ thành <a href="tel:+8400000000" style={{ textDecoration: "none", color: "#904d03" }}>liên hệ</a></p>
                        </div>
                        <div className="chooseCateSample">
                            <div className="sonChooseCateSample">
                                {state.cateChoose.length > 0 ? (
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", maxWidth: "41%" }}>
                                        {state.cateChoose.map((u, index) => {
                                            return (
                                                <div key={u} className="squareChoose">
                                                    <button onClick={() => deleteItem(index, 1)} type="button">x</button>
                                                    <p>{u}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : null}
                                <div className="findChooseFather" style={{ width: state.cateChoose.length < 1 ? "100%" : "60%" }}>
                                    <input value={state.openCateChooseInput} onChange={(e) => setState({ openCateChooseInput: e.target.value })} type="text" className="findChoose" placeholder="Danh mục..." />
                                </div>
                            </div>
                            <span onClick={() => state.openCateChooseButton ? setState({ openCateChooseButton: false }) : setState({ openCateChooseButton: true })}>{state.openCateChooseButton ? "▲" : "▼"}</span>
                            {state.openCateChooseButton || state.openCateChooseInputResult ? (
                                <div className="autoCompleteChooseCate">
                                    {state.cateChoose.length === 6 ? (
                                        <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>Đã đạt tối đa 6 danh mục!</p>
                                    ) : null}
                                    {AllCate.filter((word) => state.openCateChooseInputResult ? word.includes(state.openCateChooseInputResult) : word).map((i) => {
                                        return (
                                            state.cateChoose.includes(i) ? null : (
                                                <div onClick={() => state.cateChoose.length === 6 ? null : wrapCateChoose(i)} key={i} className="autoCompleteResult">{i}</div>
                                            )
                                        )
                                    })}
                                </div>
                            ) : null}
                        </div>
                        {state.warningCate ? (
                            <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>Chọn ít nhất 1 danh mục!</p>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                            <button onClick={() => setState({ modalOpen: true, modalType: 1 })} type="button" className="plusSession">+ Buổi</button>
                            {state.sessionAdd.length > 0 ? (
                                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", maxWidth: "100%" }}>
                                    {state.sessionAdd.map((y, index) => {
                                        return (
                                            <div key={index} className="squareChoose plusSessionChooseButton">
                                                <button onClick={() => deleteItem(index, 2)} type="button">x</button>
                                                <p onClick={() => setState({ modalOpen: true, modalType: 2, modalData: y, modalIndex: index })}>{y.title}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : null}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <button type='submit' className='yesForm yesNoButton'>Xong</button>
                            <button type='button' onClick={() => setState({ wantAddSample: false })} className='noForm yesNoButton'>Hủy</button>
                        </div>
                    </form>
                </div>
            ) : null}
            <div className='blogAllWrap'>
                {state.allSamples?.map((i, index) => {
                    return (
                        <div style={state.indexChange !== null && state.indexChange !== index ? { opacity: 0.5, pointerEvents: "none" } : null} key={i._id} className='blogAllContent'>
                            <div className='upperContent'>
                                <div style={{ width: "80%" }}>
                                    <div onClick={() => setState({ wantChangeTitle: true, indexChange: index })} className={state.wantChangeTitle ? 'blogAllContentTitle wantChange' : 'blogAllContentTitle'}>
                                        <input onChange={(e) => setState({ updateTitle: e.target.value })} style={{ pointerEvents: state.wantChangeTitle && state.indexChange === index ? "auto" : "none" }} defaultValue={i.title} />
                                        {state.wantChangeTitle ? null : (
                                            <svg className='svgAppear' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                        )}
                                    </div>
                                    <div onClick={() => setState({ wantChangeContent: true, indexChange: index })} className={state.wantChangeContent ? 'blogAllContentSubTitle wantChange' : 'blogAllContentSubTitle'}>
                                        <textarea onChange={(e) => setState({ updateContent: e.target.value })} style={{ pointerEvents: state.wantChangeContent && state.indexChange === index ? "auto" : "none" }} defaultValue={i.content} />
                                        {state.wantChangeContent ? null : (
                                            <svg className='svgAppear' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                        )}
                                    </div>
                                </div>
                                <div className='upperContentImg'>
                                    <img alt='' src={state.updateThumbnail && state.indexChange === index ? state.updateThumbnail : i.thumbnail} />
                                    <svg className='svgAppear' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                    <input onChange={(e) => convertToBase64(e, 2, index)} type='file' style={{ opacity: 0, width: "100%", height: "100%", position: "absolute", left: 0, top: 0, cursor: "pointer" }} />
                                </div>
                            </div>
                            <div style={{ cursor: state.wantChangeCate ? null : "pointer", marginTop: 15 }} onClick={() => setState({ wantChangeCate: true, indexChange: index })} className={state.wantChangeCate ? 'chooseCateSample wantChange' : 'chooseCateSample'}>
                                {state.wantChangeCate ? null : (
                                    <svg className='svgAppear' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                )}
                                <div className="sonChooseCateSample">
                                    {i.categories.length > 0 ? (
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", maxWidth: "100%" }}>
                                            {i.categories.map((u, indexU) => {
                                                return (
                                                    <div key={u} className="squareChoose">
                                                        <button type="button">x</button>
                                                        <p>{u}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : null}
                                    <div className="findChooseFather" style={{ width: i.categories.length < 1 ? "100%" : "60%" }}>
                                        <input style={{ pointerEvents: state.wantChangeCate ? null : "none" }} value={state.openCateChooseInput2} onChange={(e) => setState({ openCateChooseInput2: e.target.value })} type="text" className="findChoose" placeholder="Danh mục..." />
                                    </div>
                                </div>
                                <span onClick={() => state.openCateChooseButton2 ? setState({ openCateChooseButton2: false }) : setState({ openCateChooseButton2: true })}>{state.openCateChooseButton2 ? "▲" : "▼"}</span>
                                {state.openCateChooseButton2 || state.openCateChooseInputResult2 ? (
                                    <div className="autoCompleteChooseCate">
                                        {i.categories.length === 6 ? (
                                            <p style={{ margin: 0, fontFamily: "Oswald", color: "tomato", paddingLeft: 15 }}>Đã đạt tối đa 6 danh mục!</p>
                                        ) : null}
                                        {AllCate.filter((word) => state.openCateChooseInputResult2 ? word.includes(state.openCateChooseInputResult2) : word).map((z) => {
                                            return (
                                                i.categories.includes(z) ? null : (
                                                    <div onClick={() => i.categories.length === 6 ? null : wrapCateChoose(z)} key={z} className="autoCompleteResult">{z}</div>
                                                )
                                            )
                                        })}
                                    </div>
                                ) : null}
                            </div>
                            <div style={{ cursor: state.wantChangeSession ? null : "pointer" }} onClick={() => setState({ wantChangeSession: true, indexChange: index })} className={state.wantChangeSession ? 'sessionUnderAdd wantChange' : 'sessionUnderAdd'}>
                                {state.wantChangeSession ? null : (
                                    <svg className='svgAppear' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                )}
                                <button style={state.wantChangeSession ? null : { pointerEvents: "none" }} type="button" className="plusSession">+ Buổi</button>
                                {i.session.length > 0 ? (
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", maxWidth: "100%", pointerEvents: state.wantChangeSession ? null : "none" }}>
                                        {i.session.map((y, indexY) => {
                                            return (
                                                <div key={indexY} className="squareChoose plusSessionChooseButton">
                                                    <button>x</button>
                                                    <p>{y.title}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : null}
                            </div>
                            <div className='botContent'>
                                {state.wantDelete && state.indexChange === index ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <p className='textDate'>Bạn chắc chứ ? </p>
                                        <button onClick={() => deleteSamples(i._id)}>Xóa</button>
                                        <button onClick={() => setState({ wantDelete: false, indexChange: null })} style={{ background: "#999" }}>Hủy</button>
                                    </div>
                                ) : state.wantChangeTitle || state.updateThumbnail !== "" || state.wantChangeContent || state.wantChangeSession || state.wantChangeCate ? (
                                    state.indexChange === index ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <button style={{ background: "#904d03" }}>Cập nhật</button>
                                            <button onClick={() => setState({ wantChangeTitle: false, updateThumbnail: "", wantChangeContent: false, wantChangeSession: false, wantChangeCate: false, indexChange: null })} style={{ background: "#999" }}>Hủy</button>
                                        </div>
                                    ) : null
                                ) : (
                                    <button onClick={() => setState({ wantDelete: true, indexChange: index })} className='yesDelete'>Xóa hình</button>
                                )}
                                <p className='textDate'>{new Date(i.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    )
                })}
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
            <PlusSessionModal state={state} setState={setState} />
        </>
    )
}
export default SampleTabs