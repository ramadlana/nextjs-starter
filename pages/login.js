import { useState } from "react";
import Layout from "../components/Layout";

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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
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
          <a className="px-4 py-2 border rounded" href="/register">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
