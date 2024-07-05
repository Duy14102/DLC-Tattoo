import { Bar } from "react-chartjs-2";

function BarChart({ titleLabel, data }) {
    function getData(e) {
        const dataGot = data?.filter(item => item.month === e).length
        if (dataGot) {
            return dataGot
        } else {
            return 0
        }
    }
    return (
        <Bar
            data={{
                labels: [
                    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
                ],
                datasets: [
                    {
                        label: `${titleLabel}`,
                        backgroundColor: [
                            titleLabel === "Tài khoản mới" ? "#3e95cd" : titleLabel === "Liên hệ mới" ? "#8e5ea2" : titleLabel === "Hình mẫu mới" ? "#e8c3b9" : titleLabel === "Blog mới" ? "#c45850" : null
                        ],
                        data: [getData(1), getData(2), getData(3), getData(4), getData(5), getData(6), getData(7), getData(8), getData(9), getData(10), getData(11), getData(12)],
                        barPercentage: 0.9,
                        categoryPercentage: 1,
                    }
                ]
            }}
            options={{
                responsive: true,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#fff",
                            font: {
                                family: "Oswald",
                                size: 16
                            },
                        }
                    }
                }
            }}
        />
    )
}

export default BarChart