"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserProfile } from "../lib/user-profile";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        saveUserProfile({
          name: data.user?.name || form.email.split("@")[0],
          email: data.user?.email || form.email,
          memberSince: data.user?.createdAt
            ? new Date(data.user.createdAt).getFullYear().toString()
            : undefined,
        });

        alert("Login successful!");
        router.push("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to CyberLearn
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="border p-3 rounded-md text-black"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="border p-3 rounded-md text-black"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className={`text-white py-3 rounded-md transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
