import "./TattooSample.css"

function Filter({ params, type }) {
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
        window.location.href = type === 1 ? `/TattooSamplePage/${params.sorted}/${params.cate}/${params.star}` : `/FavouritePage/${params.sorted}/${params.cate}/${params.star}`
    }

    function hrefStar(e) {
        window.location.href = type === 1 ? `/TattooSamplePage/${params.sorted}/${params.cate}/${e}` : `/FavouritePage/${params.sorted}/${params.cate}/${e}`
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
                <p onClick={() => hrefStar('5')}>★★★★★<span style={{ color: params.star === "5" ? "#fff" : null }}> (5 sao)</span></p>
                <p onClick={() => hrefStar('4')}>★★★★☆<span style={{ color: params.star === "4" ? "#fff" : null }}> (4 sao)</span></p>
                <p onClick={() => hrefStar('3')}>★★★☆☆<span style={{ color: params.star === "3" ? "#fff" : null }}> (3 sao)</span></p>
                <p onClick={() => hrefStar('2')}>★★☆☆☆<span style={{ color: params.star === "2" ? "#fff" : null }}> (2 sao)</span></p>
                <p onClick={() => hrefStar('1')}>★☆☆☆☆<span style={{ color: params.star === "1" ? "#fff" : null }}> (1 sao)</span></p>
                <p onClick={() => hrefStar('All')}>☆☆☆☆☆<span style={{ color: params.star === "All" ? "#fff" : null }}> (Tất cả)</span></p>
            </div>
            <button onClick={() => { window.location.href = `/${type === 1 ? "TattooSamplePage" : "FavouritePage"}/Newtoold/All/All` }} className="deleteFil">Bỏ tất cả lọc</button>
        </div>
    )
}
export default Filter