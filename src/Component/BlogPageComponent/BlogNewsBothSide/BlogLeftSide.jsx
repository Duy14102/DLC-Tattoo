import { NavLink } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { LazyLoadImage } from "react-lazy-load-image-component";

function BlogLeftSide({ getBlogs, currentPage, state }) {
    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getBlogs();
    }
    return (
        <div className="mainLeft">
            {state.blog?.map((i) => {
                return (
                    <div key={i._id} className="news">
                        <NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument className="newsImage">
                            <LazyLoadImage alt="Image" src={i.thumbnail} width={"100%"} height={500} />
                            <div className="dateNews">
                                <span>T{new Date(i.createdAt).getMonth("vi-VN")}</span>
                                <i>{new Date(i.createdAt).getDate("vi-VN")}</i>
                            </div>
                        </NavLink>
                        <div className="post">
                            <NavLink className="upLink" reloadDocument to={"/BlogPage"}>Blog</NavLink>
                            <h5 className="downLink"><NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument>{i.title}</NavLink></h5>
                            <p className="postDescription">{i.subtitle}</p>
                            <NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument className="readMore">Xem thêm</NavLink>
                        </div>
                    </div>
                )
            })}
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
        </div>
    )
}
export default BlogLeftSide