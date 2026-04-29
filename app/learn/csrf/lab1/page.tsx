"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCsrfLab1Solved } from "../lab-state";

export default function CsrfNoDefensesLabPage() {
  const router = useRouter();
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [email, setEmail] = useState("anything%40web-security-academy.net");
  const solved = useCsrfLab1Solved();

  const exploitHtml = useMemo(
    () =>
      `<form method="POST" action="https://YOUR-LAB-ID.web-security-academy.net/my-account/change-email">
  <input type="hidden" name="email" value="${email}" />
</form>
<script>
  document.forms[0].submit();
</script>`,
    [email]
  );

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-black md:px-12">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-8 text-sm font-semibold text-gray-500 transition-colors hover:text-black"
        >
          &larr; Back to labs
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <main className="space-y-8">
            <section className="border border-gray-200 bg-white p-8 shadow-sm">
              <nav className="mb-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>CyberLearn Academy</span>
                <span>/</span>
                <span>CSRF</span>
                <span>/</span>
                <span className="text-black">Lab 1</span>
              </nav>

              <div
                className={`mb-6 inline-flex border px-4 py-1 text-xs font-black uppercase tracking-wide ${
                  solved
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-black text-black"
                }`}
              >
                Lab: {solved ? "solved" : "not solved"}
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-black">
                CSRF vulnerability in an email change feature with no defenses
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
                This training lab contains an account page where the email
                change request accepts a simple POST submission. The request has
                no CSRF token, no re-authentication step, and no origin check.
              </p>
            </section>

            <section className="border border-gray-200 bg-gray-50 p-8">
              <h2 className="mb-4 text-2xl font-bold text-black">Objective</h2>
              <p className="text-gray-700 leading-8">
                Craft an HTML page that silently submits the email change form
                for a logged-in visitor. When the victim views your exploit,
                their browser sends the vulnerable request with their session
                cookie attached.
              </p>

              <Link
                href="/learn/csrf/lab1/exploit-server"
                className="mt-6 inline-flex bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
              >
                Open exploit server
              </Link>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="border border-gray-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Test user
                  </p>
                  <p className="mt-2 font-mono text-sm text-black">
                    wiener / peter
                  </p>
                </div>
                <div className="border border-gray-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Vulnerable path
                  </p>
                  <p className="mt-2 font-mono text-sm text-black">
                    /my-account/change-email
                  </p>
                </div>
                <div className="border border-gray-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Method
                  </p>
                  <p className="mt-2 font-mono text-sm text-black">POST</p>
                </div>
              </div>
            </section>

            <section className="border border-gray-200 bg-white p-8">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    Exploit builder
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Inspect the auto-submit payload before sending it to the
                    exploit server.
                  </p>
                </div>
                <Link
                  href="/learn/csrf/lab1/exploit-server"
                  className="inline-flex bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Submit PoC
                </Link>
              </div>

              <label className="mb-3 block text-sm font-bold text-gray-700">
                New email address
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mb-6 w-full border border-gray-300 px-4 py-3 font-mono text-sm text-black outline-none transition-colors focus:border-black"
              />

              <pre className="overflow-x-auto border border-gray-200 bg-black p-6 text-sm leading-7 text-green-300">
                <code>{exploitHtml}</code>
              </pre>
            </section>

            <section className="border border-black bg-white">
              <button
                onClick={() => setSolutionOpen((open) => !open)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-50"
              >
                Solution guide
                <span
                  className={`text-xs transition-transform ${
                    solutionOpen ? "rotate-180" : ""
                  }`}
                >
                  v
                </span>
              </button>

              {solutionOpen && (
                <div className="border-t border-black p-8 text-gray-800">
                  <ol className="ml-6 list-decimal space-y-5 leading-7">
                    <li>
                      Sign in as the test user and submit the email change form
                      once.
                    </li>
                    <li>
                      Capture the request and confirm it only needs an
                      <code className="mx-1 border border-gray-300 bg-gray-100 px-2 py-1 font-mono text-sm">
                        email
                      </code>
                      parameter.
                    </li>
                    <li>
                      Put a hidden POST form on an attacker-controlled page and
                      auto-submit it with JavaScript.
                    </li>
                    <li>
                      Paste the proof of concept into the exploit server body
                      and submit it to solve the lab.
                    </li>
                  </ol>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5">
            <div className="border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-lg font-bold text-black">Why it works</h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                Browsers attach cookies to matching requests automatically. If a
                sensitive POST action trusts only the cookie and lacks an
                unpredictable token, another site can trigger that action.
              </p>
            </div>

            <div className="border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-black">Checklist</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="border-b border-gray-100 pb-3">
                  Find the email update request.
                </li>
                <li className="border-b border-gray-100 pb-3">
                  Confirm no CSRF token is required.
                </li>
                <li className="border-b border-gray-100 pb-3">
                  Build a hidden auto-submit form.
                </li>
                <li>Test with one email, deliver with another.</li>
              </ul>
            </div>

            <div className="border border-gray-200 bg-black p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Defense note
              </p>
              <p className="mt-3 text-sm leading-7">
                A robust fix pairs SameSite cookies with server-validated CSRF
                tokens on state-changing requests.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
