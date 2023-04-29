// components/GenderDoughnutChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { chart as ChartJS } from "chart.js/auto";

const GenderDoughnutChart = ({ data }) => {
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">City Analytics</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default GenderDoughnutChart;
