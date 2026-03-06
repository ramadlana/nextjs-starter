import Layout from "../components/Layout";
import { withAuthPage } from "../lib/auth";
import {
  Card,
  Title,
  Text,
  Metric,
  BadgeDelta,
  AreaChart,
  BarChart,
  DonutChart,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Flex,
  Grid,
} from "@tremor/react";

const ordersData = [
  { id: "#2847", product: "Premium Plan", amount: "$49.00", status: "Completed" },
  { id: "#2846", product: "Add-on Storage", amount: "$12.00", status: "Completed" },
  { id: "#2845", product: "Basic Plan", amount: "$19.00", status: "Pending" },
  { id: "#2844", product: "Premium Plan", amount: "$49.00", status: "Completed" },
  { id: "#2843", product: "Support Ticket", amount: "—", status: "Refunded" },
];

const pagesData = [
  { page: "/dashboard", views: "12,847", change: "+12.4%" },
  { page: "/settings", views: "8,102", change: "+5.2%" },
  { page: "/profile", views: "6,221", change: "-2.1%" },
  { page: "/example/ssr", views: "3,440", change: "+8.0%" },
  { page: "/example/csr", views: "2,891", change: "+18.3%" },
];

const kpiCards = [
  { title: "Users", value: 1000, delta: "+3.2%", deltaType: "increase" },
  { title: "Active", value: 100, delta: "+1.1%", deltaType: "moderateIncrease" },
  { title: "Revenue", value: 900, delta: "+6.5%", deltaType: "increase" },
  { title: "Uptime", value: "99.99%", delta: "0.0%", deltaType: "unchanged" },
  { title: "Tasks", value: 32, delta: "-4%", deltaType: "decrease" },
  { title: "Weather", value: "18°C", delta: "+2°C", deltaType: "moderateIncrease" },
];




export default function Dashboard({
  user,
  areaChartData,
  barChartData,
  donutChartData,
}) {
  return (
    <Layout user={user}>
      <div className="space-y-8">
        <section className="space-y-1">
          <Title className="!text-2xl font-semibold tracking-tight">
            Welcome back, {user?.username}
          </Title>
          <Text className="text-muted-foreground">
            Overview of system metrics
          </Text>
        </section>

        {/* KPI cards — Tremor Grid + Card + Metric + BadgeDelta */}
        <section>
          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
            {kpiCards.map((kpi) => (
              <Card key={kpi.title} className="transition-colors">
                <Flex justifyContent="between" alignItems="start">
                  <div>
                    <Text className="text-tremor-default text-tremor-content font-medium">
                      {kpi.title}
                    </Text>
                    <Metric className="mt-1">{kpi.value}</Metric>
                    <BadgeDelta
                      deltaType={kpi.deltaType}
                      className="mt-2"
                    >
                      {kpi.delta}
                    </BadgeDelta>
                  </div>
                </Flex>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Charts — Tremor Card + AreaChart, BarChart, DonutChart */}
        <section>
          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
            <Card className="flex flex-col">
              <Title className="text-base">Line — Weekly trend</Title>
              <Text className="text-tremor-default text-tremor-content mt-0.5">
                Last 7 days
              </Text>
              <div className="mt-4 h-[220px] w-full">
                <AreaChart
                  data={areaChartData}
                  index="date"
                  categories={["Revenue"]}
                  colors={["blue"]}
                  valueFormatter={(v) => `$${v}`}
                  showLegend={false}
                  showGridLines={true}
                  className="h-full w-full"
                />
              </div>
            </Card>

            <Card className="flex flex-col">
              <Title className="text-base">Bar — By category</Title>
              <Text className="text-tremor-default text-tremor-content mt-0.5">
                Monthly comparison
              </Text>
              <div className="mt-4 h-[220px] w-full">
                <BarChart
                  data={barChartData}
                  index="month"
                  categories={["Sales"]}
                  colors={["emerald"]}
                  valueFormatter={(v) => `${v}`}
                  showLegend={false}
                  showGridLines={true}
                  className="h-full w-full"
                />
              </div>
            </Card>

            <Card className="flex flex-col">
              <Title className="text-base">Doughnut — Distribution</Title>
              <Text className="text-tremor-default text-tremor-content mt-0.5">
                Share by segment
              </Text>
              <div className="mt-4 h-[220px] w-full flex items-center justify-center">
                <DonutChart
                  data={donutChartData}
                  category="name"
                  index="value"
                  valueFormatter={(v) => `${v}%`}
                  colors={["blue", "cyan", "indigo", "violet"]}
                  variant="donut"
                  showLabel={true}
                  className="h-full max-h-[200px] w-full"
                />
              </div>
            </Card>
          </Grid>
        </section>

        {/* Tables — Tremor Card + Table */}
        <section>
          <Grid numItems={1} numItemsLg={2} className="gap-6">
            <Card className="flex flex-col overflow-hidden">
              <Title className="text-base">Recent orders</Title>
              <Text className="text-tremor-default text-tremor-content mt-0.5">
                Latest 5 transactions
              </Text>
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>ID</TableHeaderCell>
                      <TableHeaderCell>Product</TableHeaderCell>
                      <TableHeaderCell className="text-right">Amount</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-tremor-content-subtle">
                          {row.id}
                        </TableCell>
                        <TableCell>{row.product}</TableCell>
                        <TableCell className="text-right">{row.amount}</TableCell>
                        <TableCell>
                          <span
                            className={
                              row.status === "Completed"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : row.status === "Pending"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-tremor-content-subtle"
                            }
                          >
                            {row.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="flex flex-col overflow-hidden">
              <Title className="text-base">Top pages</Title>
              <Text className="text-tremor-default text-tremor-content mt-0.5">
                Traffic last 30 days
              </Text>
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Page</TableHeaderCell>
                      <TableHeaderCell className="text-right">Views</TableHeaderCell>
                      <TableHeaderCell className="text-right">Change</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagesData.map((row) => (
                      <TableRow key={row.page}>
                        <TableCell className="font-medium">{row.page}</TableCell>
                        <TableCell className="text-right tabular-nums text-tremor-content-subtle">
                          {row.views}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              row.change.startsWith("+")
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {row.change}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </Grid>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    const areaChartData = [
      { date: "Mon", Revenue: 42 },
      { date: "Tue", Revenue: 58 },
      { date: "Wed", Revenue: 51 },
      { date: "Thu", Revenue: 72 },
      { date: "Fri", Revenue: 68 },
      { date: "Sat", Revenue: 81 },
      { date: "Sun", Revenue: 94 },
    ];

    const barChartData = [
      { month: "Jan", Sales: 24 },
      { month: "Feb", Sales: 18 },
      { month: "Mar", Sales: 32 },
      { month: "Apr", Sales: 28 },
      { month: "May", Sales: 41 },
      { month: "Jun", Sales: 35 },
    ];

    const donutChartData = [
      { name: "Desktop", value: 52 },
      { name: "Mobile", value: 32 },
      { name: "Tablet", value: 12 },
      { name: "Other", value: 4 },
    ];

    return {
      props: {
        user,
        areaChartData,
        barChartData,
        donutChartData,
      },
    };
  }
);
