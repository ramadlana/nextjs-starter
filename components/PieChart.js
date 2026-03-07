import { Doughnut } from "react-chartjs-2";

const PIE_COLORS = [
  "rgb(59, 130, 246)",
  "rgb(34, 197, 94)",
  "rgb(234, 179, 8)",
  "rgb(239, 68, 68)",
  "rgb(168, 85, 247)",
  "rgb(236, 72, 153)",
];

export default function PieChart({ data }) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  const values = Array.isArray(data?.values) ? data.values : [];
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: PIE_COLORS.slice(0, values.length),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
