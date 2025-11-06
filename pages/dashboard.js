// import Layout from "../components/Layout";
import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import SimpleChart from "../components/SimpleChart";
import { withAuthPage } from "../lib/auth";

export default function Dashboard({ user, chartData }) {
  return (
    <Layout user={user}>
      <section>
        <h1 className="text-2xl font-semibold">
          HALO CAKRAWALA Welcome back, {user?.username}
        </h1>
        <p className="text-sm text-gray-500">Overview of system metrics</p>
      </section>

      <section>
        <DashboardCards userValue={1000} />
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-3">Recent trend</h3>
        <SimpleChart data={chartData} />
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    // sample chart data (7 days)
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = [12, 18, 16, 22, 20, 19, 23];
    const chartData = {
      labels,
      values,
    };

    return {
      props: {
        user,
        chartData,
      },
    };
  },
  ["USER"]
);
