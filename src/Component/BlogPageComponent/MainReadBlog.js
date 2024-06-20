import "./HeroBanner.css"
import HTMLReactParser from 'html-react-parser/lib/index';

function MainReadBlog({ content }) {
    return (
        <div className="mainReadBlog">
            {HTMLReactParser(`${content}`)}
        </div>
    )
}
export default MainReadBlog