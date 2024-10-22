import { NavLink } from "react-router-dom"
import ViewSampleModal from "../Modal/ViewSampleModal";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import ToastUpdate from "../Toastify/ToastUpdate";
import ToastSuccess from "../Toastify/ToastSuccess";
import ToastError from "../Toastify/ToastError";
import { jwtDecode } from "jwt-decode";
import FavouriteBookingModal from "../Modal/FavouriteBookingModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactPaginate from "react-paginate";

function TattooSample({ state, setState, params, useEffect, getSamples, useRef, axios, type, currentPage, callBackSamples }) {
    const toastNow = useRef(null)
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);

    const get1 = localStorage.getItem("successAddFav")
    const get2 = localStorage.getItem("successDelFav")
    useEffect(() => {
        if (get1) {
            localStorage.removeItem("successAddFav")
            ToastSuccess({ message: get1 })
        }
        if (get2) {
            localStorage.removeItem("successDelFav")
            ToastSuccess({ message: get2 })
        }
    }, [get1, get2])

    function addFav(e) {
        var stored = JSON.parse(localStorage.getItem("favourites"));
        if (stored) {
            stored.push(e);
            localStorage.setItem("favourites", JSON.stringify(stored));
        } else {
            const dataPush = []
            dataPush.push(e)
            localStorage.setItem("favourites", JSON.stringify(dataPush));
        }
        localStorage.setItem("successAddFav", "Yêu thích thành công!")
        window.location.reload()
    }

    function delFav(e) {
        var stored = JSON.parse(localStorage.getItem("favourites"));
        var checked = stored.indexOf(e)
        if (checked > -1) {
            stored.splice(checked, 1)
        }
        localStorage.setItem("favourites", JSON.stringify(stored));
        if (stored.length < 1) {
            localStorage.removeItem("favourites")
        }
        localStorage.setItem("successDelFav", "Bỏ yêu thích thành công!")
        window.location.reload()
    }

    function rateThis(e, i) {
        if (!token) {
            return ToastError({ message: "Chưa đăng nhập!" })
        }
        const checkExists = i.rate.data.some(item => item.id === jwtDecode(token).userId)
        if (token && checkExists) {
            return ToastError({ message: "Đã đánh giá rồi!" })
        } else if (token && !checkExists) {
            const dataSend = { id: jwtDecode(token).userId, star: parseInt(e) }
            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_apiAddress}/api/v1/RateStar`,
                data: {
                    id: i._id,
                    dataSend: dataSend
                }
            }
            toastNow.current = toast.loading("Chờ một chút...")
            axios(configuration).then((res) => {
                getSamples()
                ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
            }).catch((err) => {
                ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
            })
        }
    }

    function filterStar(star) {
        var orderStar = star.rate.count / star.rate.data.length
        if (params.star === "1") {
            return orderStar < 2
        }
        else if (params.star === "2") {
            return orderStar < 3 && orderStar >= 2
        }
        else if (params.star === "3") {
            return orderStar < 4 && orderStar >= 3
        }
        else if (params.star === "4") {
            return orderStar < 5 && orderStar >= 4
        }
        else if (params.star === "5") {
            return orderStar === 5
        } else {
            return star.rate.count >= 0
        }
    }

    function pushBookingId(e) {
        const dataPush = state.bookingId
        if (dataPush.filter(item => item.id === e).length > 0) {
            dataPush.filter((item) => {
                if (item.id === e) {
                    dataPush.splice(dataPush.indexOf(item), 1)
                }
                return dataPush
            })
            return setState({ bookingId: dataPush })
        } else {
            dataPush.push({ id: e, type: 1 })
            return setState({ bookingId: dataPush })
        }
    }

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        callBackSamples();
    }
    return (
        <>
            <div className="mainSample">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginBottom: 20 }}>
                    {type === 2 && !localStorage.getItem("bookingSave") ? (
                        state.wantBooking ? (
                            <>
                                {state.warningBooking ? (
                                    <div style={{ color: "tomato" }} className="textAdviceBooking">Chọn ít nhất 1!</div>
                                ) : (
                                    <div className="textAdviceBooking">Nhấn vào hình để chọn!</div>
                                )}
                                <button onClick={() => setState(state.bookingId.length < 1 ? { warningBooking: true } : { modalFav: true })} className="startBooking">Xong</button>
                                <button onClick={() => setState({ wantBooking: false, bookingId: [], warningBooking: false })} className="cancelStartBooking">Hủy</button>
                            </>
                        ) : (
                            <button onClick={() => setState({ wantBooking: true })} className="startBooking">Booking</button>
                        )
                    ) : null}
                    <select defaultValue={params.sorted} onChange={(e) => { window.location.href = `/${type === 1 ? "TattooSamplePage" : "FavouritePage"}/${e.target.value}/${params.cate}/${params.star}` }}>
                        <option value={"Newtoold"}>Mới nhất trước</option>
                        <option value={"Oldtonew"}>Cũ nhất trước</option>
                        <option value={"Bigsession"}>Nhiều buổi trước</option>
                        <option value={"Smallsession"}>Ít buổi trước</option>
                        <option value={"Lowprice"}>Giá thấp tới cao</option>
                        <option value={"Highprice"}>Giá cao tới thấp</option>
                    </select>
                </div>
                <div className="sampleCover">
                    {state.allSamples?.filter((star) => filterStar(star)).map((i, index) => {
                        return (
                            <div key={i._id} className="insideSample">
                                <div className="coverImageX">
                                    {state.wantBooking && type === 2 ? (
                                        <LazyLoadImage onClick={() => pushBookingId(i._id)} style={{ opacity: 0.5 }} alt="Image" src={i.thumbnail} width={"100%"} height={"100%"} />
                                    ) : (
                                        <>
                                            <LazyLoadImage onClick={() => window.location.href = i.thumbnail} alt="Image" src={i.thumbnail} width={"100%"} height={"100%"} />
                                            <button style={localStorage.getItem("favourites")?.includes(i._id) ? { WebkitTextStroke: "1px #fff", color: "transparent" } : null} onClick={() => localStorage.getItem("favourites")?.includes(i._id) ? delFav(i._id) : addFav(i._id)} title={localStorage.getItem("favourites")?.includes(i._id) ? "Bỏ thích" : "Yêu thích"}>❤︎</button>
                                        </>
                                    )}
                                    {type === 2 && state.bookingId.length > 0 ? (
                                        state.bookingId.map((h) => {
                                            return (
                                                i._id === h.id ? (
                                                    <div key={h.id} onClick={() => pushBookingId(i._id)} className="checkMark4Fav">✔</div>
                                                ) : null
                                            )
                                        })
                                    ) : null}
                                </div>
                                <h5 style={state.wantBooking ? { pointerEvents: "none", opacity: 0.5 } : null}><NavLink reloadDocument>{i.title}</NavLink></h5>
                                <div style={state.wantBooking ? { pointerEvents: "none", opacity: 0.5 } : null} className="downSample">
                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <p onClick={() => setState({ modalOpen: true, modalData: i })} className="clickViewSession">{i.session.data?.length > 0 ? i.session.data?.length : "1"} buổi</p>
                                        <p>•</p>
                                        <p>{i.price ? VND.format(i.price) : <a href="tel:+8400000000">Liên hệ</a>}</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        {state.indexRateStar === index && state.wantRateStar ? null : (
                                            <span onMouseOver={() => setState({ wantRateStar: true, indexRateStar: index })}>{i.rate.count === 0 ? rating(5) : rating(i.rate.count / i.rate.data.length)}</span>
                                        )}
                                        {state.wantRateStar && state.indexRateStar === index ? (
                                            <div onMouseLeave={() => setState({ wantRateStar: false, indexRateStar: null })} className="rate">
                                                <label title="5 sao" onClick={() => rateThis("5", i)} htmlFor='star5'>5 stars</label>
                                                <label title="4 sao" onClick={() => rateThis("4", i)} htmlFor='star4'>4 stars</label>
                                                <label title="3 sao" onClick={() => rateThis("3", i)} htmlFor='star3'>3 stars</label>
                                                <label title="2 sao" onClick={() => rateThis("2", i)} htmlFor='star2'>2 stars</label>
                                                <label title="1 sao" onClick={() => rateThis("1", i)} htmlFor='star1'>1 star</label>
                                            </div>
                                        ) : null}
                                        <p>{`(${i.rate.data.length})`}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={state.pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        marginPagesDisplayed={2}
                        containerClassName="pagination justify-content-center text-nowrap"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={currentPage.current - 1}
                    />
                </div>
            </div>
            <ViewSampleModal state={state} setState={setState} />
            <FavouriteBookingModal state={state} setState={setState} />
        </>
    )
}
export default TattooSample