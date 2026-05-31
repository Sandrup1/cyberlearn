"use client";

import { useState } from "react";
import Link from "next/link";
import "../../components/lab-details.css";

export default function XSSLabPage() {
  const [solutionOpen, setSolutionOpen] = useState(false);

  return (
    <div className="lab-details-container">
      <div className="lab-details-card">

        {/* Header */}
        <div className="lab-details-header no-border">
          <h1 className="lab-title" style={{ marginBottom: "1.5rem" }}>
            Reflected XSS into HTML context with nothing encoded
          </h1>

          {/* Status */}
          <div className="status-row" style={{ marginBottom: "1.5rem" }}>
            <span className="difficulty-badge">
              Apprentice
            </span>

            <div className="status-badge">
              Lab • Solved
            </div>
          </div>

          {/* Description */}
          <div className="lab-desc-container" style={{ marginBottom: "2rem" }}>
            <p>
              This lab contains a simple reflected cross-site scripting
              vulnerability in the search functionality.
            </p>
            <p>
              To solve the lab, perform a cross-site scripting attack that calls the{" "}
              <span className="inline-code">
                alert
              </span>{" "}
              function.
            </p>
          </div>

          {/* Button */}
          <Link href="/learn/xss/lab1/lab1_1">
            <button className="action-btn">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Solution Accordion */}
        <div className="accordion-container" style={{ marginTop: "2.5rem" }}>
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
                  <li>
                    Copy and paste the following into the search box:
                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      &lt;script&gt;alert(1)&lt;/script&gt;
                    </code>
                  </li>
                  <li>Click &quot;Search&quot;.</li>
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

        {/* Footer */}
        <div className="footer-decor">
          <span>CyberLearn // XSS Lab</span>
        </div>

      </div>
    </div>
  );
}
