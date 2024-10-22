import { lazy, useReducer } from "react"
import { Helmet } from "react-helmet"
const About = lazy(() => import("../../Component/HomePageComponent/About"))
const BlogSmall = lazy(() => import("../../Component/HomePageComponent/BlogSmall"))
const Booking = lazy(() => import("../../Component/HomePageComponent/Booking"))
const Service = lazy(() => import("../../Component/HomePageComponent/Services"))
const SlideShow = lazy(() => import("../../Component/HomePageComponent/SlideShow"))

function HomePage() {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        name: "",
        phone: "",
        date: "",
        time: "",
        note: "",
        cancelReason: "",
        haveBooking: null,
        wantUpdateBooking: false,
        wantDeleteBooking: false,
        bookingId: [],
        modalOpen2: false, samplesId: [], wantType: null, pageCount2: 6, samplesForAdd: null, search2: "", contentSearch2: null, moreSamples: false, allSamples: []
    })
    return (
        <>
            <Helmet>
                <title>DLC Tattoo | Trang chủ</title>
                <meta name="description" content="DLC Tattoo | Xăm đẹp và chất lượng | Sửa hình xăm | Nhận học viên đào tạo | Một hình xăm, một kỷ niệm." />
                <meta property="og:url" content="https://dlc-tattoo.netlify.app" />
                <meta property="og:site_name" content="DLC Tattoo" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:type" content="website" />
            </Helmet>
            
            <SlideShow />

            <About />

            <Booking type={1} state={state} setState={setState} />

            <div style={{ display: "flex", flexDirection: "column" }}>
                <Service />
                <div style={{ background: "#101010" }}>
                    <hr className="upTimeHr" style={{ margin: "0 auto" }} />
                </div>
                <BlogSmall />
            </div>

        </>
    )
}
export default HomePage