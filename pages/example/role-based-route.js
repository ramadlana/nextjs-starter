import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";

export default function Test({ user }) {
  const example = "This is a role-based protected route example.";
  return (
    <Layout user={user}>
      <div className="bg-white p-4 rounded shadow">
        <h1>{example}</h1>
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
