"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ balance }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: "Balance",
        data: [balance, Math.max(0, 10000 - balance)],
        backgroundColor: ["#0a0a0a", "#ededed"],
        borderWidth: 0,
      },
    ],
    labels: ["Balance", "Remaining"],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      }}
    />
  );
};

export default DoughnutChart;
