import { Line } from "react-chartjs-2"

function LineChartIncome({ data }) {
    const labelRespone = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    const label = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    function getDataSuccess(e) {
        const dataGot = data?.filter(item => item.month === e).reduce((acc, curr) => { return acc + curr.money }, 0)
        if (dataGot) {
            return dataGot
        } else {
            return 0
        }
    }
    return (
        <Line
            data={{
                labels: window.innerWidth > 991 ? label : labelRespone,
                datasets: [
                    {
                        label: "Tổng tiền (VND)",
                        data: data?.length > 0 ? [getDataSuccess(1), getDataSuccess(2), getDataSuccess(3), getDataSuccess(4), getDataSuccess(5), getDataSuccess(6), getDataSuccess(7), getDataSuccess(8), getDataSuccess(9), getDataSuccess(10), getDataSuccess(11), getDataSuccess(12)] : null,
                        borderColor: "#ffc700"
                    }
                ]
            }}
            options={{
                responsive: true,
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        beginAtZero: true
                    },
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },
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
                        text: "Biểu đổ thu nhập",
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
export default LineChartIncome