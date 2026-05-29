"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen p-8 flex justify-center text-black">
      <div className="max-w-5xl w-full border border-gray-200 rounded-xl p-12">

        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 hover:text-black mb-6 text-sm font-semibold"
          >
            ← Back to Labs
          </button>

          {/* Breadcrumb */}
          <div className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-bold flex gap-2">
            <span>CyberLearn Academy</span>
            <span>/</span>
            <span>SQL injection</span>
            <span>/</span>
            <span className="text-black">Lab</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight mb-6">
            SQL injection vulnerability allowing login bypass
          </h1>

          {/* Status Row */}
          <div className="flex items-center gap-4 mb-6">

            {/* Difficulty */}
            <span className="text-[10px] font-bold border border-black px-2 py-1 uppercase">
              Apprentice
            </span>

            {/* Lab Status */}
            <div className="border-2 border-black px-4 py-1 text-xs font-black uppercase">
              Lab • Solved
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-4 mb-8">
            <p>
              This lab contains a SQL injection vulnerability in the login function.
            </p>
            <p>
              To solve the lab, perform a SQL injection attack that logs in to the application as the{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 border border-gray-200">
                administrator
              </span>{" "}
              user.
            </p>
          </div>

          {/* Button */}
          <Link href="/learn/sqli/lab2/login">
            <button className="bg-black text-white px-10 py-4 font-bold text-lg hover:bg-gray-800 transition active:scale-95">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-10"></div>

        {/* Solution Section */}
        <div className="border border-black">

          <button
            onClick={() => setSolutionOpen(!solutionOpen)}
            className="w-full p-5 flex justify-between items-center font-bold text-sm uppercase"
          >
            Solution
            <span className={`${solutionOpen ? "rotate-180" : ""}`}>▼</span>
          </button>

          {solutionOpen && (
            <div className="p-8 border-t border-black text-gray-800">
              <ol className="list-decimal ml-6 space-y-5">
                <li>Go to the login page.</li>
                <li>
                  Enter any username and use the following payload:
                  <code className="block bg-gray-100 border border-gray-300 p-3 mt-3 font-mono">
                    administrator'--
                  </code>
                </li>
                <li>Submit the form.</li>
                <li>You will be logged in as administrator.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Community Section (like screenshot) */}
        <div className="border border-gray-200 mt-6 p-5 text-sm font-bold text-gray-500 uppercase">
          Community Solutions
        </div>

      </div>
    </div>
  );
}
