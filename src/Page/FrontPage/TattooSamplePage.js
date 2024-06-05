import Filter from "../../Component/TattooSampleComponent/Filter"
import TattooSample from "../../Component/TattooSampleComponent/TattooSample"

function TattooSamplePage() {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "120px 20%", background: "#101010" }}>
            <Filter />

            <TattooSample />
        </div>
    )
}
export default TattooSamplePage