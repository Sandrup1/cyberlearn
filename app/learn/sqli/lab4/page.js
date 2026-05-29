"use client";

import { useState } from "react";
import Link from "next/link";

export default function LabPage() {

  const [solutionOpen, setSolutionOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen p-8 flex justify-center text-black">

      <div className="max-w-5xl w-full border border-gray-200 rounded-xl p-12">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div>

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight mb-8">
              SQL injection UNION attack, finding a column containing text
            </h1>

            {/* Status */}
            <div className="flex items-center gap-4">

              {/* Difficulty */}
              <span className="text-[10px] font-bold border border-black px-2 py-1 uppercase">
                Practitioner
              </span>

              {/* Solved */}
              <div className="border-2 border-black px-4 py-1 text-xs font-black uppercase">
                Lab • Solved
              </div>

            </div>

          </div>

          {/* Share */}
          <button className="border border-black w-12 h-12 flex items-center justify-center hover:bg-black hover:text-white transition">
            ↗
          </button>

        </div>

        {/* Description */}
        <div className="text-gray-800 text-lg leading-relaxed space-y-6 mt-12">

          <p>
            This lab contains a SQL injection vulnerability in the product category
            filter. The results from the query are returned in the application's
            response, so you can use a UNION attack to retrieve data from other tables.
            To construct such an attack, you first need to determine the number
            of columns returned by the query. You can do this using a technique
            you learned in a{" "}
            <span className="underline cursor-pointer">
              previous lab
            </span>.
            The next step is to identify a column that is compatible with string data.
          </p>

          <p>
            The lab will provide a random value that you need to make appear within
            the query results. To solve the lab, perform a SQL injection UNION attack
            that returns an additional row containing the value provided.
            This technique helps you determine which columns are compatible with
            string data.
          </p>

        </div>

        {/* Button */}
        <div className="mt-10">

          <Link href="/learn/sqli/lab3">

            <button className="bg-black text-white px-10 py-4 font-bold text-lg hover:bg-gray-800 transition active:scale-95">
              ACCESS THE LAB →
            </button>

          </Link>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-10"></div>

        {/* Solution */}
        <div className="border border-black">

          {/* Header */}
          <button
            onClick={() => setSolutionOpen(!solutionOpen)}
            className="w-full p-5 flex justify-between items-center font-bold text-sm uppercase"
          >

            <div className="flex items-center gap-3">
              Solution
            </div>

            <span className={`${solutionOpen ? "rotate-180" : ""}`}>
              ▼
            </span>

          </button>

          {/* Content */}
          {solutionOpen && (

            <div className="p-8 border-t border-black text-gray-800">

              <ol className="list-decimal ml-6 space-y-8">

                <li>
                  Use Burp Suite to intercept and modify the request that sets
                  the product category filter.
                </li>

                <li>
                  Determine the{" "}
                  <span className="underline">
                    number of columns that are being returned by the query
                  </span>.
                  Verify that the query is returning three columns, using the
                  following payload in the{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 border border-gray-200">
                    category
                  </span>{" "}
                  parameter:

                  <code className="block bg-gray-100 border border-gray-300 p-4 mt-4 font-mono overflow-x-auto">
                    '+UNION+SELECT+NULL,NULL,NULL--
                  </code>

                </li>

                <li>
                  Try replacing each null with the random value provided by the
                  lab, for example:

                  <code className="block bg-gray-100 border border-gray-300 p-4 mt-4 font-mono overflow-x-auto">
                    '+UNION+SELECT+'abcdef',NULL,NULL--
                  </code>

                </li>

                <li>
                  If an error occurs, move on to the next null and try that instead.
                </li>

              </ol>

            </div>

          )}

        </div>

        {/* Community */}
        <div className="border border-gray-200 mt-6">

          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="w-full p-5 flex justify-between items-center text-sm font-bold text-gray-500 uppercase"
          >

            <div>
              Community Solutions
            </div>

            <span className={`${communityOpen ? "rotate-180" : ""}`}>
              ▼
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}
