import "./BlogSmall.css"
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Blog1 from "../../Assets/Image/Blog-1.jpeg"
import Blog2 from "../../Assets/Image/Blog-2.jpeg"
import { NavLink } from "react-router-dom";

function BlogSmall() {
    const state = {
        responsive: {
            0: {
                items: 1,
            },
            200: {
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
            <OwlCarousel items={2}
                className="owl-theme"
                loop={true}
                dots={true}
                autoplay={false}
                rewind={true}
                lazyLoad={true}
                responsive={window.innerWidth <= 991 ? state.responsive : null}
                autoplayTimeout={5000}
                margin={30} >
                <div className="blogCarousel">
                    <img src={Blog1} alt="" width={"100%"} height={"100%"} />
                    <div className="blogDescription">
                        <h4><NavLink reloadDocument>Top 10 hình xăm nên xăm</NavLink></h4>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <NavLink reloadDocument className="BlogHref">Blog</NavLink>
                            <p className="SideBlogHref">1 tháng 6</p>
                        </div>
                    </div>
                </div>
                <div className="blogCarousel">
                    <img src={Blog2} alt="" width={"100%"} height={"100%"} />
                    <div className="blogDescription">
                        <h4><NavLink reloadDocument>Ý tưởng hình xăm lưng cực chất</NavLink></h4>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <NavLink reloadDocument className="BlogHref">Blog</NavLink>
                            <p className="SideBlogHref">1 tháng 6</p>
                        </div>
                    </div>
                </div>
                <div className="blogCarousel">
                    <img src={Blog1} alt="" width={"100%"} height={"100%"} />
                    <div className="blogDescription">
                        <h4><NavLink reloadDocument>Câu chuyện đằng sau nghề xăm</NavLink></h4>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <NavLink reloadDocument className="BlogHref">Blog</NavLink>
                            <p className="SideBlogHref">1 tháng 6</p>
                        </div>
                    </div>
                </div>
            </OwlCarousel>
        </div>
    )
}
export default BlogSmall