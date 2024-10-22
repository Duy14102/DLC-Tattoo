import { lazy } from "react"
import image from "../../Assets/Image/Slide-10.webp"
import { Helmet } from "react-helmet"
const HeroBanner = lazy(() => import("../../Component/BlogPageComponent/HeroBanner"))
const BookingSmall = lazy(() => import("../../Component/BookingPageComponent/BookingSmall"))

function BookingPage() {
    return (
        <>
            <Helmet>
                <title>DLC Tattoo | Booking | Đặt lịch xăm mọi lúc mọi nơi.</title>
                <meta name="description" content="DLC Tattoo | Booking | Đặt lịch xăm mọi lúc mọi nơi | Chọn hình xăm và giao cho chúng tôi, những tay bút nghệ thuật của DLC Tattoo chắc chắn sẽ cho bạn một sản phẩm chất lượng nhất." />
                <meta property="og:url" content="https://dlc-tattoo.netlify.app" />
                <meta property="og:site_name" content="DLC Tattoo" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:type" content="website" />
            </Helmet>

            <HeroBanner page={"Booking"} title={"Hẹn lịch xăm"} desc={"Hãy sắp xếp 1 lịch trống để đến với chúng tôi và hoàn thiện hình xăm tuyệt vời của bạn. Gửi chúng tôi ý tưởng và chúng tôi sẽ biến nó thành sự thật."} img={image} />

            <BookingSmall />
        </>
    )
}
export default BookingPage