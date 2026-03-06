import Layout from "../components/Layout";
import { withAuthPage } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Settings({ user }) {
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your preferences (dummy page)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            This is a placeholder. Add settings sections (notifications, privacy,
            theme, etc.) as needed.
          </p>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  }
);
