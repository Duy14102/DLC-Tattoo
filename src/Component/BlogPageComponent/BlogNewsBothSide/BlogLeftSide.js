import { NavLink } from "react-router-dom"
import newsImage1 from "../../../Assets/Image/Service-1.jpeg"

function BlogLeftSide() {
    return (
        <div className="mainLeft">
            <div className="news">
                <NavLink reloadDocument className="newsImage">
                    <img alt="" src={newsImage1} width={"100%"} height={500} />
                    <div className="dateNews">
                        <span>T2</span>
                        <i>14</i>
                    </div>
                </NavLink>
                <div className="post">
                    <NavLink className="upLink" reloadDocument to={"/BlogPage"}>Blog</NavLink>
                    <h5 className="downLink"><NavLink reloadDocument>Top 10 hình xăm cực chất</NavLink></h5>
                    <p className="postDescription">Đây là top 10 hình xăm cực chất dành cho bạn. Được chúng tôi chọn lựa từ hàng trăm, hàng nghìn kết quả cũng như tinh hoa của nghệ thuật xăm hình. Nếu cảm thấy 1 trong số chúng hợp với bạn thì đừng chần chừ liên hệ với chúng tôi và xăm ngay nào!</p>
                    <NavLink reloadDocument className="readMore">Xem thêm</NavLink>
                </div>
            </div>
            <div className="news">
                <NavLink reloadDocument className="newsImage">
                    <img alt="" src={newsImage1} width={"100%"} height={500} />
                </NavLink>
                <div className="post">
                    <NavLink className="upLink" reloadDocument to={"/BlogPage"}>Blog</NavLink>
                    <h5 className="downLink"><NavLink reloadDocument>Top 10 hình xăm cực chất</NavLink></h5>
                    <p className="postDescription">Đây là top 10 hình xăm cực chất dành cho bạn. Được chúng tôi chọn lựa từ hàng trăm, hàng nghìn kết quả cũng như tinh hoa của nghệ thuật xăm hình. Nếu cảm thấy 1 trong số chúng hợp với bạn thì đừng chần chừ liên hệ với chúng tôi và xăm ngay nào!</p>
                    <NavLink reloadDocument className="readMore">Xem thêm</NavLink>
                </div>
            </div>
        </div>
    )
}
export default BlogLeftSide