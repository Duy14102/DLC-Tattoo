import axios from "axios";
import { useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import Filter from "../../Component/TattooSampleComponent/Filter";
import TattooSample from "../../Component/TattooSampleComponent/TattooSample";

function FavouritePage() {
    const params = useParams()
    const currentPage = useRef();
    const limit = 9
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        allSamples: null,
        modalOpen: false,
        modalData: null,
        indexRateStar: null,
        wantRateStar: false,
        pageCount: 6
    })

    useEffect(() => {
        currentPage.current = 1;
        if (localStorage.getItem("favourites")) {
            getSamples()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function getSamples() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetFavourites`,
            params: {
                id: localStorage.getItem("favourites"),
                page: currentPage.current,
                limit: limit,
                sorted: params.sorted,
                cate: params.cate,
                star: params.star,
            }
        }
        axios(configuration).then((res) => {
            setState({ allSamples: res.data.results.result, pageCount: res.data.results.pageCount });
        })
    }
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "120px 20%", background: "#101010", minHeight: "inherit" }}>
            {localStorage.getItem("favourites") ? (
                <>
                    <Filter params={params} type={2} />

                    <TattooSample state={state} setState={setState} params={params} useEffect={useEffect} getSamples={getSamples} useRef={useRef} axios={axios} type={2} />
                </>
            ) : (
                <h2 style={{ color: "#fff", fontFamily: "Oswald", fontWeight: 400, margin: "0 auto", letterSpacing: 1 }}>Danh sách yêu thích trống!</h2>
            )}
        </div>
    )
}
export default FavouritePage