import "./Service.css"
import ServiceImage1 from "../../Assets/Image/Service-1.jpeg"
import ServiceImage2 from "../../Assets/Image/Service-2.jpeg"
import ServiceImage3 from "../../Assets/Image/Service-3.jpeg"
import { useEffect } from "react"

function Service() {
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
            isInViewport(document.getElementById("animateRight3"), "fadeInRight")
            isInViewport(document.getElementById("animateRight4"), "fadeInRight")
            isInViewport(document.getElementById("animateRight5"), "fadeInRight")
            isInViewport(document.getElementById("animateLeft3"), "fadeInLeft")
            isInViewport(document.getElementById("animateLeft4"), "fadeInLeft")
            isInViewport(document.getElementById("animateLeft5"), "fadeInLeft")
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
        <div className="mainService">
            <div style={{ marginBottom: 30 }}>
                <p className="titleSub">Dịch vụ của chúng tôi</p>
                <p className="titleMain">Dịch vụ chính</p>
            </div>
            <div className="insideBox">
                <div id="animateLeft3" className="animHide hoverServicesImage" >
                    <img src={ServiceImage1} alt="" />
                </div>
                <div id="animateRight3" className="animHide textInBox">
                    <div className="insideTextInBox">
                        <h1>01</h1>
                        <div>
                            <h5>Xăm hình</h5>
                            <p>DLC Tattoo với hơn 10 năm kinh nghiệm trong nghề xăm hình nghệ thuật, các thợ xăm ở đây sẽ mang đến cho bạn những hình xăm ưng ý nhất, kể cả những khách hàng khó tính nhất. DLC Tattoo, địa chỉ xăm chất lượng uy tín tại TP.HCM chính là điểm đến hoàn hảo và mang lại nhiều sự hài lòng nhất cho các bạn!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="insideBox specialInBox" style={{ marginTop: 30 }}>
                <div id="animateLeft4" className="animHide textInBox">
                    <div className="insideTextInBox">
                        <h1>02</h1>
                        <div>
                            <h5>Sửa xăm</h5>
                            <p>Những hình xăm xấu, lỗi luôn gây rất nhiều bất tiện với người có hình xăm. Không chỉ là sự tự ti, luôn tìm cách giấu nó đi, hay tìm mọi cách để xóa bỏ. Còn là những lo sợ về ánh nhìn của mọi người về những hình xăm “đáng buồn cười” này. Nhưng đừng lo DLC tattoo là nơi sẽ giúp bạn sửa chữa những hình xăm này!</p>
                        </div>
                    </div>
                </div>
                <div id="animateRight4" className="animHide hoverServicesImage" >
                    <img src={ServiceImage2} alt="" />
                </div>
            </div>
            <div className="insideBox" style={{ marginTop: 30 }}>
                <div id="animateLeft5" className="animHide hoverServicesImage" >
                    <img src={ServiceImage3} alt="" />
                </div>
                <div id="animateRight5" className="animHide textInBox">
                    <div className="insideTextInBox">
                        <h1>03</h1>
                        <div>
                            <h5>Đào tạo học viên</h5>
                            <p>Để đáp ứng nhu cầu xăm hình đang ngày một nở rộ và góp phần đưa ngành Tattoo Vn đi lên chúng tôi quyết định mở ra khóa học để tiếp nối cho những bạn thật sự đam mê và yêu thích bộ môn nghệ thuật này theo 1 cách giảng dạy chuyên ngiệp, hiệu quả nhất!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Service
