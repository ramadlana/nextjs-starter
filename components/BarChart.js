import { Bar } from "react-chartjs-2";

const BAR_COLORS = [
  "rgba(59, 130, 246, 0.8)",
  "rgba(34, 197, 94, 0.8)",
  "rgba(234, 179, 8, 0.8)",
  "rgba(239, 68, 68, 0.8)",
  "rgba(168, 85, 247, 0.8)",
  "rgba(236, 72, 153, 0.8)",
];

export default function BarChart({ data }) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  const values = Array.isArray(data?.values) ? data.values : [];
  const chartData = {
    labels,
    datasets: [
      {
        label: data?.label ?? "Value",
        data: values,
        backgroundColor: BAR_COLORS.slice(0, values.length),
        borderColor: BAR_COLORS.map((c) => c.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { grid: { color: "rgba(148, 163, 184, 0.2)" }, border: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
}
