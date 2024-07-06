import axios from "axios"
import BlogLeftSide from "./BlogLeftSide"
import "./BlogNews.css"
import BlogRightSide from "./BlogRightSide"
import { useRef, useEffect, useReducer } from "react"

function BlogNews() {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        blog: null,
        pageCount: 6,
        search: "",
        contentSearch: null
    })
    const currentPage = useRef();
    const limit = 3

    useEffect(() => {
        currentPage.current = 1;
        getBlogs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch])

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
            setState({ blog: res.data.results.result, pageCount: res.data.results.pageCount })
        })
    }
    return (
        <div className="mainBlogNews">
            <BlogLeftSide getBlogs={getBlogs} currentPage={currentPage} state={state} />

            <BlogRightSide state={state} setState={setState} useEffect={useEffect} />
        </div>
    )
}
export default BlogNews