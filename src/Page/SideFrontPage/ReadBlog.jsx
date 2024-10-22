import { useParams } from "react-router-dom"
import { lazy, useEffect, useReducer } from "react"
import axios from "axios"
import image from "../../Assets/Image/Slide-1.webp"
import { Helmet } from "react-helmet"
const HeroBanner = lazy(() => import("../../Component/BlogPageComponent/HeroBanner"))
const MainReadBlog = lazy(() => import("../../Component/BlogPageComponent/MainReadBlog"))

function ReadBlog() {
    const params = useParams()
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        blogDetail: null
    })
    useEffect(() => {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/GetSpecificBlog`,
            params: {
                id: params.id
            }
        }
        axios(configuration).then((res) => {
            setState({ blogDetail: res.data })
        })
    }, [params.id])
    return (
        <>
            <Helmet>
                <title>{`DLC Tattoo | Blog | ${state.blogDetail?.title}`}</title>
                <meta name="description" content={`DLC Tattoo | Blog | ${state.blogDetail?.title} | ${state.blogDetail?.content}`} />
                <meta property="og:url" content="https://dlc-tattoo.netlify.app" />
                <meta property="og:site_name" content="DLC Tattoo" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:type" content="website" />
            </Helmet>

            <HeroBanner page={"Blog"} page2={state.blogDetail?.title} title={state.blogDetail?.title} desc={state.blogDetail?.subtitle} img={image} />

            <MainReadBlog content={state.blogDetail?.content} />
        </>
    )
}
export default ReadBlog