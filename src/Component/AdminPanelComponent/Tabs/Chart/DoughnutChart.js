import { Pie } from "react-chartjs-2"

function DoughnutChart({ data }) {
    const label = ["Bắp tay", "Cẳng tay", "Bàn tay", "Bắp chân", "Cẳng chân", "Bàn chân", "Cổ", "Sườn", "Ngực", "Bụng", "Vai", "Lưng"]
    function getData(e) {
        const dataGot = data?.filter(item => item.cate.cate === e).length
        if (dataGot) {
            return dataGot
        } else {
            return 0
        }
    }
    return (
        <Pie height={"100%"} width={"100%"}
            data={{
                labels: label,
                datasets: [{
                    data: [getData("Bắp tay"), getData("Cẳng tay"), getData("Bàn tay"), getData("Bắp chân"), getData("Cằng chân"), getData("Bàn chân"), getData("Cổ"), getData("Sườn"), getData("Ngực"), getData("Bụng"), getData("Vai"), getData("Lưng")],
                }]
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#999",
                            font: {
                                family: "Oswald",
                                size: 15
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: "Biểu đồ hình mẫu",
                        font: {
                            family: "Oswald",
                            weight: 400,
                            size: 18
                        },
                        color: "#fff"
                    }
                }
            }}
        />
    )
}
export default DoughnutChart