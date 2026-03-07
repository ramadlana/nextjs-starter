import Layout from "../components/Layout";
import { withAuthPage } from "../lib/auth";
import { Settings as SettingsIcon } from "lucide-react";
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
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Settings</CardTitle>
          </div>
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
