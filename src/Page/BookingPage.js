import HeroBanner from "../Component/BlogPageComponent/HeroBanner"
import image from "../Assets/Image/Slide-10.jpg"
import BookingSmall from "../Component/BookingPageComponent/BookingSmall"

function BookingPage() {
    return (
        <>
            <HeroBanner page={"Booking"} title={"Hẹn lịch xăm"} desc={"Hãy sắp xếp 1 lịch trống để đến với chúng tôi và hoàn thiện hình xăm tuyệt vời của bạn. Gửi chúng tôi ý tưởng và chúng tôi sẽ biến nó thành sự thật."} img={image} />

            <BookingSmall />
        </>
    )
}
export default BookingPage