"use client";

import { useState } from "react";
import Link from "next/link";

export default function StoredXSSLabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen p-8 flex justify-center text-black">
      <div className="max-w-5xl w-full border border-gray-200 rounded-xl p-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Stored XSS into HTML context with nothing encoded
          </h1>

          {/* Status */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold border border-black px-2 py-1 uppercase">
              Apprentice
            </span>

            <div className="border-2 border-black px-4 py-1 text-xs font-black uppercase">
              Lab • Not solved
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-4 mb-8">
            <p>
              This lab contains a stored cross-site scripting vulnerability in the comment functionality.
            </p>
            <p>
              To solve this lab, submit a comment that calls the{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 border border-gray-200">
                alert
              </span>{" "}
              function when the blog post is viewed.
            </p>
          </div>

          {/* ACCESS LAB BUTTON */}
          <Link href="/learn/xss/lab2/lab2_2">
            <button className="bg-black text-white px-10 py-4 font-bold text-lg hover:bg-gray-800 transition active:scale-95">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-10"></div>

        {/* Solution Accordion */}
        <div className="border border-black">

          <button
            onClick={() => setSolutionOpen(!solutionOpen)}
            className="w-full p-5 flex justify-between items-center font-bold text-sm uppercase"
          >
            Solution
            <span
              className={`transition-transform ${
                solutionOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {solutionOpen && (
            <div className="p-8 border-t border-black text-gray-800">
              <ol className="list-decimal ml-6 space-y-5">

                <li>
                  Enter the following into the comment box:
                  <code className="block bg-gray-100 border border-gray-300 p-3 mt-3 font-mono">
                    &lt;script&gt;alert(1)&lt;/script&gt;
                  </code>
                </li>

                <li>Enter a name, email and website.</li>
                <li>Click "Post comment".</li>
                <li>Go back to the blog to trigger the alert.</li>

              </ol>
            </div>
          )}
        </div>

        {/* Community Section */}
        <div className="border border-gray-200 mt-6 p-5 text-sm font-bold text-gray-500 uppercase">
          Community Solutions
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-100 pt-6 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          CyberLearn // Stored XSS Lab
        </div>

      </div>
    </div>
  );
}