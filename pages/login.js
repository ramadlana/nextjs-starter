import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      const body = await res.json();
      setError(body?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Log in</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              Sign in
            </button>
            {/* create account link */}
            <br />
          </div>
        </form>
        <br />
        <div className="mt-6 flex flex-col gap-2">
          <a
            href="/register"
            className="block w-full text-center px-4 py-2 border border-indigo-600 rounded-lg text-indigo-700 font-medium hover:bg-indigo-50 transition"
          >
            Don&apos;t have an account? <span className="underline">Register here</span>
          </a>
          <a
            href="/about"
            className="block w-full text-center text-sm text-gray-500 hover:text-indigo-600 transition mt-1"
          >
            About this project
          </a>
        </div>
    </div>
  </div>
  );
}
