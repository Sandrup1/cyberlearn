"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserProfile } from "../lib/user-profile";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [stage, setStage] = useState("form");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [resendCooldownUntil, setResendCooldownUntil] = useState(0);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Check if fields are filled
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setExpiresAt(data.expiresAt ?? null);
        setStage("otp");
        setOtp("");
        setResendCooldownUntil(Date.now() + 30_000);
        setMessage("OTP sent. Please check your email.");
      } else {
        setMessage(data.message ?? "Failed to send OTP");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "OTP verification failed");
        return;
      }

      saveUserProfile({
        name: form.name,
        email: form.email,
        memberSince: new Date().getFullYear().toString(),
      });
      router.push("/welcome");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (Date.now() < resendCooldownUntil) return;

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setExpiresAt(data.expiresAt ?? null);
        setOtp("");
        setResendCooldownUntil(Date.now() + 30_000);
        setMessage("OTP resent. Please check your email.");
      } else {
        setMessage(data.message ?? "Failed to resend OTP");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendDisabled = loading || Date.now() < resendCooldownUntil;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Create Account
        </h1>

        {message ? (
          <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black">
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-md text-black"
            disabled={loading || stage === "otp"}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-md text-black"
            disabled={loading || stage === "otp"}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-md text-black"
            disabled={loading || stage === "otp"}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        {stage === "otp" ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold text-black">Enter OTP</div>
            {expiresAt ? (
              <div className="mt-1 text-xs text-gray-600">
                Expires at: {new Date(expiresAt).toLocaleTimeString()}
              </div>
            ) : null}

            <input
              className="mt-3 w-full border p-3 rounded-md text-black tracking-widest text-center"
              inputMode="numeric"
              placeholder="6-digit OTP"
              value={otp}
              maxLength={6}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />

            <button
              type="button"
              className="mt-3 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-60"
              disabled={loading}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>

            <button
              type="button"
              className="mt-2 w-full border border-gray-300 text-black py-3 rounded-md hover:bg-gray-50 disabled:opacity-60"
              disabled={resendDisabled}
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          </div>
        ) : null}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
