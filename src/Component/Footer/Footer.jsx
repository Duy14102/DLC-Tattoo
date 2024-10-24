import { NavLink } from "react-router-dom"
import "./Footer.css"

function Footer() {
    return (
        <>
            <div className="mainFooter">
                <div className="insideMainFooter">
                    <div className="children">
                        <span>Về chúng tôi</span>
                        <p style={{ marginTop: 15 }}>Đây là trang web duy nhất và chính thức của DLC Tattoo, mọi trang web khác đều là fake!</p>
                    </div>
                    <div className="children">
                        <span>Lịch làm việc</span>
                        <div style={{ marginTop: 15 }} className="timeLimit">
                            <p style={{ margin: 0 }}>Thứ hai</p>
                            <p style={{ margin: 0 }}>________________</p>
                            <p style={{ margin: 0 }}>10:00 - 20:00</p>
                        </div>
                        <div className="timeLimit">
                            <p>Thứ ba</p>
                            <p>________________</p>
                            <p>10:00 - 20:00</p>
                        </div>
                        <div className="timeLimit">
                            <p>Thứ tư</p>
                            <p>________________</p>
                            <p>10:00 - 20:00</p>
                        </div>
                        <div className="timeLimit">
                            <p>Thứ năm</p>
                            <p>________________</p>
                            <p>10:00 - 20:00</p>
                        </div>
                        <div className="timeLimit">
                            <p>Thứ sáu</p>
                            <p>________________</p>
                            <p>10:00 - 20:00</p>
                        </div>
                        <div className="timeLimit">
                            <p>Thứ bảy</p>
                            <p>________________</p>
                            <p>10:00 - 20:00</p>
                        </div>
                        <div className="timeLimit">
                            <p>Chủ nhật</p>
                            <p>________________</p>
                            <p>Nghỉ</p>
                        </div>
                    </div>
                    <div className="children">
                        <span>Liên hệ</span>
                        <div style={{ marginTop: 15 }} className="social">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>
                            <p>Số 10 đường 10 TP.HCM</p>
                        </div>
                        <div className="social" style={{ marginTop: 20 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>
                            <a href="tel:+8400000000"><p>+84 000 000 00</p></a>
                        </div>
                        <div className="social emote" style={{ marginTop: 20 }}>
                            <NavLink aria-label="Facebook" to="https://www.facebook.com">
                                <svg className="facebook" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" /></svg>
                            </NavLink>
                            <NavLink aria-label="Instagram" to="https://www.instagram.com">
                                <svg className="instagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>
                            </NavLink>
                            <NavLink aria-label="Telegram" to="https://web.telegram.org">
                                <svg className="telegram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" /></svg>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p style={{ margin: 0 }}>Copyright 2024 © <a href="/"><b>DLC Tattoo</b></a></p>
            </div>
        </>
    )
}
export default Footer