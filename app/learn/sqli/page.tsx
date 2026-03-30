"use client";

import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import Link from "next/link";

export default function SQLiPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex text-black">

      {/* MAIN CONTENT */}
      <div className="flex-1">

        <div className="flex">

          {/* 🔥 SECTION SIDEBAR (CARD STYLE) */}
          <div className="w-72 p-6">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-6">
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:underline block mb-4"
              >
                ← Back to Dashboard
              </Link>

              <h2 className="font-semibold mb-4 text-black text-xl">
                SQLi Sections
              </h2>

              <div className="space-y-2 text-sm">
                {/* Scroll links */}
                <a href="#intro" className="block px-3 py-2 rounded-lg hover:bg-green-100 text-black">
                    What is SQLi?
                </a>
                <a href="#impact" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Impact
                </a>
                <a href="#types" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Types
                </a>
                <a href="#example" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Example
                </a>
                <a href="#prevention" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Prevention
                </a>
                <a href="#video" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Video
                </a>
                <a href="#quiz" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Quiz
                </a>

                {/* 🔥 Divider */}
                <div className="border-t my-3"></div>

                {/* 🔥 View Labs (NEW PAGE) */}
                <Link href="/labs/sqli">
                    <div className="block px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 cursor-pointer text-center">
                    🧪 View Labs
                    </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-10 space-y-16">

            {/* INTRO */}
            <section id="intro" className="bg-white p-6 rounded-xl shadow-md">
              <h1 className="text-2xl font-bold mb-3 text-black">What is SQL Injection?</h1>
              <p className="text-black">
                SQL Injection is a vulnerability where attackers manipulate database queries using user input.
              </p>
            </section>

            {/* IMPACT */}
            <section id="impact" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Impact</h2>
              <p className="text-black">
                Attackers can bypass authentication, steal sensitive data, or compromise systems.
              </p>
            </section>

            {/* TYPES */}
            <section id="types" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Types</h2>
              <ul className="list-disc pl-6 space-y-1 text-black">
                <li>In-band SQL Injection</li>
                <li>Blind SQL Injection</li>
                <li>Time-based SQL Injection</li>
              </ul>
            </section>

            {/* EXAMPLE */}
            <section id="example" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Example</h2>
              <div className="bg-black text-green-400 p-4 rounded text-sm overflow-x-auto">
                SELECT * FROM users WHERE username = 'admin' OR '1'='1';
              </div>
            </section>

            {/* PREVENTION */}
            <section id="prevention" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Prevention</h2>
              <ul className="list-disc pl-6 space-y-1 text-black">
                <li>Use prepared statements</li>
                <li>Validate and sanitize input</li>
                <li>Use ORM (Prisma, etc.)</li>
                <li>Limit database permissions</li>
              </ul>
            </section>

            {/* VIDEO */}
            <section id="video" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Video</h2>
              <iframe
                className="w-full h-64 rounded"
                src="https://www.youtube.com/embed/ciNHn38EyRc"
                title="SQL Injection Video"
                allowFullScreen
              ></iframe>
            </section>

            {/* QUIZ */}
            <section id="quiz" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Quiz</h2>
              <p className="mb-4 text-black">What does SQL Injection target?</p>

              <div className="space-y-2">
                <button className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100 text-black">
                  Frontend UI
                </button>
                <button className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100 text-black">
                  Database queries
                </button>
                <button className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100 text-black">
                  CSS styles
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}