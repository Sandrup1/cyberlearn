"use client";

import { useState } from "react";
import Link from "next/link";
import "../../components/lab-details.css";

export default function LabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);

  return (
    <div className="lab-details-container" style={{ backgroundColor: "#f2f7f9" }}>
      <div className="lab-details-card">
        
        {/* Breadcrumbs */}
        <nav className="breadcrumb-nav">
          <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>CyberLearn Academy</Link> 
          <span>&gt;</span>
          <Link href="/learn/sqli/labs" style={{ color: "inherit", textDecoration: "none" }}>SQL injection</Link> 
          <span>&gt;</span>
          <span className="active">Lab</span>
        </nav>

        {/* Lab Title */}
        <h1 className="lab-title" style={{ color: "#0a1b5d", marginBottom: "1.5rem" }}>
          Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
        </h1>

        {/* Status Badges */}
        <div className="status-row" style={{ marginBottom: "2rem" }}>
          <div className="status-badge" style={{ backgroundColor: "#0a1b5d", color: "#ffffff", border: "none" }}>
             <span style={{ marginRight: "0.25rem" }}>🧪</span>
             LAB • <span style={{ color: "#f97316" }}>Not solved</span>
          </div>
          <div className="status-divider"></div>
        </div>

        {/* Problem Description */}
        <div className="lab-desc-container">
          <p>
            This lab contains a SQL injection vulnerability in the product category filter. 
            When the user selects a category, the application carries out a SQL query like the following:
          </p>

          <div className="code-box">
            SELECT * FROM products WHERE category = &apos;Gifts&apos; AND released = 1
          </div>

          <p>
            To solve the lab, perform a SQL injection attack that causes the application 
            to display one or more unreleased products.
          </p>

          {/* MAIN ACTION BUTTON: ACCESS THE SHOP LAB */}
          <Link href="/learn/sqli/sqli1/shop">
            <button className="action-btn" style={{ backgroundColor: "#f97316", borderRadius: "9999px" }}>
              ⚗️ ACCESS THE LAB
            </button>
          </Link>
        </div>

        <div className="status-divider" style={{ margin: "2rem 0" }}></div>

        {/* Accordion Sections */}
        <div className="accordion-container" style={{ marginTop: 0 }}>
          
          {/* Solution Accordion */}
          <div className="accordion-item gray-border">
            <button 
              onClick={() => setSolutionOpen(!solutionOpen)}
              className="accordion-trigger"
            >
              <span>💡 Solution</span>
              <span className={`accordion-arrow ${solutionOpen ? 'open' : ''}`}>▼</span>
            </button>
            {solutionOpen && (
              <div className="accordion-content gray-border-top">
                <ol className="solution-steps">
                  <li>Navigate to the lab shop page.</li>
                  <li>Use the category filter to select any category, for example <code className="inline-code">Gifts</code>.</li>
                  <li>In the browser address bar, append the following to the URL: <br/>
                      <code className="code-box" style={{ display: "block", marginTop: "0.75rem" }}>&apos; or 1=1--</code>
                  </li>
                  <li>Verify that the application now displays all products, including those that are not yet released.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Navigation back to list */}
          <div style={{ paddingTop: "2rem" }}>
             <Link 
               href="/learn/sqli/labs" 
               style={{ color: "#0a1b5d", fontWeight: "bold", textDecoration: "none" }}
             >
               ← View all SQLi labs
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
