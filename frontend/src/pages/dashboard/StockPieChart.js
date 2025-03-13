import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StockPieChart = ({ products }) => {
    const filteredProducts = products.filter(product => product.quantity_in_stock > 0);
    const labels = filteredProducts.map(product => product.name);
    const dataValues = filteredProducts.map(product => product.quantity_in_stock);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Stock Quantity",
                data: dataValues,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#FFB6C1",
                    "#8A2BE2",
                    "#3CB371",
                    "#FFD700",
                    "#DC143C",
                    "#00BFFF",
                    "#9ACD32",
                    "#B0E0E6",
                    "#FF6347",
                    "#6A5ACD",
                    "#FF4500",
                    "#2E8B57",
                    "#D2691E",
                    "#FF1493",
                ],
                hoverOffset: 4,
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
                        const totalStock = dataValues.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / totalStock) * 100).toFixed(2);
                        return `${context.label}: ${context.raw} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <Pie data={chartData} options={options} />
    );
};

export default StockPieChart;
