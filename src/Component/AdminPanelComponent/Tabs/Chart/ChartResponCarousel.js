import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function ChartResponCarousel({ state, BarChart, GalleryBarChart }) {
    return (
        state.dataAccounts || state.dataSamples || state.dataBlogs || state.dataGallery ? (
            <OwlCarousel items={1}
                className="owl-theme"
                loop={true}
                nav={true}
                autoplay={false}
                rewind={true}
                lazyLoad={true}
                margin={30} >
                <BarChart titleLabel={"Tài khoản mới"} data={state.dataAccounts} />
                <BarChart titleLabel={"Hình mẫu mới"} data={state.dataSamples} />
                <BarChart titleLabel={"Blog mới"} data={state.dataBlogs} />
                <GalleryBarChart titleLabel={"Hậu trường"} data={state.dataGallery} />
            </OwlCarousel>
        ) : null
    )
}
export default ChartResponCarousel