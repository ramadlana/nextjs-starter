import { Line } from "react-chartjs-2";

export default function SimpleChart({ data }) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  const values = Array.isArray(data?.values) ? data.values : [];
  const chartData = {
    labels,
    datasets: [
      {
        label: "Metric",
        data: values,
        borderColor: "rgb(30 41 59)",
        backgroundColor: "rgba(30, 41, 59, 0.08)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgb(226 232 240)" } },
    },
  };

  return <Line data={chartData} options={options} />;
}
