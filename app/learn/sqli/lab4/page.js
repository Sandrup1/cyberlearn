"use client";

import { useState } from "react";
import Link from "next/link";
import "../../components/lab-details.css";

export default function LabPage() {
  const [solutionOpen, setSolutionOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <div className="lab-details-container">
      <div className="lab-details-card">

        {/* Header */}
        <div className="lab-details-header no-border">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              {/* Title */}
              <h1 className="lab-title" style={{ marginBottom: "1.5rem" }}>
                SQL injection UNION attack, finding a column containing text
              </h1>

              {/* Status */}
              <div className="status-row" style={{ marginBottom: "1.5rem" }}>
                {/* Difficulty */}
                <span className="difficulty-badge">
                  Practitioner
                </span>

                {/* Solved */}
                <div className="status-badge">
                  Lab • Solved
                </div>
              </div>
            </div>

            {/* Share */}
            <button className="back-btn" style={{ border: "1px solid #000000", width: "3rem", height: "3rem", justifyContent: "center" }}>
              ↗
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="lab-desc-container">
          <p>
            This lab contains a SQL injection vulnerability in the product category
            filter. The results from the query are returned in the application&apos;s
            response, so you can use a UNION attack to retrieve data from other tables.
            To construct such an attack, you first need to determine the number
            of columns returned by the query. You can do this using a technique
            you learned in a{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
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
        <div style={{ marginTop: "2.5rem" }}>
          <Link href="/learn/sqli/lab3">
            <button className="action-btn">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="status-divider" style={{ margin: "2.5rem 0" }}></div>

        {/* Solution */}
        <div className="accordion-container" style={{ marginTop: 0 }}>
          <div className="accordion-item">
            {/* Header */}
            <button
              onClick={() => setSolutionOpen(!solutionOpen)}
              className="accordion-trigger"
            >
              <span>Solution Guide</span>
              <span className={`accordion-arrow ${solutionOpen ? "open" : ""}`}>▼</span>
            </button>

            {/* Content */}
            {solutionOpen && (
              <div className="accordion-content">
                <ol className="solution-steps">
                  <li>
                    Use Burp Suite to intercept and modify the request that sets
                    the product category filter.
                  </li>

                  <li>
                    Determine the{" "}
                    <span style={{ textDecoration: "underline" }}>
                      number of columns that are being returned by the query
                    </span>.
                    Verify that the query is returning three columns, using the
                    following payload in the{" "}
                    <span className="inline-code">
                      category
                    </span>{" "}
                    parameter:

                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      &apos;+UNION+SELECT+NULL,NULL,NULL--
                    </code>
                  </li>

                  <li>
                    Try replacing each null with the random value provided by the
                    lab, for example:

                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      &apos;+UNION+SELECT+&apos;abcdef&apos;,NULL,NULL--
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
          <div className="accordion-item gray-border">
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="accordion-trigger gray-text"
            >
              <span>Community Solutions</span>
              <span className={`accordion-arrow ${communityOpen ? "open" : ""}`}>▼</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
