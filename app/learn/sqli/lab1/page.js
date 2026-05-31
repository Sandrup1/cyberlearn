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
        
        {/* Header & Back Navigation */}
        <div className="lab-details-header">
          <button 
            onClick={() => router.back()}
            className="back-btn"
          >
            ← Back to Labs
          </button>
          
          <nav className="breadcrumb-nav">
            <span>CyberLearn Academy</span> 
            <span>/</span>
            <span>SQL injection</span> 
            <span>/</span>
            <span className="active">Lab 1</span>
          </nav>

          <h1 className="lab-title">
            SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
          </h1>
        </div>

        {/* Status Section */}
        <div className="status-row">
          <div className="status-badge">
             LAB: NOT SOLVED
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
            SELECT * FROM products WHERE category = <span className="code-box-bold">&apos;Football&apos;</span> AND released = 1
          </div>

          <p>
            To solve the lab, perform a SQL injection attack that causes the application 
            to display one or more unreleased products.
          </p>

          {/* ACCESS LAB BUTTON */}
          <Link href="/learn/sqli/lab1/shop">
            <button className="action-btn">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Accordion Sections */}
        <div className="accordion-container">
          
          {/* Solution Accordion */}
          <div className="accordion-item">
            <button 
              onClick={() => setSolutionOpen(!solutionOpen)}
              className="accordion-trigger"
            >
              <span>Solution Guide</span>
              <span className={`accordion-arrow ${solutionOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            {solutionOpen && (
              <div className="accordion-content">
                <ol className="solution-steps">
                  <li>Navigate to the lab shop page.</li>
                  <li>Use the category filter to select <span style={{ fontWeight: 700 }}>Football</span>.</li>
                  <li>In the browser address bar, modify the URL to include the injection: <br/>
                      <code className="code-box" style={{ display: 'block', marginTop: '0.75rem' }}>
                        ?category=Football&apos; OR 1=1--
                      </code>
                  </li>
                  <li>Submit the request and confirm that hidden products appear in the shop.</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Simple Footer Decorative element */}
        <div className="footer-decor">
            <span>CyberLearn</span>
            <span>Security Lab // 01</span>
        </div>

      </div>
    </div>
  );
}
