"use client";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function AIInsights() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <div className="p-10 space-y-10">

          {/* Skills Mastery */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold mb-1">Skills Mastery</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your proficiency across different topics
            </p>

            {[
              { name: "XSS", value: "50%" },
              { name: "SQL Injection", value: "0%" },
              { name: "CSRF", value: "0%" },
              { name: "XXE", value: "0%" },
            ].map((item, i) => (
              <div key={i} className="mb-4">

                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: item.value }}
                  ></div>
                </div>

              </div>
            ))}
          </div>

          {/* Performance Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold mb-1">Performance Breakdown</h2>
            <p className="text-sm text-gray-500 mb-6">
              Detailed Analysis of your learning strengths
            </p>

            {[
              { name: "Theory Understanding", value: "50%" },
              { name: "Practical Skills", value: "0%" },
              { name: "Problem Solving", value: "0%" },
              { name: "Speed", value: "0%" },
            ].map((item, i) => (
              <div key={i} className="mb-4">

                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: item.value }}
                  ></div>
                </div>

              </div>
            ))}
          </div>

          {/* Suggested Module */}
          <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500 mb-1">
                🎯 Suggested Next Module based on your current performance
              </p>

              <h3 className="font-semibold text-lg">SQL Injection</h3>

              <p className="text-sm text-gray-600">
                Attacks manipulate database through user input
              </p>

              <p className="text-xs text-gray-500 mt-1">
                AI suggests focusing on this to improve your practical skills
              </p>
            </div>

            <Link href="/learn/sqli">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Start Learning
              </button>
            </Link>

          </div>

          {/* Key Insights */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold mb-4">💡 Key Insights</h2>

            <ul className="space-y-3 text-sm text-gray-700">
              <li>📈 Your theoretical understanding is strong, but practical applications need more work</li>
              <li>⚡ You complete labs 15% faster than average, showing good problem solving speed</li>
              <li>🔥 Consider spending more time on CSRF and XXE modules</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}