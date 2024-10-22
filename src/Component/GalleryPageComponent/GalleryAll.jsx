import "./GalleryAll.css"
import { useEffect, useReducer } from "react"
import axios from "axios"
import { LazyLoadImage } from "react-lazy-load-image-component"

function GalleryAll() {
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        allGallerys: null,
        seeMoreImage: false,
        seeMoreVideo: false,
    })

    useEffect(() => {
        GetGal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function GetGal() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetGallerys`,
        }
        axios(configuration).then((res) => {
            setState({ allGallerys: res.data })
        }).catch((err) => console.log(err))
    }
    return (
        <div className="mainGallery">
            {state.allGallerys?.filter((item) => item.title === "image").length > 0 ? (
                <>
                    <div className="titleImage">
                        Thư viện<span> ảnh</span>
                    </div>
                    <div className="imageFlex">
                        {state.allGallerys?.filter((item) => item.title === "image").slice(0, state.seeMoreImage ? 8 : 5).map((i, index) => {
                            return (
                                <div onClick={() => window.location.href = i.data} key={i._id} className="imgInsideFlex" style={index === 3 || index === 4 ? { width: "49%", height: 400 } : { width: "32%", height: 300 }}>
                                    <LazyLoadImage alt="Image" src={i.data} width={"100%"} height={"100%"} />
                                </div>
                            )
                        })}
                    </div>
                    {state.allGallerys?.filter((item) => item.title === "image").length > 5 ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button onClick={() => state.seeMoreImage ? setState({ seeMoreImage: false }) : setState({ seeMoreImage: true })} className="moreImage">{state.seeMoreImage ? "Thu gọn" : "Xem thêm"}</button>
                        </div>
                    ) : null}
                    <div style={{ marginTop: 100, marginBottom: 100 }}>
                        <hr className="upTimeHr" />
                    </div>
                </>
            ) : null}
            {state.allGallerys?.filter((item) => item.title === "video").length > 0 ? (
                <>
                    <div className="titleImage">
                        Thư viện<span> video</span>
                    </div>
                    <div className="imageFlex">
                        {state.allGallerys?.filter((item) => item.title === "video").slice(0, state.seeMoreVideo ? 8 : 5).map((i, index) => {
                            return (
                                <div key={i._id} className="imgInsideFlex" style={index === 3 || index === 4 ? { width: "49%", height: 400 } : { width: "32%", height: 300 }}>
                                    <iframe title={i.data} src={i.data} width={"100%"} height={"100%"} />
                                </div>
                            )
                        })}
                    </div>
                    {state.allGallerys?.filter((item) => item.title === "video").length > 5 ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button onClick={() => state.seeMoreVideo ? setState({ seeMoreVideo: false }) : setState({ seeMoreVideo: true })} className="moreImage">{state.seeMoreVideo ? "Thu gọn" : "Xem thêm"}</button>
                        </div>
                    ) : null}
                </>
            ) : null}
        </div>
    )
}
export default GalleryAll