import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Uploadfiles({ user }) {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const dataUrl = reader.result;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: uploadFile.name, data: dataUrl }),
        });
        const json = await res.json();
        setUploading(false);
        if (json.ok) {
          setUploadUrl(json.url);
          setUploadError(null);
        } else {
          setUploadError(json.error || "Upload failed");
        }
      } catch (err) {
        setUploading(false);
        setUploadError("Upload failed");
      }
    };
    reader.onerror = () => {
      setUploading(false);
      setUploadError("Could not read file.");
    };
    reader.readAsDataURL(uploadFile);
  };

  const onFileChange = (e) => {
    setUploadFile(e.target.files?.[0] ?? null);
    setUploadError(null);
    setUploadUrl(null);
  };

  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>File Upload</CardTitle>
          </div>
          <CardDescription>
            Upload a file (user: {user?.username})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto max-h-32">
            {JSON.stringify(user, null, 2)}
          </pre>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
            <Input
              type="file"
              onChange={onFileChange}
              className="max-w-xs"
            />
            <Button type="submit" disabled={uploading} className="gap-2">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" aria-hidden />
                  Upload
                </>
              )}
            </Button>
          </form>
          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          {uploadUrl && (
            <p className="text-sm text-muted-foreground">
              Uploaded:{" "}
              <a
                href={uploadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {uploadUrl}
              </a>
            </p>
          )}
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
