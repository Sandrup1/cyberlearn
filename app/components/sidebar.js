"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Sidebar() {
  const [modulesOpen, setModulesOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      setLoading(true);
      try {
        const res = await fetch("/api/courses", { cache: "no-store" });
        const data = await res.json();
        if (!active || !res.ok) return;
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        if (!active) return;
        setCourses([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  const courseLinks = useMemo(() => {
    return [...courses]
      .sort((a, b) => (a.shortTitle || a.title).localeCompare(b.shortTitle || b.title))
      .map((course) => ({
        moduleId: course.moduleId,
        label: course.shortTitle || course.title || course.moduleId.toUpperCase(),
        href: `/learn/${course.moduleId}`,
      }));
  }, [courses]);

  return (
    <div className="w-64 bg-white shadow-sm p-6">
      <h1 className="text-lg font-semibold mb-10 text-gray-900">CyberLearn AI</h1>

      <div className="space-y-4">
        <Link href="/dashboard">
          <div className="hover:bg-gray-500 text-black p-3 rounded-lg font-medium cursor-pointer">
            📊 Dashboard
          </div>
        </Link>

        <Link href="/performance-insights">
          <div className="p-3 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-500 font-medium">
            🧠 Performance Insights
          </div>
        </Link>

        <div>
          <button
            type="button"
            onClick={() => setModulesOpen((open) => !open)}
            className="w-full p-3 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-500 text-left font-medium"
          >
            View all modules {modulesOpen ? "▴" : "▾"}
          </button>

          {modulesOpen && (
            <div className="mt-2 space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
              {loading && (
                <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                  Loading…
                </div>
              )}

              {!loading && courseLinks.length === 0 && (
                <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                  No modules available.
                </div>
              )}

              {courseLinks.map((course) => (
                <Link key={course.moduleId} href={course.href}>
                  <div className="rounded-md px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-white hover:text-gray-900">
                    {course.label}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
