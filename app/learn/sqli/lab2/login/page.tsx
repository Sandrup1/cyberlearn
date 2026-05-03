"use client";
import { useState } from "react";

export default function LabLoginBypass() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Exact SQLi payload check
    if (username.trim() === "administrator'--") {
      setSolved(true);
      setMessage("Welcome back, administrator");
    } else {
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="bg-white min-h-screen p-8 flex justify-center text-black">
      <div className="max-w-5xl w-full border border-gray-200 rounded-xl p-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            SQL injection vulnerability allowing login bypass
          </h1>

          {/* Status */}
          <div className="flex items-center gap-4 mb-6">
            <div className="border-2 border-black px-4 py-1 text-xs font-black uppercase">
              LAB
            </div>

            <div
              className={`px-3 py-1 text-xs font-bold uppercase border ${
                solved
                  ? "border-black text-black"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {solved ? "Solved" : "Not solved"}
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-4 mb-10">
            <p>
              This lab contains a SQL injection vulnerability in the login
              function.
            </p>
            <p>
              To solve the lab, log in as the{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 border border-gray-200">
                administrator
              </span>{" "}
              user without knowing the password.
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="max-w-xl bg-gray-50 border border-gray-200 p-8">

          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full border border-black p-3 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-black p-3 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-black text-white py-3 font-bold hover:bg-gray-800 transition active:scale-95"
            >
              Log in
            </button>
          </form>

          {/* Message */}
          {message && (
            <p className="mt-6 font-bold text-sm">
              {message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-100 pt-6 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          CyberLearn // SQLi Lab
        </div>

      </div>
    </div>
  );
}