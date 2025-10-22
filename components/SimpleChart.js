import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SimpleChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Metric",
        data: data.values,
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.08)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" } },
    },
  };

  return <Line data={chartData} options={options} />;
}
