export default function DashboardCards({ cards }) {
  const data = cards || [
    {
      title: "Users",
      value: "1,248",
      delta: "+3.2%",
      color: "bg-indigo-50",
      icon: "users",
    },
    {
      title: "Active",
      value: "842",
      delta: "+1.1%",
      color: "bg-emerald-50",
      icon: "bolt",
    },
    {
      title: "Revenue",
      value: "$12.4k",
      delta: "+6.5%",
      color: "bg-yellow-50",
      icon: "wallet",
    },
    {
      title: "Uptime",
      value: "99.99%",
      delta: "0.0%",
      color: "bg-sky-50",
      icon: "server",
    },
    {
      title: "Tasks",
      value: "32",
      delta: "-4%",
      color: "bg-rose-50",
      icon: "check",
    },
    {
      title: "Weather",
      value: "18°C",
      delta: "+2°C",
      color: "bg-cyan-50",
      icon: "cloud",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((c) => (
        <div key={c.title} className={`p-4 rounded-lg shadow-sm ${c.color}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-gray-500">{c.title}</div>
              <div className="mt-1 text-2xl font-semibold">{c.value}</div>
              <div className="text-sm text-gray-500 mt-1">{c.delta}</div>
            </div>
            <div className="ml-4">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {renderIcon(c.icon)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderIcon(name) {
  switch (name) {
    case "users":
      return (
        <svg
          className="w-5 h-5 text-indigo-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14s1-3 6-3 6 3 6 3v1H4v-1z" />
        </svg>
      );
    case "bolt":
      return (
        <svg
          className="w-5 h-5 text-emerald-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M11 3L4 12h5l-1 5 7-9h-5l1-5z" />
        </svg>
      );
    case "wallet":
      return (
        <svg
          className="w-5 h-5 text-yellow-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 6a2 2 0 012-2h12v2H4v8h12v2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    case "server":
      return (
        <svg
          className="w-5 h-5 text-sky-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 5h14v3H3V5zm0 4h14v3H3V9zm0 4h14v3H3v-3z" />
        </svg>
      );
    case "check":
      return (
        <svg
          className="w-5 h-5 text-rose-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M16.707 5.293l-8 8L3.293 8.879 4.707 7.465l4 4 7-7L16.707 5.293z" />
        </svg>
      );
    case "cloud":
    default:
      return (
        <svg
          className="w-5 h-5 text-cyan-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 15a4 4 0 010-8 5 5 0 011 9h8a3 3 0 000-6 4 4 0 10-8 2" />
        </svg>
      );
  }
}
