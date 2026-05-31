"use client";

import { useState } from "react";
import Link from "next/link";
import "../../components/lab-details.css";

export default function StoredXSSLabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);

  return (
    <div className="lab-details-container">
      <div className="lab-details-card">

        {/* Header */}
        <div className="lab-details-header no-border">
          <h1 className="lab-title" style={{ marginBottom: "1.5rem" }}>
            Stored XSS into HTML context with nothing encoded
          </h1>

          {/* Status */}
          <div className="status-row" style={{ marginBottom: "1.5rem" }}>
            <span className="difficulty-badge">
              Apprentice
            </span>

            <div className="status-badge">
              Lab • Not solved
            </div>
          </div>

          {/* Description */}
          <div className="lab-desc-container" style={{ marginBottom: "2rem" }}>
            <p>
              This lab contains a stored cross-site scripting vulnerability in the comment functionality.
            </p>
            <p>
              To solve this lab, submit a comment that calls the{" "}
              <span className="inline-code">
                alert
              </span>{" "}
              function when the blog post is viewed.
            </p>
          </div>

          {/* ACCESS LAB BUTTON */}
          <Link href="/learn/xss/lab2/lab2_2">
            <button className="action-btn">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="status-divider" style={{ margin: "2.5rem 0" }}></div>

        {/* Solution Accordion */}
        <div className="accordion-container" style={{ marginTop: 0 }}>
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
                    Enter the following into the comment box:
                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      &lt;script&gt;alert(1)&lt;/script&gt;
                    </code>
                  </li>

                  <li>Enter a name, email and website.</li>
                  <li>Click &quot;Post comment&quot;.</li>
                  <li>Go back to the blog to trigger the alert.</li>
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
          <span>CyberLearn // Stored XSS Lab</span>
        </div>

      </div>
    </div>
  );
}
