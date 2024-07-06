import "./HeroBanner.css"

function MainReadBlog({ content }) {
    return (
        <div className="mainReadBlog" dangerouslySetInnerHTML={{ __html: content }}></div>
    )
}
export default MainReadBlog