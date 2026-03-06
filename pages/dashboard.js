import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import SimpleChart from "../components/SimpleChart";
import { withAuthPage } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard({ user, chartData }) {
  return (
    <Layout user={user}>
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.username}
        </h1>
        <p className="text-muted-foreground text-sm">
          Overview of system metrics
        </p>
      </section>

      <section>
        <DashboardCards userValue={1000} />
      </section>


      <div className="my-6" />


      <Card>
        <CardHeader>
          <CardTitle>Recent trend</CardTitle>
          <CardDescription>Weekly performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleChart data={chartData} />
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = [12, 18, 16, 22, 20, 19, 23];
    const chartData = { labels, values };

    return {
      props: {
        user,
        chartData,
      },
    };
  }
);
