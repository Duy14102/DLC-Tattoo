import { NavLink } from "react-router-dom"
import "./HeroBanner.css"

function HeroBanner({ page, page2, title, desc, img }) {
    return (
        <div style={{ backgroundImage: `url(${img})` }} className="mainHeroBanner">
            <div className="textHeroBanner">
                {page2 ? (
                    <h5 style={{ animationDelay: "0.5s" }} className="addressBar animated fadeInUp"><NavLink reloadDocument to={"/"}>Home</NavLink> / <NavLink className={"specialAdd"} reloadDocument to={page === "Blog" ? "/BlogPage" : null}>{page}</NavLink> / {page2}</h5>
                ) : (
                    <h5 style={{ animationDelay: "0.5s" }} className="addressBar animated fadeInUp"><NavLink reloadDocument to={"/"}>Home</NavLink> / {page}</h5>
                )}
                <div style={{ animationDelay: "0.7s" }} className="coverTitleText animated fadeInUp">
                    <h1 className="titleText">{title}</h1>
                </div>
                <p style={{ animationDelay: "0.9s" }} className="titleDescription animated fadeInUp">{desc}</p>
            </div>
        </div>
    )
}
export default HeroBanner