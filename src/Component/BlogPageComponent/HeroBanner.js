import { NavLink } from "react-router-dom"
import "./HeroBanner.css"

function HeroBanner({ page, title, desc, img }) {
    return (
        <div style={{ backgroundImage: `url(${img})` }} className="mainHeroBanner">
            <div className="textHeroBanner">
                <h5 className="addressBar"><NavLink reloadDocument to={"/"}>Home</NavLink> / {page}</h5>
                <h1 className="titleText">{title}</h1>
                <p className="titleDescription">{desc}</p>
            </div>
        </div>
    )
}
export default HeroBanner