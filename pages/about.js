import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">About</h1>
        <p className="text-gray-600 mb-6">
          This is a public page. No login required.
        </p>
        <Link href="/login" className="text-indigo-600 hover:underline">
          Go to login
        </Link>
      </div>
    </div>
  );
}
