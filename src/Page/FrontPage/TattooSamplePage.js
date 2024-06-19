import { useEffect, useReducer, useRef } from "react"
import Filter from "../../Component/TattooSampleComponent/Filter"
import TattooSample from "../../Component/TattooSampleComponent/TattooSample"
import axios from "axios"
import { useParams } from "react-router-dom"

function TattooSamplePage() {
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
        getSamples()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function getSamples() {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetAllSample`,
            params: {
                page: currentPage.current,
                limit: limit,
                sorted: params.sorted,
                cate: params.cate,
                star: params.star,
                type: 1
            }
        }
        axios(configuration).then((res) => {
            setState({ allSamples: res.data.results.result, pageCount: res.data.results.pageCount });
        })
    }
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "120px 20%", background: "#101010" }}>
            <Filter params={params} />

            <TattooSample state={state} setState={setState} params={params} useEffect={useEffect} getSamples={getSamples} useRef={useRef} axios={axios}/>
        </div>
    )
}
export default TattooSamplePage