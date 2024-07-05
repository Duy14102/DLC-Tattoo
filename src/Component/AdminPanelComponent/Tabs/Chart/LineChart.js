import { Line } from "react-chartjs-2"

function LineChart({ dataSuccess, dataFail }) {
    // const labelDay = ["8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12pm"]
    const labelMonth = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    function getDataSuccess(e) {
        const dataGot = dataSuccess?.filter(item => item.month === e).length
        if (dataGot) {
            return dataGot
        } else {
            return 0
        }
    }
    function getDataFail(e) {
        const dataGot = dataFail?.filter(item => item.month === e).length
        if (dataGot) {
            return dataGot
        } else {
            return 0
        }
    }
    return (
        <Line
            data={{
                labels: labelMonth,
                datasets: [
                    {
                        label: "Booking thành công",
                        data: dataSuccess?.length > 0 ? [getDataSuccess(1), getDataSuccess(2), getDataSuccess(3), getDataSuccess(4), getDataSuccess(5), getDataSuccess(6), getDataSuccess(7), getDataSuccess(8), getDataSuccess(9), getDataSuccess(10), getDataSuccess(11), getDataSuccess(12)] : null,
                        borderColor: "rgb(9,193,103)"
                    },
                    {
                        label: "Booking bị hủy",
                        data: dataFail?.length > 0 ? [getDataFail(1), getDataFail(2), getDataFail(3), getDataFail(4), getDataFail(5), getDataFail(6), getDataFail(7), getDataFail(8), getDataFail(9), getDataFail(10), getDataFail(11), getDataFail(12)] : null,
                        borderColor: "#e13534"
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
                        text: "Biểu đổ booking",
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
export default LineChart