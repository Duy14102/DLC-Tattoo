import { NavLink } from "react-router-dom"

function BlogRightSide({ blog }) {
    return (
        <div className="mainRight">
            <div className="findPost">
                <form className="findPostForm">
                    <input placeholder="Tìm kiếm bài viết..." required />
                    <button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                    </button>
                </form>
            </div>
            <div className="recentPost">
                <h6>Bài đăng gần đây</h6>
                {blog?.map((i) => {
                    return (
                        <div className="recentPostPosts" key={i._id}>
                            <NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument>
                                <img src={i.thumbnail} alt="" width={"100%"} height={"100%"} />
                            </NavLink>
                            <NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument>{i.title}</NavLink>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default BlogRightSide