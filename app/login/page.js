"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserProfile } from "../lib/user-profile";
import styles from "./login.module.css";

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
          role: data.user?.role,
          title: data.user?.title,
          memberSince: data.user?.createdAt
            ? new Date(data.user.createdAt).getFullYear().toString()
            : undefined,
        });

        alert("Login successful!");
        if (data.user?.role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Login to CyberLearn
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Email or Username"
            required
            className={styles.input}
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
            className={styles.input}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className={`${styles.button} ${
              loading
                ? styles.buttonDisabled
                : styles.buttonActive
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <a href="/signup" className={styles.link}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}