import HTMLReactParser from 'html-react-parser/lib/index';
import JoditEditor from 'jodit-react';
import { useMemo, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import SearchBar from './SearchBar';

function BlogTabs({ axios, toast, ToastUpdate, useRef, useEffect }) {
    const toastNow = useRef(null)
    const currentPage = useRef();
    const limit = 4
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        title: "",
        subtitle: "",
        thumbnail: "",
        content: "",
        updateTitle: "",
        updateSubtitle: "",
        updateThumbnail: "",
        updateContent: "",
        search: "",
        contentSearch: null,
        wantAddBlog: false,
        wantChangeTitle: false,
        wantChangeSubtitle: false,
        wantChangeContent: false,
        wantDelete: false,
        appearWarning: false,
        indexChange: null,
        allBlogs: null,
        pageCount: 6
    })

    const config = useMemo(() => ({
        readonly: false,
        placeholder: "Điền nội dung blog..."
    }), []);

    useEffect(() => {
        currentPage.current = 1;
        getBlogs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getBlogs();
    }

    function getBlogs() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetBlogs`,
            params: {
                page: currentPage.current,
                limit: limit,
                search: state.contentSearch
            }
        }
        axios(configuration).then((res) => {
            setState({ allBlogs: res.data.results.result, pageCount: res.data.results.pageCount });
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

    function submitBlogs(e) {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/AddBlog`,
            data: {
                title: state.title,
                subtitle: state.subtitle,
                thumbnail: state.thumbnail,
                content: state.content
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ title: "", subtitle: "", thumbnail: "", content: "", wantAddBlog: false })
            getBlogs()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function deleteBlogs(e) {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/DeleteBlog`,
            data: {
                id: e
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ wantDelete: false, indexChange: null })
            getBlogs()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    function updateBlogs(e) {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateBlog`,
            data: {
                id: e,
                title: state.updateTitle,
                subtitle: state.updateSubtitle,
                thumbnail: state.updateThumbnail,
                content: state.updateContent
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            setState({ indexChange: null, wantChangeContent: false, wantChangeSubtitle: false, wantChangeTitle: false, updateContent: "", updateSubtitle: "", updateThumbnail: "", updateTitle: "", appearWarning: true })
            getBlogs()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
            setTimeout(() => {
                setState({ appearWarning: false })
            }, 5000);
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }

    return (
        <>
            <div className="topBlobTaps">
                <SearchBar state={state} setState={setState} useEffect={useEffect} />
                <button onClick={() => state.wantAddBlog ? setState({ wantAddBlog: false }) : setState({ wantAddBlog: true })} className="addNewBlog">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.wantAddBlog ? "M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z" : "M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"} /></svg> {state.wantAddBlog ? "Bỏ tạo" : "Tạo blog"}
                </button>
            </div>
            {state.wantAddBlog ? (
                <form onSubmit={(e) => submitBlogs(e)} className="formNewBlogs">
                    <p style={{ color: "#fff", fontFamily: "Oswald", margin: 0, textAlign: "end" }}>* Lưu ý : Ảnh nên dưới <b style={{ color: "#904d03" }}>1mb</b> để tối ưu website</p>
                    <div className='separateUp'>
                        <div className='titlePlace'>
                            <input rows={1} value={state.title} onChange={(e) => setState({ title: e.target.value })} placeholder="Tiêu đề..." required />
                            <textarea rows={3} value={state.subtitle} onChange={(e) => setState({ subtitle: e.target.value })} style={{ fontSize: 20, marginTop: 15, height: 120 }} placeholder="Tiêu đề phụ..." required />
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
                    <div style={{ border: "1px solid rgba(255,255,255,0.1)", width: "100%" }}>
                        <JoditEditor
                            required
                            value={state.content}
                            config={config}
                            tabIndex={1}
                            onChange={(e) => setState({ content: e })}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                        <button type='submit' className='yesForm yesNoButton'>Xong</button>
                        <button type='button' onClick={() => setState({ wantAddBlog: false })} className='noForm yesNoButton'>Hủy</button>
                    </div>
                </form>
            ) : null}
            {state.appearWarning ? (
                <p style={{ margin: 0, textAlign: "end", fontFamily: "Oswald,sans serif", letterSpacing: 1, color: "#999", fontSize: 14 }}>Lưu ý : Sau khi update ảnh hoặc nội dung hãy F5 để cập nhật!</p>
            ) : null}
            <div className='blogAllWrap'>
                {state.allBlogs?.map((i, index) => {
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
                                    <div onClick={() => setState({ wantChangeSubtitle: true, indexChange: index })} className={state.wantChangeSubtitle ? 'blogAllContentSubTitle wantChange' : 'blogAllContentSubTitle'}>
                                        <textarea onChange={(e) => setState({ updateSubtitle: e.target.value })} style={{ pointerEvents: state.wantChangeSubtitle && state.indexChange === index ? "auto" : "none" }} defaultValue={i.subtitle} />
                                        {state.wantChangeSubtitle ? null : (
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
                            {state.wantChangeContent && state.indexChange === index ? (
                                <div style={{ border: "1px solid rgba(255,255,255,0.1)", width: "100%" }}>
                                    <JoditEditor
                                        required
                                        value={HTMLReactParser(i.content).props.children}
                                        config={config}
                                        tabIndex={1}
                                        onChange={(e) => setState({ updateContent: e })}
                                    />
                                </div>
                            ) : (
                                <div onClick={() => setState({ wantChangeContent: true, indexChange: index })} className={state.wantChangeContent ? 'downContent wantChange' : 'downContent'}>
                                    <textarea style={{ pointerEvents: state.wantChangeContent ? "auto" : "none" }} defaultValue={HTMLReactParser(i.content).props.children} />
                                    <svg className='svgAppear' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                </div>
                            )}
                            <div className='botContent'>
                                {state.wantDelete && state.indexChange === index ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <p className='textDate'>Bạn chắc chứ ? </p>
                                        <button onClick={() => deleteBlogs(i._id)}>Xóa</button>
                                        <button onClick={() => setState({ wantDelete: false, indexChange: null })} style={{ background: "#999" }}>Hủy</button>
                                    </div>
                                ) : state.wantChangeTitle || state.wantChangeSubtitle || state.updateThumbnail !== "" || state.wantChangeContent ? (
                                    state.indexChange === index ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <button onClick={() => updateBlogs(i._id)} style={{ background: "#904d03" }}>Cập nhật</button>
                                            <button onClick={() => setState({ wantChangeTitle: false, wantChangeSubtitle: false, updateThumbnail: "", wantChangeContent: false, indexChange: null })} style={{ background: "#999" }}>Hủy</button>
                                        </div>
                                    ) : null
                                ) : (
                                    <button onClick={() => setState({ wantDelete: true, indexChange: index })} className='yesDelete'>Xóa blog</button>
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
        </>
    )
}
export default BlogTabs