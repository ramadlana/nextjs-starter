import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Zap, Wallet, Server, CheckCircle, Cloud } from "lucide-react";

export default function DashboardCards({ cards, userValue, activeValue, revenueValue, uptimeValue, tasksValue, weatherValue }) {
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
      value: activeValue,
      delta: "+1.1%",
      variant: "success",
      icon: "bolt",
    },
    {
      title: "Revenue",
      value: revenueValue,
      delta: "+6.5%",
      variant: "warning",
      icon: "wallet",
    },
    {
      title: "Uptime",
      value: uptimeValue,
      delta: "0.0%",
      variant: "info",
      icon: "server",
    },
    {
      title: "Tasks",
      value: tasksValue,
      delta: "-4%",
      variant: "destructive",
      icon: "check",
    },
    {
      title: "Weather",
      value: weatherValue,
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

const ICON_MAP = {
  users: Users,
  bolt: Zap,
  wallet: Wallet,
  server: Server,
  check: CheckCircle,
  cloud: Cloud,
};

function renderIcon(name, className = "") {
  const Icon = ICON_MAP[name] ?? Cloud;
  return <Icon className={cn("w-5 h-5", className)} aria-hidden />;
}
