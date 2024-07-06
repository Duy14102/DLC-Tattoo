import { Bar } from "react-chartjs-2";

function GalleryBarChart({ titleLabel, data }) {
    function getData(e) {
        const dataGot = data?.filter(item => item.title === e).length
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
                    "Ảnh", "Video"
                ],
                datasets: [
                    {
                        label: `${titleLabel}`,
                        backgroundColor: [
                            "#8e5ea2", "#09c167"
                        ],
                        data: [getData("image"), getData("video")],
                        barPercentage: 0.5,
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

export default GalleryBarChart