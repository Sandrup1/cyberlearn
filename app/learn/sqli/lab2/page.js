"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../components/lab-details.css";

export default function LabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="lab-details-container">
      <div className="lab-details-card">

        {/* Header */}
        <div className="lab-details-header no-border">
          <button 
            onClick={() => router.back()}
            className="back-btn"
          >
            ← Back to Labs
          </button>

          {/* Breadcrumb */}
          <nav className="breadcrumb-nav">
            <span>CyberLearn Academy</span>
            <span>/</span>
            <span>SQL injection</span>
            <span>/</span>
            <span className="active">Lab</span>
          </nav>

          {/* Title */}
          <h1 className="lab-title" style={{ marginBottom: "1.5rem" }}>
            SQL injection vulnerability allowing login bypass
          </h1>

          {/* Status Row */}
          <div className="status-row" style={{ marginBottom: "1.5rem" }}>
            {/* Difficulty */}
            <span className="difficulty-badge">
              Apprentice
            </span>

            {/* Lab Status */}
            <div className="status-badge">
              Lab • Solved
            </div>
          </div>

          {/* Description */}
          <div className="lab-desc-container" style={{ marginBottom: "2rem" }}>
            <p>
              This lab contains a SQL injection vulnerability in the login function.
            </p>
            <p>
              To solve the lab, perform a SQL injection attack that logs in to the application as the{" "}
              <span className="inline-code">
                administrator
              </span>{" "}
              user.
            </p>
          </div>

          {/* Button */}
          <Link href="/learn/sqli/lab2/login">
            <button className="action-btn">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="status-divider" style={{ margin: "2.5rem 0" }}></div>

        {/* Solution Section */}
        <div className="accordion-container">
          <div className="accordion-item">
            <button
              onClick={() => setSolutionOpen(!solutionOpen)}
              className="accordion-trigger"
            >
              <span>Solution Guide</span>
              <span className={`accordion-arrow ${solutionOpen ? "open" : ""}`}>▼</span>
            </button>

            {solutionOpen && (
              <div className="accordion-content">
                <ol className="solution-steps">
                  <li>Go to the login page.</li>
                  <li>
                    Enter any username and use the following payload:
                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      administrator&apos;--
                    </code>
                  </li>
                  <li>Submit the form.</li>
                  <li>You will be logged in as administrator.</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Community Section */}
        <div className="accordion-item gray-border" style={{ marginTop: "1.5rem" }}>
          <button className="accordion-trigger gray-text" style={{ cursor: "default" }}>
            <span>Community Solutions</span>
          </button>
        </div>

      </div>
    </div>
  );
}
