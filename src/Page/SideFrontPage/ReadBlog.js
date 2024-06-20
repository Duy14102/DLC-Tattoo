import HeroBanner from "../../Component/BlogPageComponent/HeroBanner"
import image from "../../Assets/Image/Slide-1.jpeg"
import { useParams } from "react-router-dom"
import { useEffect, useReducer } from "react"
import axios from "axios"
import MainReadBlog from "../../Component/BlogPageComponent/MainReadBlog"

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
            <HeroBanner page={"Blog"} page2={state.blogDetail?.title} title={state.blogDetail?.title} desc={state.blogDetail?.subtitle} img={image} />

            <MainReadBlog content={state.blogDetail?.content} />
        </>
    )
}
export default ReadBlog