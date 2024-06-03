import BlogLeftSide from "./BlogLeftSide"
import "./BlogNews.css"
import BlogRightSide from "./BlogRightSide"

function BlogNews() {
    return (
        <div className="mainBlogNews">
            <BlogLeftSide />

            <BlogRightSide />
        </div>
    )
}
export default BlogNews