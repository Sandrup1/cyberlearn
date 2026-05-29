"use client";
import { useState } from "react";
import Link from "next/link";

export default function LabDetails() {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <div className="bg-[#f2f7f9] min-h-screen p-8 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm p-12 relative overflow-hidden">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-8 flex gap-2">
          <Link href="/dashboard" className="hover:underline">CyberLearn Academy</Link> 
          <span>&gt;</span>
          <Link href="/learn/sqli/labs" className="hover:underline">SQL injection</Link> 
          <span>&gt;</span>
          <span className="text-gray-800 font-semibold">Lab</span>
        </nav>

        {/* Lab Title */}
        <h1 className="text-4xl font-bold text-[#0a1b5d] mb-6 leading-tight">
          Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
        </h1>

        {/* Status Badges */}
        <div className="flex items-center gap-2 mb-8">
          {/* Replaced Apprentice with your request */}
          <div className="bg-[#0a1b5d] text-white flex items-center rounded-full px-3 py-1 text-xs font-bold gap-2">
             <span className="opacity-70 text-sm">🧪</span>
             LAB
             <span className="text-orange-400 font-black">Not solved</span>
          </div>
          
          <div className="ml-auto w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-orange-600">
            <span className="text-xs">share</span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-10 border-b pb-10">
          <p>
            This lab contains a SQL injection vulnerability in the product category filter. 
            When the user selects a category, the application carries out a SQL query like the following:
          </p>

          <div className="bg-[#eff3f6] p-4 rounded-md font-mono text-sm text-gray-800 border-l-4 border-gray-300">
            SELECT * FROM products WHERE category = 'Gifts' AND released = 1
          </div>

          <p>
            To solve the lab, perform a SQL injection attack that causes the application 
            to display one or more unreleased products.
          </p>

          {/* 🔥 MAIN ACTION BUTTON: ACCESS THE SHOP LAB */}
          <Link href="/learn/sqli/sqli1/shop">
            <button className="bg-[#ef6c33] text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-[#d45d2a] transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3 mt-4">
              <span className="text-2xl">⚗️</span> ACCESS THE LAB
            </button>
          </Link>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          
          {/* Solution Accordion */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <button 
              onClick={() => setSolutionOpen(!solutionOpen)}
              className="w-full bg-[#f9f9f9] p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 font-bold text-gray-800">
                <span className="text-xl">💡</span> Solution
              </div>
              <span className={`transform transition ${solutionOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {solutionOpen && (
              <div className="p-6 bg-white text-gray-700 border-t border-gray-200 animate-fadeIn">
                <ol className="list-decimal ml-6 space-y-4 font-medium">
                  <li>Navigate to the lab shop page.</li>
                  <li>Use the category filter to select any category, for example <code className="bg-gray-100 p-1">Gifts</code>.</li>
                  <li>In the browser address bar, append the following to the URL: <br/>
                      <code className="bg-gray-800 text-green-400 p-2 rounded block mt-2 font-mono">' or 1=1--</code>
                  </li>
                  <li>Verify that the application now displays all products, including those that are not yet released.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Navigation back to list */}
          <div className="pt-8">
             <Link 
               href="/learn/sqli/labs" 
               className="text-[#0a1b5d] font-bold hover:underline flex items-center gap-2"
             >
               ← View all SQLi labs
             </Link>
          </div>
        </div>

        {/* Decorative Lightning Bolt Footer */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-[#0a1b5d] flex items-center justify-center rounded-t-lg">
            <span className="text-orange-500 text-3xl font-bold">⚡</span>
        </div>

      </div>
    </div>
  );
}
