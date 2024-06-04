import { useEffect } from "react";
import "./SlideShow.css"
import { NavLink } from "react-router-dom"
import Slide1 from "../../Assets/Image/Slide-1.jpeg"
import Slide2 from "../../Assets/Image/Slide-2.jpeg"
import Slide3 from "../../Assets/Image/Slide-3.jpg"

function SlideShow() {
    let images = [Slide2, Slide3, Slide1];
    useEffect(() => {
        const imgElement = document.querySelector('#mainPhoto');
        let index = 0;
        function change() {
            imgElement.src = images[index];
            index > 1 ? index = 0 : index++;
        }
        setInterval(() => {
            change()
        }, 15000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="image-wrap">
            <img id="mainPhoto" alt="" src={Slide1} />
            <div className="textInSlide">
                <h6 className="firstLine">Chào mừng đến với DLC Tattoo</h6>
                <h1>Một hình xăm <br /><span>Một kỉ niệm</span></h1>
                <div style={{ marginTop: 30 }}>
                    <NavLink reloadDocument>Book lịch xăm</NavLink>
                </div>
            </div>
        </div>
    )
}
export default SlideShow