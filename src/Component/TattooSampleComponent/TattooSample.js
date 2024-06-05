import { NavLink } from "react-router-dom"
import "./TattooSample.css"
import { useState } from "react"

function TattooSample() {
    const [modal, setModal] = useState(false)
    return (
        <>
            <div className="mainSample">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                    <select>
                        <option value={null} hidden>Sắp xếp</option>
                        <option value={null}>Mới nhất trước</option>
                        <option value={null}>Cũ nhất trước</option>
                        <option value={null}>Giá cao tới thấp</option>
                        <option value={null}>Giá thấp tới cao</option>
                    </select>
                </div>
                <div className="sampleCover">
                    <div className="insideSample">
                        <div className="coverImageX">
                            <img onClick={() => setModal(true)} alt="" src="https://i.imgur.com/W86G8ER.jpg" width={"100%"} height={"100%"} />
                            <button title="Yêu thích">❤︎</button>
                        </div>
                        <h5><NavLink reloadDocument>Hình xăm phù thủy Merlin</NavLink></h5>
                        <div className="downSample">
                            <p>4 buổi • <a href="tel:+8400000000">Liên hệ</a></p>
                            <span>★★★★★</span>
                        </div>
                    </div>
                    <div className="insideSample">
                        <div className="coverImageX">
                            <img alt="" src="https://i.imgur.com/W86G8ER.jpg" width={"100%"} height={"100%"} />
                            <button title="Yêu thích">❤︎</button>
                        </div>
                    </div>
                    <div className="insideSample">
                        <div className="coverImageX">
                            <img alt="" src="https://i.imgur.com/W86G8ER.jpg" width={"100%"} height={"100%"} />
                            <button title="Yêu thích">❤︎</button>
                        </div>
                    </div>
                </div>
            </div>
            {modal ? (
                <div className="modal">
                    <button onClick={() => setModal(false)} className="closeModal">x</button>
                </div>
            ) : null}
        </>
    )
}
export default TattooSample