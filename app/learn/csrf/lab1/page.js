"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCsrfLab1Solved } from "../lab-state";
import "./lab1.css";

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
    <div className="csrf-lab-container">
      <div className="csrf-lab-wrapper">
        <button
          onClick={() => router.back()}
          className="back-btn"
        >
          &larr; Back to labs
        </button>

        <div className="lab-layout">
          <main className="lab-main-col">
            <section className="lab-section-card">
              <nav className="breadcrumb-nav">
                <span>CyberLearn Academy</span>
                <span>/</span>
                <span>CSRF</span>
                <span>/</span>
                <span className="active-node">Lab 1</span>
              </nav>

              <div
                className={`status-indicator ${
                  solved ? "solved" : "unsolved"
                }`}
              >
                Lab: {solved ? "solved" : "not solved"}
              </div>

              <h1 className="lab-heading">
                CSRF vulnerability in an email change feature with no defenses
              </h1>

              <p className="lab-description">
                This training lab contains an account page where the email
                change request accepts a simple POST submission. The request has
                no CSRF token, no re-authentication step, and no origin check.
              </p>
            </section>

            <section className="lab-section-card bg-gray">
              <h2 className="lab-sec-title">Objective</h2>
              <p className="lab-description" style={{ marginTop: 0 }}>
                Craft an HTML page that silently submits the email change form
                for a logged-in visitor. When the victim views your exploit,
                their browser sends the vulnerable request with their session
                cookie attached.
              </p>

              <Link
                href="/learn/csrf/lab1/exploit-server"
                className="orange-btn"
              >
                Open exploit server
              </Link>

              <div className="details-grid">
                <div className="details-box">
                  <p className="details-box-label">
                    Test user
                  </p>
                  <p className="details-box-val">
                    wiener / peter
                  </p>
                </div>
                <div className="details-box">
                  <p className="details-box-label">
                    Vulnerable path
                  </p>
                  <p className="details-box-val">
                    /my-account/change-email
                  </p>
                </div>
                <div className="details-box">
                  <p className="details-box-label">
                    Method
                  </p>
                  <p className="details-box-val">POST</p>
                </div>
              </div>
            </section>

            <section className="lab-section-card">
              <div className="builder-header">
                <div>
                  <h2 className="lab-sec-title" style={{ marginBottom: 0 }}>
                    Exploit builder
                  </h2>
                  <p className="builder-header-desc">
                    Inspect the auto-submit payload before sending it to the
                    exploit server.
                  </p>
                </div>
                <Link
                  href="/learn/csrf/lab1/exploit-server"
                  className="black-btn"
                >
                  Submit PoC
                </Link>
              </div>

              <label className="input-label">
                New email address
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="text-input"
              />

              <pre className="code-preview">
                <code>{exploitHtml}</code>
              </pre>
            </section>

            <section className="solution-toggle-card">
              <button
                onClick={() => setSolutionOpen((open) => !open)}
                className="solution-toggle-btn"
              >
                Solution guide
                <span
                  className={`solution-toggle-arrow ${
                    solutionOpen ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {solutionOpen && (
                <div className="solution-body">
                  <ol className="solution-list">
                    <li>
                      Sign in as the test user and submit the email change form
                      once.
                    </li>
                    <li>
                      Capture the request and confirm it only needs an
                      <code className="inline-code">
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

          <aside className="sidebar-col">
            <div className="sidebar-card">
              <h2 className="sidebar-card-title">Why it works</h2>
              <p className="sidebar-card-text">
                Browsers attach cookies to matching requests automatically. If a
                sensitive POST action trusts only the cookie and lacks an
                unpredictable token, another site can trigger that action.
              </p>
            </div>

            <div className="sidebar-card bg-white">
              <h2 className="sidebar-card-title">Checklist</h2>
              <ul className="checklist-list">
                <li>
                  Find the email update request.
                </li>
                <li>
                  Confirm no CSRF token is required.
                </li>
                <li>
                  Build a hidden auto-submit form.
                </li>
                <li>Test with one email, deliver with another.</li>
              </ul>
            </div>

            <div className="sidebar-card bg-black">
              <p className="sidebar-label-gray">
                Defense note
              </p>
              <p className="sidebar-card-text">
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
