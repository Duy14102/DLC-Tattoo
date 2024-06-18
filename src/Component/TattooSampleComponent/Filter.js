import "./TattooSample.css"

function Filter({ params }) {
    const filter = ["Bắp tay", "Cẳng tay", "Bàn tay", "Bắp chân", "Cẳng chân", "Bàn chân", "Cổ", "Sườn", "Ngực", "Bụng", "Vai", "Lưng"]

    function changeCate(e, cate) {
        if (!e.target.checked) {
            params.cate = params.cate.replace(cate, "")
            if (params.cate === "") {
                params.cate = "All"
            }
        } else if (e.target.checked) {
            params.cate += cate
            if (params.cate.includes("All")) {
                params.cate = params.cate.replace("All", "")
            }
        }
        window.location.href = `/TattooSamplePage/${params.sorted}/${params.cate}/${params.star}`
    }
    return (
        <div className="mainFilter">
            <div className="titleFilter">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" /></svg>
                <h5>Bộ lọc hình xăm</h5>
            </div>
            <p className="filterTitle">Theo danh mục</p>
            <div className="filterByCate">
                {filter.map((i, index) => {
                    return (
                        <div key={index} className="filterOptions">
                            <input onClick={(e) => changeCate(e, `,${i}`)} defaultChecked={params.cate.includes(i) ? "checked" : null} type="checkbox" id="box1" />
                            <label htmlFor="box1">{i}</label>
                        </div>
                    )
                })}
            </div>
            <p className="filterTitle">Theo đánh giá</p>
            <div className="filterByStar">
                <p onClick={() => { window.location.href = `/TattooSamplePage/${params.sorted}/${params.cate}/5` }}>★★★★★<span> (5 sao)</span></p>
                <p onClick={() => { window.location.href = `/TattooSamplePage/${params.sorted}/${params.cate}/4` }}>★★★★☆<span> (4 sao)</span></p>
                <p onClick={() => { window.location.href = `/TattooSamplePage/${params.sorted}/${params.cate}/3` }}>★★★☆☆<span> (3 sao)</span></p>
                <p onClick={() => { window.location.href = `/TattooSamplePage/${params.sorted}/${params.cate}/2` }}>★★☆☆☆<span> (2 sao)</span></p>
                <p onClick={() => { window.location.href = `/TattooSamplePage/${params.sorted}/${params.cate}/1` }}>★☆☆☆☆<span> (1 sao)</span></p>
            </div>
            <button onClick={() => { window.location.href = "/TattooSamplePage/Newtoold/All/All" }} className="deleteFil">Bỏ tất cả lọc</button>
        </div>
    )
}
export default Filter