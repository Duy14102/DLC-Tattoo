import axios from "axios"
import BlogLeftSide from "./BlogLeftSide"
import "./BlogNews.css"
import BlogRightSide from "./BlogRightSide"
import { useRef, useState, useEffect } from "react"

function BlogNews() {
    const [pageCount, setPageCount] = useState(6);
    const [blog, setBlog] = useState(null)
    const currentPage = useRef();
    const limit = 3

    useEffect(() => {
        currentPage.current = 1;
        getBlogs()
    }, [])

    function getBlogs() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetBlogs`,
            params: {
                page: currentPage.current,
                limit: limit
            }
        }
        axios(configuration).then((res) => {
            setBlog(res.data.results.result)
            setPageCount(res.data.results.pageCount)
        })
    }
    return (
        <div className="mainBlogNews">
            <BlogLeftSide getBlogs={getBlogs} currentPage={currentPage} blog={blog} pageCount={pageCount} />

            <BlogRightSide blog={blog} />
        </div>
    )
}
export default BlogNews