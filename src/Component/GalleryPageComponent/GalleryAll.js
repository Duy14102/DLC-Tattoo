import "./GalleryAll.css"
import image from "../../Assets/Image/Slide-2.jpeg"

function GalleryAll() {
    return (
        <div className="mainGallery">
            <div className="titleImage">
                Thư viện<span> ảnh</span>
            </div>
            <div className="imageFlex">
                <div className="imgInsideFlex" style={{ width: "49%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "49%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "32%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "32%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "32%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="moreImage">Xem thêm</button>
            </div>
            <div style={{ marginTop: 100, marginBottom: 100 }}>
                <hr className="upTimeHr" />
            </div>
            <div className="titleImage">
                Thư viện<span> video</span>
            </div>
            <div className="imageFlex">
                <div className="imgInsideFlex" style={{ width: "49%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "49%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "32%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "32%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
                <div className="imgInsideFlex" style={{ width: "32%" }}>
                    <img alt="" src={image} width={"100%"} height={"100%"} />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="moreImage">Xem thêm</button>
            </div>
        </div>
    )
}
export default GalleryAll