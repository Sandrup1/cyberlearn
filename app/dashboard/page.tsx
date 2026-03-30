"use client";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Main Content - No max-width so it fills the screen to the right */}
        <main className="p-8 space-y-6 w-full">
          
          {/* 1. Progress Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-xl">Overall Progress</h3>
                <p className="text-gray-500 text-sm">You have completed 25% of the curriculum</p>
              </div>
              <span className="text-indigo-600 font-bold text-lg">3 / 12 Modules</span>
            </div>
            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* 2. AI Recommendation Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <h3 className="font-bold text-indigo-600 mb-3 flex items-center gap-2 text-lg">
              ✨ AI Recommendation
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Based on your recent quiz performance in the **Web Security** track, we recommend focusing on 
              <span className="font-semibold text-gray-800"> SQL Injection Advanced Labs</span>. 
              Users who complete this lab see a 40% increase in their vulnerability detection score.
            </p>
          </div>

          {/* 3. Areas to Improve */}
          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Areas to Improve</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Cross-Site Scripting (XSS)</span>
                <div className="flex items-center gap-4">
                  <span className="text-amber-600 text-sm font-semibold">Needs Review</span>
                  <button className="text-indigo-600 hover:underline text-sm font-medium">View Docs</button>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Content Security Policy (CSP)</span>
                <div className="flex items-center gap-4">
                  <span className="text-amber-600 text-sm font-semibold">60% Accuracy</span>
                  <button className="text-indigo-600 hover:underline text-sm font-medium">View Docs</button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Continue Learning */}
          <div className="bg-white p-8 rounded-xl shadow-sm w-full flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-1 text-lg">Continue Learning</h3>
              <p className="text-gray-500 text-base">
                Current Module: <span className="text-gray-900 font-semibold">SQLi</span>
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
              Resume Module
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}