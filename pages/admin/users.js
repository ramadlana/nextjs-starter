import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminUsers({ user }) {
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Admin-only placeholder. Add user list and actions here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page is only visible to users with the ADMIN role.
          </p>
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
