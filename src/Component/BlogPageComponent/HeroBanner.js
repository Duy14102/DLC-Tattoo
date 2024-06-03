import { NavLink } from "react-router-dom"
import "./HeroBanner.css"

function HeroBanner() {
    return (
        <div className="mainHeroBanner">
            <div className="textHeroBanner">
                <h5 className="addressBar"><NavLink reloadDocument to={"/"}>Home</NavLink> / Blog</h5>
                <h1 className="titleText">Trends & sở thích</h1>
                <p className="titleDescription">Hãy tìm hiểu xem sở thích về hình xăm của bạn là gì, chúng tôi có đa dạng tin tức cũng như gợi ý trong những bài đăng để giúp bạn chọn lấy cho mình 1 hình xăm tuyệt vời.</p>
            </div>
        </div>
    )
}
export default HeroBanner