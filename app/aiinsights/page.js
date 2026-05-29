"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AIInsightsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/performance-insights");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-10 text-gray-700">
      Redirecting to Performance Insights…
    </div>
  );
}
