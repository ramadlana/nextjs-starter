import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";

export default function Test({ user }) {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [12, 19, 8, 15, 22],
  };
  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Welcome, {user?.username}</h2>
        <pre>{JSON.stringify(user)}</pre>
        <form method="POST" action="/api/logout">
          <button className="px-3 py-1 border rounded">Sign out</button>
        </form>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <SimpleChart data={data} />
      </div>
    </Layout>
  );
}

// Use the reusable authentication middleware
export const getServerSideProps = withAuthPage(null, ["USER"]);
