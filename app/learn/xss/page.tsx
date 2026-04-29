"use client";

import Link from "next/link";

export default function XssPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-10 text-black">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <Link href="/learn" className="mb-6 inline-block text-sm text-gray-500 hover:underline">
          Back to modules
        </Link>

        <h1 className="mb-3 text-3xl font-bold">Cross-Site Scripting</h1>
        <p className="mb-8 text-gray-600">
          Practice identifying and submitting XSS lab work.
        </p>

        <Link
          href="/learn/xss/lablist"
          className="inline-flex rounded-lg bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
        >
          View XSS Labs
        </Link>
      </div>
    </div>
  );
}
