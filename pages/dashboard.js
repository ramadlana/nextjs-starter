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
          Welcome back, {user?.username}
        </h1>
        <p className="text-sm text-gray-500">Overview of system metrics</p>
      </section>

      <section>
        <DashboardCards />
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-3">Recent trend</h3>
        <SimpleChart data={chartData} />
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (context, user) => {
    // sample chart data (7 days)
    const days = 7;
    const labels = Array.from({ length: days }).map((_, i) =>
      new Date(
        Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(undefined, { weekday: "short" })
    );
    const values = [12, 18, 16, 22, 20, 19, 23];

    return {
      props: {
        user,
        chartData: { labels, values },
      },
    };
  },
  ["USER"]
);
