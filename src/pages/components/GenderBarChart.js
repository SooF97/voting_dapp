// components/GenderBarChart.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { chart as ChartJS } from "chart.js/auto";

const GenderBarChart = ({ data }) => {
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Gender Analytics</h2>
      <Bar data={data} />
    </div>
  );
};

export default GenderBarChart;
