import { useState } from "react";
import Layout from "../components/Layout";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json();
    if (res.ok) {
      setMsg("Registered — redirecting you to login page");
      // redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      setMsg(body?.error || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {/* create button to back to /login  */}
      <a className="text-sm text-blue-600 mb-4 inline-block" href="/login">
        &larr; Back to Sign in
      </a>
      <h1 className="text-xl font-semibold mb-4">Register</h1>
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
        {msg && <div className="text-sm text-slate-600">{msg}</div>}
        <div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
