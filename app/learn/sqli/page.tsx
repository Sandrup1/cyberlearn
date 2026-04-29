"use client";

import Link from "next/link";

export default function SQLiPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      {/* MAIN CONTENT */}
      <div className="flex-1">
        <div className="flex">

          {/* 🔥 SECTION SIDEBAR (CARD STYLE) */}
          <div className="w-72 p-6">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-6 border border-gray-100">
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:underline block mb-4"
              >
                ← Back to Dashboard
              </Link>

              <h2 className="font-semibold mb-4 text-black text-xl tracking-tight">
                SQLi Sections
              </h2>

              <div className="space-y-2 text-sm font-medium">
                <a href="#intro" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    What is SQLi?
                </a>
                <a href="#impact" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    Impact
                </a>
                <a href="#types" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    Types
                </a>
                <a href="#example" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    Example
                </a>
                <a href="#prevention" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    Prevention
                </a>
                <a href="#video" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    Video
                </a>
                <a href="quiz/sqli-module" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors">
                    Quiz
                </a>

                {/* 🔥 Divider */}
                <div className="border-t my-4"></div>

                {/* 🔥 UPDATED NAVIGATION: POINTS TO /labs */}
                <Link href="/learn/sqli/lablist">
                  <div className="block px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all cursor-pointer text-center font-bold mb-2 shadow-sm">
                    🧪 View SQLi Labs
                  </div>
                </Link>

                <Link href="/quiz/sqli">
                  <div className="block px-3 py-2 rounded-lg border border-black text-black hover:bg-gray-50 transition-all cursor-pointer text-center font-bold">
                    📝 View Full Quiz
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 p-10 space-y-16 max-w-4xl">

            {/* INTRO */}
            <section id="intro" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h1 className="text-3xl font-bold mb-4 text-black font-sans">What is SQL Injection?</h1>
              <p className="text-gray-700 leading-relaxed">
                SQL Injection (SQLi) is a type of vulnerability that occurs when an attacker can interfere with the queries that an application makes to its database. It generally allows an attacker to view data they are not normally able to retrieve.
              </p>
            </section>

            {/* IMPACT */}
            <section id="impact" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black">Impact</h2>
              <p className="text-gray-700 leading-relaxed">
                A successful SQL injection attack can result in unauthorized access to sensitive data, such as passwords, credit card details, or personal user information. In some cases, an attacker can even modify or delete this data, causing persistent changes to the application's content or behavior.
              </p>
            </section>

            {/* TYPES */}
            <section id="types" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black">Types of SQLi</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700 font-medium">
                <li><span className="text-black font-bold">In-band SQLi (Classic):</span> The attacker uses the same communication channel to launch the attack and gather results.</li>
                <li><span className="text-black font-bold">Inferential SQLi (Blind):</span> The attacker sends data payloads to the server and observes the response to learn more about its structure.</li>
                <li><span className="text-black font-bold">Out-of-band SQLi:</span> The attacker relies on the database's ability to make HTTP or DNS requests to exfiltrate data.</li>
              </ul>
            </section>

            {/* EXAMPLE */}
            <section id="example" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black font-sans">Example Query</h2>
              <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm shadow-inner overflow-x-auto leading-relaxed">
                <span className="text-pink-400 italic">-- Original Query</span><br/>
                SELECT * FROM users WHERE username = 'admin' AND password = 'password123';<br/><br/>
                <span className="text-pink-400 italic">-- Injected Query</span><br/>
                SELECT * FROM users WHERE username = 'admin' <span className="underline decoration-red-500 font-bold">OR '1'='1'</span>;
              </div>
            </section>

            {/* PREVENTION */}
            <section id="prevention" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black">Prevention</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <h4 className="font-bold text-green-800 mb-1">Prepared Statements</h4>
                  <p className="text-sm text-green-700">Parameterized queries ensure the database treats input as data, not code.</p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <h4 className="font-bold text-blue-800 mb-1">Input Validation</h4>
                  <p className="text-sm text-blue-700">Allowing only known-good input (Allowlisting) reduces attack vectors.</p>
                </div>
              </div>
            </section>

            {/* VIDEO */}
            <section id="video" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black font-sans">Video Tutorial</h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ciNHn38EyRc"
                  title="SQL Injection Video"
                  allowFullScreen
                ></iframe>
              </div>
            </section>

            {/* QUIZ SECTION */}
            <section id="quiz" className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black">Quick Check</h2>
              <p className="mb-6 text-gray-700 font-medium">What does SQL Injection primarily target?</p>

              <div className="space-y-3">
                {["Frontend UI Components", "Database queries and structure", "Client-side CSS styling"].map((option, idx) => (
                  <button key={idx} className="w-full text-left border border-gray-200 p-4 rounded-xl hover:bg-gray-50 hover:border-black transition-all font-medium">
                    {option}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Ready to practice?</p>
                  <p className="text-xs text-gray-400">Head over to the interactive labs section.</p>
                </div>
                <Link href="/learn/sqli/labs" className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center gap-2 text-sm shadow-sm">
                  Go to Labs <span>→</span>
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}