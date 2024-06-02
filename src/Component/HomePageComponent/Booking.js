import "./Booking.css"

function Booking() {
    return (
        <div className="mainBooking">
            <div className="insideMainBooking">
                <div style={{ marginBottom: 20, width: "48%" }}>
                    <p className="titleSub">Book lịch xăm</p>
                    <p className="titleMain">Hẹn ngày xăm</p>
                    <p className="content">Hãy chọn và xem xét ngày để chúng tôi sắp xếp cho bạn lịch trình xăm hoàn hảo nhất. Và hãy nhớ rằng sau khi đặt lịch chúng tôi sẽ liên hệ để thảo luận cũng như là tư vấn cho bạn nên hãy chú ý điện thoại!</p>
                    <div style={{ display: "flex", marginTop: 25, gap: 15, alignItems: "center" }}>
                        <svg style={{ width: 40, height: 40, fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>
                        <div>
                            <p className="titleSub">SĐT liên hệ</p>
                            <a href="tel:+8400000000" className="phoneClick">+84 000 000 00</a>
                        </div>
                    </div>
                </div>
                <form className="formBooking">
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <input type="text" placeholder="Họ và tên" required />
                        <input type="tel" placeholder="Số điện thoại" required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                        <input type="date" required />
                        <input type="time" required />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                        <input type="file" required />
                        <select required>
                            <option hidden value={null}>Vị trí xăm</option>
                            <option>Bắp tay</option>
                            <option>Cẳng tay</option>
                            <option>Bàn tay</option>
                            <option>Bắp chân</option>
                            <option>Cẳng chân</option>
                            <option>Bàn chân</option>
                            <option>Cổ</option>
                            <option>Sườn</option>
                            <option>Ngực</option>
                            <option>Bụng</option>
                            <option>Mông</option>
                            <option>Vai</option>
                            <option>Lưng</option>
                        </select>
                    </div>
                    <button type="submit">Book lịch xăm</button>
                </form>
            </div>
        </div>
    )
}
export default Booking