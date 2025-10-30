"use client";
import { useRouter } from "next/navigation";

export default function RestrictedAccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="text-5xl mb-3">🚫</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Restricted Access
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          You don’t have permission to view this page. <br />
          Please go back to the previous page.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 text-white font-medium shadow hover:bg-gray-700 transition-all"
        >
          ⬅️ Click here to go back to the previous page
        </button>
      </div>
    </div>
  );
}
