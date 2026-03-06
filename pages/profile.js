import Layout from "../components/Layout";
import { withAuthPage } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Profile({ user }) {
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information (dummy page)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-medium text-muted-foreground">Username</dt>
              <dd>{user?.username ?? "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-muted-foreground">Role</dt>
              <dd>{user?.role ?? "—"}</dd>
            </div>
          </dl>
          <p className="text-muted-foreground text-sm">
            This is a placeholder. Add profile fields and edit form as needed.
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
  ["USER"]
);
