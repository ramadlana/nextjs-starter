import { useRouter } from "next/router";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RestrictedAccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <ShieldAlert className="h-16 w-16 text-destructive" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Restricted Access</CardTitle>
          <CardDescription>
            You don&apos;t have permission to view this page.
            <br />
            Please go back to the previous page.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Go back to the previous page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
