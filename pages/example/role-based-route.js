import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";

export default function Test({ user }) {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [12, 19, 8, 15, 22],
  };
  return (
    <Layout user={user}>
      <div className="bg-white p-4 rounded shadow">
        <pre>{JSON.stringify(user)}</pre>
      </div>
    </Layout>
  );
}

// Use the reusable authentication middleware
export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  },
  ["ADMIN"]
);
