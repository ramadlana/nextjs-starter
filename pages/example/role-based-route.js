import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Test({ user }) {
  const example = "This is a role-based protected route example.";
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>Role-based Route</CardTitle>
          <CardDescription>Only ADMIN role can access this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{example}</p>
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  },
  ["ADMIN"]
);
