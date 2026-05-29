"use client";

import Link from "next/link";

export default function CSRFPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex text-black">

      {/* MAIN CONTENT */}
      <div className="flex-1">

        <div className="flex">

          {/* 🔥 SECTION SIDEBAR */}
          <div className="w-72 p-6">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-6">
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:underline block mb-4"
              >
                ← Back to Dashboard
              </Link>

              <h2 className="font-semibold mb-4 text-black text-xl">
                CSRF Sections
              </h2>

              <div className="space-y-2 text-sm">
                <a href="#intro" className="block px-3 py-2 rounded-lg hover:bg-red-100 text-black">
                    What is CSRF?
                </a>
                <a href="#conditions" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    CSRF Conditions
                </a>
                <a href="#impact" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Impact
                </a>
                <a href="#example" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Example Payload
                </a>
                <a href="#prevention" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Prevention
                </a>
                <a href="#quiz" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black">
                    Quiz
                </a>

                <div className="border-t my-3"></div>

                <Link href="/learn/csrf/lablist">
                    <div className="block px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 cursor-pointer text-center">
                    🧪 View CSRF Labs
                    </div>
                </Link>

                <Link href="/quiz/csrf">
                    <div className="block px-3 py-2 rounded-lg border border-black text-black hover:bg-gray-50 cursor-pointer text-center font-bold">
                    Attempt Quiz
                    </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-10 space-y-16">

            {/* INTRO */}
            <section id="intro" className="bg-white p-6 rounded-xl shadow-md">
              <h1 className="text-2xl font-bold mb-3 text-black">What is CSRF?</h1>
              <p className="text-black">
                Cross-Site Request Forgery (CSRF) is a vulnerability where an attacker induces users to perform actions that they do not intend to perform (e.g., changing an email address or transferring funds).
              </p>
            </section>

            {/* CONDITIONS */}
            <section id="conditions" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Three Key Conditions</h2>
              <p className="mb-4 text-gray-700 font-medium">For a CSRF attack to be possible, three conditions must be met:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li><strong>A relevant action:</strong> An action the attacker wants to induce (like changing a password).</li>
                <li><strong>Cookie-based session handling:</strong> The application relies solely on cookies to identify the user.</li>
                <li><strong>No unpredictable parameters:</strong> The request doesn&apos;t contain any values the attacker can&apos;t guess (like a CSRF token).</li>
              </ul>
            </section>

            {/* IMPACT */}
            <section id="impact" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Impact</h2>
              <p className="text-black">
                An attacker can gain full control over a user&apos;s account. If the victim is a privileged user (Admin), the attacker might take over the entire application.
              </p>
            </section>

            {/* EXAMPLE */}
            <section id="example" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Example Attack HTML</h2>
              <p className="mb-2 text-sm text-gray-600">This hidden form is hosted on the attacker&apos;s site:</p>
              <div className="bg-black text-green-400 p-4 rounded text-sm overflow-x-auto">
              {`<form action="https://vulnerable-website.com/email/change" method="POST">
                <input type="hidden" name="email" value="pwned@attacker.com" />
              </form>
              <script>
                document.forms[0].submit();
              </script>`}
              </div>
            </section>

            {/* PREVENTION */}
            <section id="prevention" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Prevention</h2>
              <ul className="list-disc pl-6 space-y-1 text-black">
                <li><strong>CSRF Tokens:</strong> Unique, secret, unpredictable values generated by the server.</li>
                <li><strong>SameSite Cookies:</strong> Set cookies with <code className="bg-gray-200 px-1 rounded text-red-600">SameSite=Strict</code>.</li>
                <li><strong>Double Submit Cookies:</strong> Sending a random value in both a cookie and a request parameter.</li>
              </ul>
            </section>

            {/* QUIZ */}
            <section id="quiz" className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-black">Quiz</h2>
              <p className="mb-4 text-black">Which mechanism is the most effective way to prevent CSRF?</p>

              <div className="space-y-2">
                <button className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100 text-black text-left px-4">
                  A. Using HTTPS instead of HTTP
                </button>
                <button className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100 text-black text-left px-4">
                  B. Implementing Anti-CSRF Tokens
                </button>
                <button className="w-full border border-gray-300 p-2 rounded hover:bg-gray-100 text-black text-left px-4">
                  C. Using complex passwords
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
