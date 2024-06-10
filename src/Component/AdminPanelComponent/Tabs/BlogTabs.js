import JoditEditor from 'jodit-react';
import { useMemo, useReducer } from 'react';

function BlogTabs({ axios, toast, ToastUpdate, useRef }) {
    const toastNow = useRef(null)
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        title: "",
        subtitle: "",
        thumbnail: "",
        content: "",
        wantAddBlog: false
    })

    const config = useMemo(() => ({
        readonly: false,
        placeholder: "Điền nội dung blog..."
    }), []);

    function convertToBase64(e) {
        var reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setState({ thumbnail: reader.result })
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
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <>
            <div className="topBlobTaps">
                <form className="findSomething">
                    <input type="date" placeholder="Tìm kiếm..." required />
                </form>
                <button onClick={() => state.wantAddBlog ? setState({ wantAddBlog: false }) : setState({ wantAddBlog: true })} className="addNewBlog">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d={state.wantAddBlog ? "M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z" : "M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"} /></svg> {state.wantAddBlog ? "Bỏ tạo" : "Tạo blog"}
                </button>
            </div>
            {state.wantAddBlog ? (
                <form onSubmit={(e) => submitBlogs(e)} className="formNewBlogs">
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
                            <input onChange={convertToBase64} type='file' required />
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
                        <button type='submit' className='yesForm'>Xong</button>
                        <button type='button' onClick={() => setState({ wantAddBlog: false })} className='noForm'>Hủy</button>
                    </div>
                </form>
            ) : null}
        </>
    )
}
export default BlogTabs