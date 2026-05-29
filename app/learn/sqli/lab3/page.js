"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LabDetails() {

  const [solutionOpen, setSolutionOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="bg-white min-h-screen p-8 flex justify-center text-black">

      <div className="max-w-5xl w-full border border-gray-200 rounded-xl p-12">

        {/* Header */}
        <div className="mb-10">

          {/* Back Button */}
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
            <span>SQL Injection</span>
            <span>/</span>
            <span className="text-black">Lab</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight mb-6">
            SQL injection UNION attack, determining the number of columns returned by the query
          </h1>

          {/* Status */}
          <div className="flex items-center gap-4 mb-6">

            {/* Difficulty */}
            <span className="text-[10px] font-bold border border-black px-2 py-1 uppercase">
              Practitioner
            </span>

            {/* Lab Status */}
            <div className="border-2 border-black px-4 py-1 text-xs font-black uppercase">
              Lab • Solved
            </div>

          </div>

          {/* Description */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-4 mb-8">

            <p>
              This lab contains a SQL injection vulnerability in the product
              category filter. The results from the query are returned in the
              application's response, so you can use a UNION attack to retrieve
              data from other tables.
            </p>

            <p>
              To solve the lab, determine the number of columns returned by the
              query by performing a SQL injection UNION attack that returns an
              additional row containing NULL values.
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

            <span className={`${solutionOpen ? "rotate-180" : ""}`}>
              ▼
            </span>

          </button>

          {solutionOpen && (

            <div className="p-8 border-t border-black text-gray-800">

              <ol className="list-decimal ml-6 space-y-6">

                <li>
                  Modify the{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 border border-gray-200">
                    category
                  </span>{" "}
                  parameter, giving it the value:

                  <code className="block bg-gray-100 border border-gray-300 p-3 mt-3 font-mono overflow-x-auto">
                    '+UNION+SELECT+NULL--
                  </code>

                  <p className="mt-3">
                    Observe that an error occurs.
                  </p>
                </li>

                <li>
                  Modify the{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 border border-gray-200">
                    category
                  </span>{" "}
                  parameter to add an additional column containing a null value:

                  <code className="block bg-gray-100 border border-gray-300 p-3 mt-3 font-mono overflow-x-auto">
                    '+UNION+SELECT+NULL,NULL--
                  </code>
                </li>

                <li>
                  Continue adding null values until the error disappears and the
                  response includes additional content containing the null values.
                </li>

              </ol>

            </div>

          )}

        </div>

        {/* Community Solutions */}
        <div className="border border-gray-200 mt-6">

          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="w-full p-5 flex justify-between items-center text-sm font-bold text-gray-500 uppercase"
          >
            Community Solutions

            <span className={`${communityOpen ? "rotate-180" : ""}`}>
              ▼
            </span>

          </button>

          {communityOpen && (

            <div className="border-t border-gray-200 p-8 space-y-6">

              {/* Comment */}
              <div className="border border-gray-200 p-5">

                <h3 className="font-bold mb-3">
                  Rana Khalil
                </h3>

                <p className="text-gray-700 leading-relaxed">
                  The easiest way to determine the number of columns is by
                  incrementing NULL values until the server stops throwing an error.
                </p>

              </div>

              {/* Comment */}
              <div className="border border-gray-200 p-5">

                <h3 className="font-bold mb-3">
                  CyberLearner
                </h3>

                <p className="text-gray-700 leading-relaxed">
                  You can also use ORDER BY to determine the number of columns
                  before attempting UNION SELECT.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
