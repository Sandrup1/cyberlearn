"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModuleLabSolved } from "../../progress-state";

export default function LabsPage() {
  const router = useRouter();
  const lab1Solved = useModuleLabSolved("sqli", "lab1");
  
  const labs = [
    {
      id: "lab1",
      title: "SQL injection vulnerability in WHERE clause allowing retrieval of hidden data",
      status: lab1Solved ? "Solved" : "Not solved",
      level: "Beginner",
    },
    {
      id: "lab2",
      title: "SQL injection vulnerability allowing login bypass",
      status: "Not solved",
      level: "Beginner",
    },
    {
      id: "lab3",
      title: "SQL injection attack, querying the database type and version on Oracle",
      status: "Not solved",
      level: "Intermediate",
    },
    {
      id: "lab4",
      title: "SQL injection attack, listing the database contents on non-Oracle databases",
      status: "Not solved",
      level: "Intermediate",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-12">
      {/* Navigation & Header */}
      <div className="mb-12">
        <button 
          onClick={() => router.back()}
          className="text-gray-500 hover:text-black mb-6 flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          ← Back
        </button>
        
        <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Vulnerability Labs</h1>
        <p className="text-gray-400 font-medium">Select a lab to start practicing your skills.</p>
      </div>

      {/* Labs List */}
      <div className="space-y-4 w-full max-w-5xl">
        {labs.map((lab) => (
          <Link 
            key={lab.id} 
            href={`/learn/sqli/${lab.id}`}
            className="group block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden relative"
          >
            <div className="flex items-stretch min-h-[90px]">
              
              {/* Title Section */}
              <div className="flex-1 p-6 flex items-center justify-between">
                <div className="flex flex-col gap-1 pr-40">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     {lab.level}
                   </span>
                   <h3 className="font-bold text-gray-900 text-lg group-hover:text-black transition-colors">
                    {lab.title}
                  </h3>
                </div>

                {/* Status Section */}
                <div className="absolute right-0 top-0 bottom-0 flex items-center">
                  {lab.status === "Solved" ? (
                    <div className="bg-green-600 text-white px-8 flex items-center gap-2 font-bold text-sm min-w-[150px] justify-center h-full">
                      <span className="text-white text-lg">✓</span> Solved
                    </div>
                  ) : (
                    <div className="bg-gray-50 text-gray-400 px-8 flex items-center gap-2 font-bold text-sm min-w-[150px] justify-center h-full border-l border-gray-100">
                      Not solved
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
