import About from "../Component/HomePageComponent/About"
import BlogSmall from "../Component/HomePageComponent/BlogSmall"
import Booking from "../Component/HomePageComponent/Booking"
import Service from "../Component/HomePageComponent/Services"
import SlideShow from "../Component/HomePageComponent/SlideShow"

function HomePage() {
    document.title = "DLC Tattoo - Trang chủ"
    return (
        <>
            <SlideShow />

            <About />

            <Booking />

            <Service />

            <BlogSmall />
        </>
    )
}
export default HomePage