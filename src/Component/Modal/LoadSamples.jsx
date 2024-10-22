import { LazyLoadImage } from "react-lazy-load-image-component";

function LoadSamples({ axios, useRef, state, setState, useEffect, ReactPaginate, toast, toastNow, ToastUpdate, getBooking, level }) {
    const currentPage = useRef();
    const limit = 6
    useEffect(() => {
        currentPage.current = 1;
        getSamples()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.contentSearch2])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getSamples();
    }

    function getSamples() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAllSample`,
            params: {
                page: currentPage.current,
                limit: limit,
                search: state.contentSearch2,
                type: 2,
            }
        }
        axios(configuration).then((res) => {
            setState({ samplesForAdd: res.data.results.result, pageCount2: res.data.results.pageCount });
        })
    }

    function pushBookingId(e) {
        const dataPush = state.samplesId
        if (dataPush.filter(item => item.id === e).length > 0) {
            dataPush.filter((item) => {
                if (item.id === e) {
                    dataPush.splice(dataPush.indexOf(item), 1)
                }
                return dataPush
            })
            return setState({ samplesId: dataPush })
        } else {
            dataPush.push({ id: e, type: 1 })
            return setState({ samplesId: dataPush })
        }
    }
    console.log(state.samplesId);

    function addSamples() {
        if (state.samplesId.length < 1) {
            return false
        }
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/AddSamplesType1Booking`,
            data: {
                id: state?.modalData3._id,
                samples: state.samplesId
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            if (level === 1) {
                getBooking()
            } else if (level === 2) {
                getBooking(localStorage.getItem("bookingSave"))
            }
            setState({ modalOpen2: false, samplesId: [], wantType: null, pageCount2: 6, samplesForAdd: null, wantUpdateBooking: false });
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        })
    }
    return (
        <>
            <div style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => addSamples()} className="yesForm yesNoButton">Xong</button>
                <button type="button" style={{ background: "gray" }} onClick={() => setState(level === 1 ? { wantType: null } : { modalOpen2: false, samplesId: [], pageCount2: 6, samplesForAdd: null })} className="yesForm yesNoButton">Hủy</button>
            </div>
            <div className="loadSamplesFather">
                {state.samplesForAdd?.filter(item => item._id !== state?.modalData3.samples.reduce((acc, curr) => { return curr.id }, 0)).map((i) => {
                    return (
                        <div onClick={() => pushBookingId(i._id)} key={i._id} className="loadSamplesChild">
                            <LazyLoadImage style={state.samplesId.length > 0 && state.samplesId.filter(item => item.id === i._id).length > 0 ? { filter: "brightness(0.7)" } : null} alt="Image" src={i.thumbnail} />
                            <p>{i.title}</p>
                            {state.samplesId.length > 0 ? (
                                state.samplesId.map((h) => {
                                    return (
                                        i._id === h.id ? (
                                            <span key={h.id} onClick={() => pushBookingId(i._id)}>✔</span>
                                        ) : null
                                    )
                                })
                            ) : null}
                        </div>
                    )
                })}
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={state.pageCount2}
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
        </>
    )
}
export default LoadSamples