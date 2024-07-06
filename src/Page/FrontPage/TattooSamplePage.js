import "../../Component/TattooSampleComponent/TattooSample.css"
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
        responsiveFilter: false,
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
        <div className="mainTatooSamplePage">
            <div className="buttonAppearFilter">
                <button onClick={() => setState(state.responsiveFilter ? { responsiveFilter: false } : { responsiveFilter: true })}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475 512"><path d={state.responsiveFilter ? "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" : "M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"} /></svg>
                </button>
                {state.responsiveFilter ? (
                    <div className="fixedFilterAppear">
                        <Filter params={params} type={1} />
                    </div>
                ) : null}
            </div>
            {window.innerWidth > 991 ? (
                <Filter params={params} type={1} />
            ) : null}

            <TattooSample state={state} setState={setState} params={params} useEffect={useEffect} getSamples={getSamples} useRef={useRef} axios={axios} type={1} />
        </div>
    )
}
export default TattooSamplePage