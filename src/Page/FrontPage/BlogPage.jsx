import { lazy } from "react"
import image from "../../Assets/Image/Slide-1.webp"
import { Helmet } from "react-helmet"
const HeroBanner = lazy(() => import("../../Component/BlogPageComponent/HeroBanner"))
const BlogNews = lazy(() => import("../../Component/BlogPageComponent/BlogNewsBothSide/BlogNews"))

function BlogPage() {
    return (
        <>
            <Helmet>
                <title>DLC Tattoo | Blog | Tin tức, sự kiện và thông báo.</title>
                <meta name="description" content="DLC Tattoo | Blog | Tin tức, sự kiện và thông báo | Cập nhất tin sốt dẻo từ thế giới xăm hình." />
                <meta property="og:url" content="https://dlctattoo.netlify.app" />
                <meta property="og:site_name" content="DLC Tattoo" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:type" content="website" />
            </Helmet>

            <HeroBanner page={"Blog"} title={"Trends & sở thích"} desc={"Hãy tìm hiểu xem sở thích về hình xăm của bạn là gì, chúng tôi có đa dạng tin tức cũng như gợi ý trong những bài đăng để giúp bạn chọn lấy cho mình 1 hình xăm tuyệt vời."} img={image} />

            <BlogNews />
        </>
    )
}
export default BlogPage