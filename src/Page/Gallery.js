import HeroBanner from "../Component/BlogPageComponent/HeroBanner"
import Slide6 from "../Assets/Image/Slide-6.jpg"
import GalleryAll from "../Component/GalleryPageComponent/GalleryAll"

function Gallery() {
    return (
        <>
            <HeroBanner page={"Hậu trường"} title={"Thành quả làm việc"} desc={"Đây là tổng hợp những thành quả làm việc của chúng tôi. Dựa trên những hình xăm tuyệt đẹp trên người của các khách hàng đã từng ghé xăm tại tiệm của chúng tôi."} img={Slide6} />

            <GalleryAll />
        </>
    )
}
export default Gallery