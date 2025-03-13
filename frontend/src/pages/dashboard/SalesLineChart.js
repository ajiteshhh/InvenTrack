import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const aggregateDataByMonth = (data) => {
    const aggregated = {};
    data.forEach((item) => {
        const date = new Date(item.date);
        const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (!aggregated[month]) {
            aggregated[month] = { total: 0, count: 0 };
        }
        aggregated[month].total += item.total;
        aggregated[month].count += 1;
    });
    return Object.entries(aggregated).map(([month, values]) => ({
        date: month,
        total: values.total,
    }));
};

const SalesLineChart = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState("All");

    const years = Array.from(
        new Set(data.map((item) => new Date(item.date).getFullYear()))
    ).sort((a, b) => a - b);

    const filteredData =
        selectedYear === "All"
            ? data
            : data.filter((item) => new Date(item.date).getFullYear().toString() === selectedYear);

    const aggregatedData = aggregateDataByMonth(filteredData);

    const chartData = {
        labels: aggregatedData.map((item) => item.date),
        datasets: [
            {
                label: "Total Sales",
                data: aggregatedData.map((item) => item.total),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `$${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Total Sales",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <div className="mb-5 flex justify-end">
                <label htmlFor="year-select" className="m-2">Select Year: </label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="pr-2 pl-2 rounded"
                >
                    <option value="All">All</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <Line data={chartData} options={options} />
        </>
    );
};

export default SalesLineChart;
