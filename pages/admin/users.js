import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import { Users } from "lucide-react";
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
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>User Management</CardTitle>
          </div>
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
