import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DashboardCards({ cards, userValue }) {
  const data = cards || [
    {
      title: "Users",
      value: userValue,
      delta: "+3.2%",
      variant: "default",
      icon: "users",
    },
    {
      title: "Active",
      value: "842",
      delta: "+1.1%",
      variant: "success",
      icon: "bolt",
    },
    {
      title: "Revenue",
      value: "$12.4k",
      delta: "+6.5%",
      variant: "warning",
      icon: "wallet",
    },
    {
      title: "Uptime",
      value: "99.99%",
      delta: "0.0%",
      variant: "info",
      icon: "server",
    },
    {
      title: "Tasks",
      value: "32",
      delta: "-4%",
      variant: "destructive",
      icon: "check",
    },
    {
      title: "Weather",
      value: "18°C",
      delta: "+2°C",
      variant: "muted",
      icon: "cloud",
    },
  ];

  const variantStyles = {
    default: "border-primary/20 bg-primary/5",
    success: "border-emerald-500/20 bg-emerald-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    info: "border-sky-500/20 bg-sky-500/5",
    destructive: "border-destructive/20 bg-destructive/5",
    muted: "border-muted-foreground/20 bg-muted",
  };

  const iconStyles = {
    users: "text-primary",
    bolt: "text-emerald-600",
    wallet: "text-amber-600",
    server: "text-sky-600",
    check: "text-destructive",
    cloud: "text-cyan-600",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((c) => (
        <Card
          key={c.title}
          className={cn("transition-colors", variantStyles[c.variant] || variantStyles.default)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {c.title}
                </p>
                <p className="mt-1 text-2xl font-semibold">{c.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.delta}</p>
              </div>
              <div className="rounded-full bg-background/80 p-2 shadow-sm">
                {renderIcon(c.icon, iconStyles[c.icon] || "text-muted-foreground")}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function renderIcon(name, className = "") {
  const baseClass = `w-5 h-5 ${className}`;
  switch (name) {
    case "users":
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14s1-3 6-3 6 3 6 3v1H4v-1z" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3L4 12h5l-1 5 7-9h-5l1-5z" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h12v2H4v8h12v2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    case "server":
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 5h14v3H3V5zm0 4h14v3H3V9zm0 4h14v3H3v-3z" />
        </svg>
      );
    case "check":
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.707 5.293l-8 8L3.293 8.879 4.707 7.465l4 4 7-7L16.707 5.293z" />
        </svg>
      );
    case "cloud":
    default:
      return (
        <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 15a4 4 0 010-8 5 5 0 011 9h8a3 3 0 000-6 4 4 0 10-8 2" />
        </svg>
      );
  }
}
