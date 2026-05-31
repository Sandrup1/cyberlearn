"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../components/lab-details.css";

export default function LabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="lab-details-container">
      <div className="lab-details-card">

        {/* Header */}
        <div className="lab-details-header no-border">
          {/* Back Button */}
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
            <span>SQL Injection</span>
            <span>/</span>
            <span className="active">Lab</span>
          </nav>

          {/* Title */}
          <h1 className="lab-title" style={{ marginBottom: "1.5rem" }}>
            SQL injection UNION attack, determining the number of columns returned by the query
          </h1>

          {/* Status */}
          <div className="status-row" style={{ marginBottom: "1.5rem" }}>
            {/* Difficulty */}
            <span className="difficulty-badge">
              Practitioner
            </span>

            {/* Lab Status */}
            <div className="status-badge">
              Lab • Solved
            </div>
          </div>

          {/* Description */}
          <div className="lab-desc-container" style={{ marginBottom: "2rem" }}>
            <p>
              This lab contains a SQL injection vulnerability in the product
              category filter. The results from the query are returned in the
              application&apos;s response, so you can use a UNION attack to retrieve
              data from other tables.
            </p>
            <p>
              To solve the lab, determine the number of columns returned by the
              query by performing a SQL injection UNION attack that returns an
              additional row containing NULL values.
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

        {/* Accordions */}
        <div className="accordion-container" style={{ marginTop: 0 }}>
          
          {/* Solution Section */}
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
                    Modify the{" "}
                    <span className="inline-code">
                      category
                    </span>{" "}
                    parameter, giving it the value:
                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      &apos;+UNION+SELECT+NULL--
                    </code>
                    <p style={{ marginTop: "0.5rem" }}>
                      Observe that an error occurs.
                    </p>
                  </li>

                  <li>
                    Modify the{" "}
                    <span className="inline-code">
                      category
                    </span>{" "}
                    parameter to add an additional column containing a null value:
                    <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>
                      &apos;+UNION+SELECT+NULL,NULL--
                    </code>
                  </li>

                  <li>
                    Continue adding null values until the error disappears and the
                    response includes additional content containing the null values.
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Community Solutions */}
          <div className="accordion-item gray-border">
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="accordion-trigger gray-text"
            >
              <span>Community Solutions</span>
              <span className={`accordion-arrow ${communityOpen ? "open" : ""}`}>▼</span>
            </button>

            {communityOpen && (
              <div className="accordion-content gray-border-top">
                <div className="accordion-content-inner">
                  {/* Comment */}
                  <div className="community-comment">
                    <h3 className="comment-author">
                      Rana Khalil
                    </h3>
                    <p className="comment-text">
                      The easiest way to determine the number of columns is by
                      incrementing NULL values until the server stops throwing an error.
                    </p>
                  </div>

                  {/* Comment */}
                  <div className="community-comment">
                    <h3 className="comment-author">
                      CyberLearner
                    </h3>
                    <p className="comment-text">
                      You can also use ORDER BY to determine the number of columns
                      before attempting UNION SELECT.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
