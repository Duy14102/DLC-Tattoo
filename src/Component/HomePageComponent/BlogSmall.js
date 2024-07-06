import "./BlogSmall.css"
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { NavLink } from "react-router-dom";
import { useEffect, useReducer } from "react";
import axios from "axios";

function BlogSmall() {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        blogs: []
    })
    useEffect(() => {
        getBlogs()
    }, [])

    function getBlogs() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetBlogsForHomepage`,
        }
        axios(configuration).then((res) => {
            setState({ blogs: res.data })
        })
    }
    const stateCarousel = {
        responsive: {
            0: {
                items: 1,
            },
            991: {
                items: 2,
            },
        },
    }
    return (
        <div className="mainBlogSmall">
            <div style={{ marginBottom: 20 }}>
                <p className="titleSub">Blog tin tức</p>
                <p className="titleMain">Bài viết mới</p>
            </div>
            {state.blogs.length > 0 ? (
                <OwlCarousel items={state.blogs.length === 1 ? 1 : 2}
                    className="owl-theme"
                    loop={true}
                    dots={true}
                    autoplay={false}
                    rewind={true}
                    lazyLoad={true}
                    responsive={window.innerWidth > 991 ? null : stateCarousel.responsive}
                    autoplayTimeout={5000}
                    margin={30} >
                    {state.blogs.map((i) => {
                        return (
                            <div key={i._id} className="blogCarousel">
                                <NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument className="blogImg">
                                    <img src={i.thumbnail} alt="" width={"100%"} height={"100%"} />
                                </NavLink>
                                <div className="blogDescription">
                                    <h4><NavLink to={`/ReadBlogPage/${i._id}`} reloadDocument>{i.title}</NavLink></h4>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <NavLink to={"/BlogPage"} reloadDocument className="BlogHref">Blog</NavLink>
                                        <p className="SideBlogHref">{new Date(i.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </OwlCarousel>
            ) : (
                <div className="noBlogsExists">Hiện không có blogs.</div>
            )}
        </div>
    )
}
export default BlogSmall