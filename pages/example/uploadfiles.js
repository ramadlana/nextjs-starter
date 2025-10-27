import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";
import React, { useState } from "react";

export default function Uploadfiles({ user }) {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [12, 19, 8, 15, 22],
  };

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
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Welcome, {user?.username}</h2>
        <pre>{JSON.stringify(user)}</pre>
        <form method="POST" action="/api/logout">
          <button className="px-3 py-1 border rounded">Sign out</button>
        </form>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input type="file" onChange={onFileChange} />
          <button
            type="submit"
            className="px-4 py-2 border rounded"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {uploadError && <div className="text-red-600 mt-2">{uploadError}</div>}
        {uploadUrl && (
          <div className="mt-2">
            Uploaded:{" "}
            <a
              href={uploadUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {uploadUrl}
            </a>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <SimpleChart data={data} />
      </div>
    </Layout>
  );
}

// Use the reusable authentication middleware
export const getServerSideProps = withAuthPage(null, ["USER"]);
