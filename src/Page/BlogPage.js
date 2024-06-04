import BlogNews from "../Component/BlogPageComponent/BlogNewsBothSide/BlogNews"
import HeroBanner from "../Component/BlogPageComponent/HeroBanner"
import image from "../Assets/Image/Slide-1.jpeg"

function BlogPage() {
    return (
        <>
            <HeroBanner page={"Blog"} title={"Trends & sở thích"} desc={"Hãy tìm hiểu xem sở thích về hình xăm của bạn là gì, chúng tôi có đa dạng tin tức cũng như gợi ý trong những bài đăng để giúp bạn chọn lấy cho mình 1 hình xăm tuyệt vời."} img={image} />

            <BlogNews />
        </>
    )
}
export default BlogPage