import { useEffect, useState } from "react"
import "./About.css"
import AboutImage from "../../Assets/Image/About.jpeg"

function About() {
    const [options, setOptions] = useState(1)

    const isInViewport = function (elem, anim) {
        var bounding = elem.getBoundingClientRect();
        if (window.innerHeight - bounding.top > 150) {
            elem.classList.remove("animHide")
            elem.classList.add("animated", anim)
        }
    };

    useEffect(() => {
        let lastKnownScrollPosition = 0;
        let ticking = false;
        function doSomething(scrollPos) {
            isInViewport(document.getElementById("animateRight1"), "fadeInRight")
            isInViewport(document.getElementById("animateRight2"), "fadeInRight")
            isInViewport(document.getElementById("animateLeft1"), "fadeInLeft")
            isInViewport(document.getElementById("animateLeft2"), "fadeInLeft")
        }

        document.addEventListener("scroll", (event) => {
            lastKnownScrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    doSomething(lastKnownScrollPosition);
                    ticking = false;
                });

                ticking = true;
            }
        });
    }, [])
    return (
        <div className="mainAbout">
            <div className="insideMainAbout">
                <div id="animateLeft1" className="insideMainAboutLine1 animHide">
                    <p className="titleSub">Thành lập từ năm 2014</p>
                    <p className="titleMain">DLC <span>Tattoo</span></p>
                    <p className="content">DLC tattoo là studio có đội thợ có nhiều năm kinh nghiệm tài năng nhất. Mang đến cho khách hàng có nhưng hình xăm ưng ý nhất. Chăm sóc khách hàng, bảo hành lâu năm nhất. Hãy đến DLC Tattoo để thấy sự khác biệt và chỉ trả tiền khi bạn hài lòng với kết quả bạn nhận được. Với dịch vụ chuyên nghiệp cùng tinh thần nghệ thuật và sáng tạo trong từng hình xăm, DLC Tattoo dẫn trở thành địa chỉ đáng tin cậy, được nhiều khách hàng yêu thích và ủng hộ.</p>
                </div>
                <img id="animateRight1" className="animHide" src={AboutImage} alt="" />
            </div>
            <hr className="upTimeHr" />
            <div className="insideMainAbout">
                <div id="animateLeft2" className="insideMainAboutLine1 animHide">
                    <p className="titleSub">Quá trình xăm</p>
                    <p className="titleMain">Xăm và <span>quá trình</span></p>
                    <p className="content">Đây là quá trình các bạn sẽ được trải qua. Từ các bước nhỏ nhất cho đến hoàn thiện hình xăm của mình, chúng tôi đảm bảo không một sai sót nào có thể xảy ra và hình xăm của các bạn sẽ được chúng tôi hoàn thiện 1 cách hoàn hảo nhất.</p>
                </div>
                <div id="animateRight2" className="borderForProcess animHide">
                    <div className="insideBorderForProcess">
                        <div onClick={() => setOptions(1)} className="titleRightUp">
                            <h4><span>1.</span> Chọn hình và tư vấn miễn phí</h4>
                            <button>{options === 1 ? "-" : "+"}</button>
                        </div>
                        {options === 1 ? (
                            <p style={{ marginBottom: 0 }} className="content sideContent">Liên hệ hoặc đến cửa hàng để thảo luận về hình xăm của bạn. Hãy đưa ra ý tưởng của bạn và chúng tôi sẽ hướng dẫn bạn cách biến nó thành hình xăm mà bạn yêu thích.</p>
                        ) : null}
                    </div>
                    <div className="insideBorderForProcess">
                        <div onClick={() => setOptions(2)} className="titleRightUp">
                            <h4><span>2.</span> Book lịch xăm tại cửa hàng</h4>
                            <button>{options === 2 ? "-" : "+"}</button>
                        </div>
                        {options === 2 ? (
                            <p style={{ marginBottom: 0 }} className="content sideContent">Khi bạn đã quyết định những gì bạn muốn, chúng tôi sẽ cung cấp cho bạn báo giá để bạn có thể đặt ngày xăm và thanh toán tiền đặt cọc.</p>
                        ) : null}
                    </div>
                    <div className="insideBorderForProcess">
                        <div onClick={() => setOptions(3)} className="titleRightUp">
                            <h4><span>3.</span> Tận hưởng hình xăm mới</h4>
                            <button>{options === 3 ? "-" : "+"}</button>
                        </div>
                        {options === 3 ? (
                            <p style={{ marginBottom: 0 }} className="content sideContent">Khi bạn đến cửa hàng, thợ xăm sẽ chuẩn bị sẵn thiết kế cho bạn. Bây giờ bạn đã ổn định và tận hưởng hình xăm mới của mình.</p>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default About