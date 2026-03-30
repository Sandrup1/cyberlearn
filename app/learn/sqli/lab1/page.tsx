"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen p-8 flex justify-center text-black">
      <div className="max-w-5xl w-full bg-white border border-gray-200 rounded-xl p-12 relative">
        
        {/* Header & Back Navigation */}
        <div className="mb-10 border-b border-gray-100 pb-6">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 hover:text-black mb-6 flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            ← Back to Labs
          </button>
          
          <nav className="text-xs text-gray-400 mb-4 flex gap-2 uppercase tracking-widest font-bold">
            <span>CyberLearn Academy</span> 
            <span>/</span>
            <span>SQL injection</span> 
            <span>/</span>
            <span className="text-black">Lab 1</span>
          </nav>

          <h1 className="text-4xl font-bold text-black leading-tight">
            SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
          </h1>
        </div>

        {/* Status Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="border-2 border-black text-black flex items-center px-4 py-1 text-xs font-black gap-2 uppercase tracking-tighter">
             LAB: NOT SOLVED
          </div>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>

        {/* Problem Description */}
        <div className="space-y-6 text-gray-800 text-lg leading-relaxed mb-10 pb-10">
          <p>
            This lab contains a SQL injection vulnerability in the product category filter. 
            When the user selects a category, the application carries out a SQL query like the following:
          </p>

          <div className="bg-gray-50 p-6 rounded font-mono text-sm text-black border border-gray-200">
            SELECT * FROM products WHERE category = <span className="font-bold underline">'Football'</span> AND released = 1
          </div>

          <p>
            To solve the lab, perform a SQL injection attack that causes the application 
            to display one or more unreleased products.
          </p>

          {/* ACCESS LAB BUTTON - Simple Black Style */}
          <Link href="/learn/sqli/lab1/shop">
            <button className="bg-black text-white px-12 py-4 font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-3 mt-4 active:scale-95 shadow-sm">
              ACCESS THE LAB →
            </button>
          </Link>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          
          {/* Solution Accordion */}
          <div className="border border-black rounded-sm overflow-hidden">
            <button 
              onClick={() => setSolutionOpen(!solutionOpen)}
              className="w-full bg-white p-5 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 font-bold text-black uppercase text-sm tracking-widest">
                Solution Guide
              </div>
              <span className={`text-xs transition-transform ${solutionOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {solutionOpen && (
              <div className="p-8 bg-white text-gray-800 border-t border-black font-medium">
                <ol className="list-decimal ml-6 space-y-5">
                  <li>Navigate to the lab shop page.</li>
                  <li>Use the category filter to select <span className="font-bold">Football</span>.</li>
                  <li>In the browser address bar, modify the URL to include the injection: <br/>
                      <code className="bg-gray-100 border border-gray-300 text-black p-3 rounded block mt-3 font-mono font-bold">
                        ?category=Football' OR 1=1--
                      </code>
                  </li>
                  <li>Submit the request and confirm that hidden products appear in the shop.</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Simple Footer Decorative element */}
        <div className="mt-20 border-t border-gray-100 pt-8 flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
            <span>CyberLearn</span>
            <span>Security Lab // 01</span>
        </div>

      </div>
    </div>
  );
}