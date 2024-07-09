import { useEffect } from "react";

function SmokeLoader() {
    useEffect(() => {
        const layer = document.querySelector(".cd-transition-layer")
        layer.classList.add("closing")
        setTimeout(() => {
            layer.classList.remove("closing", "visible")
        }, 1000);
    }, [])
    return (
        <div className="cd-transition-layer visible">
            <div className="bg-layer"></div>
        </div>
    )
}
export default SmokeLoader