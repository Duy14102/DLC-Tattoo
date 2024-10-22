import { useEffect, useState } from "react";
import "./SlideShow.css"
import { NavLink } from "react-router-dom"
import Slide1 from "../../Assets/Image/Slide-1.webp"
import Slide2 from "../../Assets/Image/Slide-2.webp"
import Slide3 from "../../Assets/Image/Slide-3.webp"
import { LazyLoadImage } from "react-lazy-load-image-component";

function SlideShow() {
    let images = [Slide2, Slide3, Slide1];
    const [imageState, setImageState] = useState(images[0])

    useEffect(() => {
        let index = 0;
        setInterval(() => {
            index > 1 ? index = 0 : index++;
            setImageState(images[index])
        }, 10000);
    }, [])
    return (
        <div className="image-wrap">
            <LazyLoadImage id="mainPhoto" alt="Image" src={imageState} />
            <div className="textInSlide">
                <h6 className="firstLine">Chào mừng đến với DLC Tattoo</h6>
                <h1>Một hình xăm <br /><span>Một kỉ niệm</span></h1>
                <div style={{ marginTop: 30 }}>
                    <NavLink to={"/BookingPage"} reloadDocument>Book lịch xăm</NavLink>
                </div>
            </div>
        </div>
    )
}
export default SlideShow