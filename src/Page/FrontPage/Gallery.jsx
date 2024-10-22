import { lazy } from "react"
import Slide6 from "../../Assets/Image/Slide-6.webp"
import { Helmet } from "react-helmet"
const HeroBanner = lazy(() => import("../../Component/BlogPageComponent/HeroBanner"))
const GalleryAll = lazy(() => import("../../Component/GalleryPageComponent/GalleryAll"))

function Gallery() {
    return (
        <>
            <Helmet>
                <title>DLC Tattoo | Hậu trường | Khoảnh khắc và kỷ niệm của khách hàng tại DLC Tattoo.</title>
                <meta name="description" content="DLC Tattoo | Hậu trường | Khoảnh khắc và kỷ niệm của khách hàng tại DLC Tattoo | Chiêm ngưỡng vẻ đẹp của những hình xăm được bàn tay ma thuật của các nghệ nhân DLC Tattoo trình bày." />
                <meta property="og:url" content="https://dlctattoo.netlify.app" />
                <meta property="og:site_name" content="DLC Tattoo" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:type" content="website" />
            </Helmet>

            <HeroBanner page={"Hậu trường"} title={"Thành quả làm việc"} desc={"Đây là tổng hợp những thành quả làm việc của chúng tôi. Dựa trên những hình xăm tuyệt đẹp trên người của các khách hàng đã từng ghé xăm tại tiệm của chúng tôi."} img={Slide6} />

            <GalleryAll />
        </>
    )
}
export default Gallery