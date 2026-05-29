"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { defaultUserProfile, useUserProfile } from "../lib/user-profile";
import { readWelcomeSeen, setWelcomeSeen } from "../lib/onboarding";
import { initializeModuleProgress } from "../learn/progress-state";

export default function WelcomePage() {
  const router = useRouter();
  const profile = useUserProfile();

  useEffect(() => {
    if (!profile?.email || profile.email === defaultUserProfile.email) {
      router.replace("/signup");
      return;
    }

    if (readWelcomeSeen(profile.email)) {
      router.replace("/dashboard");
    }
  }, [profile.email, router]);

  function handleStart() {
    if (!profile?.email || profile.email === defaultUserProfile.email) {
      router.push("/signup");
      return;
    }

    setWelcomeSeen(profile.email);
    initializeModuleProgress("sqli");
    router.push("/learn/sqli");
  }

  const displayName =
    profile?.name?.trim() && profile.name !== defaultUserProfile.name
      ? profile.name.trim()
      : "there";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-md p-10 text-black">
        <h1 className="text-3xl font-bold mb-3">Welcome, {displayName}!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          You&apos;re all set. Start with the foundational module on{" "}
          <span className="font-semibold text-gray-900">SQL Injection</span> to
          initialize your progress and begin tracking performance.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleStart}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Start Module
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-bold border border-gray-300 hover:bg-gray-50 transition text-center"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Tip: You can come back anytime from the dashboard.
        </p>
      </div>
    </div>
  );
}
