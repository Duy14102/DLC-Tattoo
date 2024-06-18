import { NavLink } from "react-router-dom"
import "./TattooSample.css"

function TattooSample({ state, setState, params }) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);
    return (
        <>
            <div className="mainSample">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                    <select defaultValue={params.sorted} onChange={(e) => { window.location.href = `/TattooSamplePage/${e.target.value}/${params.cate}/${params.star}` }}>
                        <option value={"Newtoold"}>Mới nhất trước</option>
                        <option value={"Oldtonew"}>Cũ nhất trước</option>
                        <option value={"Bigsession"}>Nhiều buổi trước</option>
                        <option value={"Smallsession"}>Ít buổi trước</option>
                        <option value={"Lowprice"}>Giá thấp tới cao</option>
                        <option value={"Highprice"}>Giá cao tới thấp</option>
                    </select>
                </div>
                <div className="sampleCover">
                    {state.allSamples?.filter((star) => params.star === "1" ? star.rate.count <= 1 : params.star === "2" ? star.rate.count <= 2 : params.star === "3" ? star.rate.count <= 3 : params.star === "4" ? star.rate.count <= 4 : star.rate.count <= 5).map((i) => {
                        return (
                            <div key={i._id} className="insideSample">
                                <div className="coverImageX">
                                    <img alt="" src={i.thumbnail} width={"100%"} height={"100%"} />
                                    <button title="Yêu thích">❤︎</button>
                                </div>
                                <h5><NavLink reloadDocument>{i.title}</NavLink></h5>
                                <div className="downSample">
                                    <p>{i.session.data?.length > 0 ? i.session.data?.length : "1"} buổi • {i.price ? VND.format(i.price) : <a href="tel:+8400000000">Liên hệ</a>}</p>
                                    <span>{i.rate.count < 1 ? rating(5) : rating(i.rate.count)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
export default TattooSample