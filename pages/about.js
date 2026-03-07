import Link from "next/link";
import { Info, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" aria-hidden />
            <CardTitle className="text-2xl">About</CardTitle>
          </div>
          <CardDescription>
            This is a public page. No login required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" aria-hidden />
              Go to login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
