
// import Apexcharts from "react-apexcharts";
import dynamic from 'next/dynamic'
const Apexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function Chart({ data }: any) {
    let optionsAnalyticsBalanceChart = {
        series: [
            {
                name: "Balance",
                data: [
                    28877, 29334, 33233, 36439, 32675, 32333, 33457, 38345, 36783, 39457,
                    22459, 39840,
                ],
            },
        ],
        fill: {
            opacity: 1,
            colors: [document.body.classList.contains("dark") ? "#ffffff" : "#2D3436"],
        },
        chart: {
            fontFamily: "Manrope, sans-serif",
            type: "bar",
            height: "250",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        labels: {
            style: {
                fontSize: "14px",
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            borderColor: "#B2BEC3",
            opacity: 1,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 2,
                columnWidth: "60%",
                colors: {
                    backgroundBarColors: ["#B2BEC3"],
                    backgroundBarOpacity: 0.2,
                },
            },
        },
        stroke: {
            show: true,
            width: 4,
            colors: ["transparent"],
        },
        xaxis: {
            axisTicks: {
                show: false,
                borderType: "solid",
                height: 6,
                offsetX: 0,
                offsetY: 0,
            },
            tickPlacement: "between",
            labels: {
                style: {
                    colors: [
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                        "#B2BEC3",
                    ],
                    fontSize: "12px",
                },
            },
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        },
        legend: {
            horizontalAlign: "right",
            offsetX: 40,
            position: "top",
            markers: {
                radius: 12,
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: ["#636E72"],
                    fontSize: "14px",
                },
                formatter: (value: any) => {
                    return value == "0" ? value / 1000 : value / 1000 + "K";
                },
            },
            min: 0,
            max: 60000,
            tickAmount: 4,
        },
    };

    // if (document.querySelector("#dashboard-analytics-balance-chart")) {
    //     let chart = new ApexCharts(
    //         document.querySelector("#dashboard-analytics-balance-chart"),
    //         optionsAnalyticsBalanceChart
    //     );
    //     chart.render();
    // }


    const chartData = {
        options: {
            fill: {
                opacity: 1,
                colors: [document.body.classList.contains("dark") ? "#ffffff" : "#2D3436"],
            },
            chart: {
                fontFamily: "Manrope, sans-serif",
                height: "250",
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            grid: {
                borderColor: "#B2BEC3",
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 2,
                    columnWidth: "60%",
                    colors: {
                        backgroundBarColors: ["#B2BEC3"],
                        backgroundBarOpacity: 0.2,
                    },
                },
            },
            stroke: {
                show: true,
                width: 4,
                colors: ["transparent"],
            },
            xaxis: {
                axisTicks: {
                    show: false,
                    borderType: "solid",
                    height: 6,
                    offsetX: 0,
                    offsetY: 0,
                },
                tickPlacement: "between",
                labels: {
                    style: {
                        colors: [
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                            "#B2BEC3",
                        ],
                        fontSize: "12px",
                    },
                },
                categories: data?.map((m: any) => m.name)
            },
            legend: {
                offsetX: 40,
                markers: {
                    radius: 12,
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: ["#636E72"],
                        fontSize: "14px",
                    },
                },
                tickAmount: 4,
            },
        },
        series: [
            {
                name: "KB",
                data: data?.map((m: any) => Number(m.meta.size)),
            },
        ],
    };

    return <>
        <Apexcharts
            options={chartData.options}
            series={chartData.series}
            type="bar"
        />
    </>
}