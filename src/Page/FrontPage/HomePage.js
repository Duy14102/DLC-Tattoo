import { useReducer } from "react"
import About from "../../Component/HomePageComponent/About"
import BlogSmall from "../../Component/HomePageComponent/BlogSmall"
import Booking from "../../Component/HomePageComponent/Booking"
import Service from "../../Component/HomePageComponent/Services"
import SlideShow from "../../Component/HomePageComponent/SlideShow"

function HomePage() {
    document.title = "DLC Tattoo - Trang chủ"
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
            <SlideShow />

            <About />

            <Booking type={1} state={state} setState={setState} />

            <Service />

            <div style={{ background: "#101010" }}>
                <hr className="upTimeHr" style={{ margin: "0 auto" }} />
            </div>

            <BlogSmall />
        </>
    )
}
export default HomePage