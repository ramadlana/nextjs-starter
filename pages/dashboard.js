import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import SimpleChart from "../components/SimpleChart";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { withAuthPage } from "../lib/auth";
import { LayoutDashboard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard({ user, chartData, barData, pieData }) {
  return (
    <Layout user={user}>
      <div className="space-y-8">
        <section className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <LayoutDashboard className="h-7 w-7 text-primary" aria-hidden />
            Welcome back, {user?.username}
          </h1>
          <p className="text-muted-foreground text-sm">
            Overview of system metrics
          </p>
        </section>

        <section>
          <DashboardCards
            userValue={1000}
            activeValue={100}
            revenueValue={900}
            uptimeValue={99.99}
            tasksValue={32}
            weatherValue={18}
          />
        </section>

        {/* Charts row — equal-height cards */}
        <section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Line — Weekly trend</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 pt-0">
                <div className="h-[220px] w-full">
                  <SimpleChart data={chartData} />
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Bar — By category</CardTitle>
                <CardDescription>Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 pt-0">
                <div className="h-[220px] w-full">
                  <BarChart data={barData} />
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Doughnut — Distribution</CardTitle>
                <CardDescription>Share by segment</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 pt-0">
                <div className="h-[220px] w-full">
                  <PieChart data={pieData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tables row — equal-height cards */}
        <section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-base">Recent orders</CardTitle>
                <CardDescription>Latest 5 transactions</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left font-semibold text-foreground px-4 py-2.5">ID</th>
                        <th className="text-left font-semibold text-foreground px-4 py-2.5">Product</th>
                        <th className="text-right font-semibold text-foreground px-4 py-2.5">Amount</th>
                        <th className="text-left font-semibold text-foreground px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { id: "#2847", product: "Premium Plan", amount: "$49.00", status: "Completed" },
                        { id: "#2846", product: "Add-on Storage", amount: "$12.00", status: "Completed" },
                        { id: "#2845", product: "Basic Plan", amount: "$19.00", status: "Pending" },
                        { id: "#2844", product: "Premium Plan", amount: "$49.00", status: "Completed" },
                        { id: "#2843", product: "Support Ticket", amount: "—", status: "Refunded" },
                      ].map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 text-muted-foreground font-mono">{row.id}</td>
                          <td className="px-4 py-2.5 text-foreground">{row.product}</td>
                          <td className="px-4 py-2.5 text-right text-foreground">{row.amount}</td>
                          <td className="px-4 py-2.5">
                            <span
                              className={
                                row.status === "Completed"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : row.status === "Pending"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-muted-foreground"
                              }
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-base">Top pages</CardTitle>
                <CardDescription>Traffic last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left font-semibold text-foreground px-4 py-2.5">Page</th>
                        <th className="text-right font-semibold text-foreground px-4 py-2.5">Views</th>
                        <th className="text-right font-semibold text-foreground px-4 py-2.5">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { page: "/dashboard", views: "12,847", change: "+12.4%" },
                        { page: "/settings", views: "8,102", change: "+5.2%" },
                        { page: "/profile", views: "6,221", change: "-2.1%" },
                        { page: "/example/ssr", views: "3,440", change: "+8.0%" },
                        { page: "/example/csr", views: "2,891", change: "+18.3%" },
                      ].map((row) => (
                        <tr key={row.page} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 text-foreground font-medium">{row.page}</td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{row.views}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={row.change.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                              {row.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = [42, 58, 51, 72, 68, 81, 94];
    const chartData = { labels, values };

    const barLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const barValues = [24, 18, 32, 28, 41, 35];
    const barData = { labels: barLabels, values: barValues };

    const pieLabels = ["Desktop", "Mobile", "Tablet", "Other"];
    const pieValues = [52, 32, 12, 4];
    const pieData = { labels: pieLabels, values: pieValues };

    return {
      props: {
        user,
        chartData,
        barData,
        pieData,
      },
    };
  }
);
