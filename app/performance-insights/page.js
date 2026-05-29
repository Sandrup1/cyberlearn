"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { defaultCourseContents } from "../lib/course-content";
import { usePerformanceData } from "../learn/progress-state";

function formatModuleTitle(moduleId) {
  const course = defaultCourseContents[moduleId];
  return course?.title || moduleId.toUpperCase();
}

function formatScore(value) {
  if (value === null) return "—";
  return `${value.toFixed(1)}/10`;
}

function calcStats(scores) {
  if (scores.length === 0) {
    return {
      latest: null,
      average: null,
      highest: null,
      lowest: null,
      attempts: 0,
    };
  }

  const latest = scores[scores.length - 1];
  const sum = scores.reduce((a, b) => a + b, 0);
  const average = sum / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  return {
    latest,
    average,
    highest,
    lowest,
    attempts: scores.length,
  };
}

export default function PerformanceInsightsPage() {
  const performance = usePerformanceData();

  const moduleIds = useMemo(() => {
    const fromData = Object.keys(performance || {});
    const fromDefaults = Object.keys(defaultCourseContents || {});
    return Array.from(new Set([...fromDefaults, ...fromData])).sort();
  }, [performance]);

  const [selectedModuleId, setSelectedModuleId] = useState("");

  useEffect(() => {
    if (moduleIds.length === 0) {
      setSelectedModuleId("");
      return;
    }

    setSelectedModuleId((current) => {
      if (current && moduleIds.includes(current)) return current;
      return moduleIds[0] || "";
    });
  }, [moduleIds]);

  const selected = selectedModuleId || null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 space-y-6 w-full">
          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-bold text-gray-900 text-2xl">
                  Performance Insights
                </h1>
                <p className="mt-2 text-gray-500 text-sm">
                  Quiz and lab performance per module.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">
                  View module
                </span>
                <select
                  value={selectedModuleId}
                  onChange={(event) => setSelectedModuleId(event.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                >
                  {moduleIds.map((moduleId) => (
                    <option key={moduleId} value={moduleId}>
                      {formatModuleTitle(moduleId)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!selected ? (
            <div className="bg-white p-8 rounded-xl shadow-sm w-full">
              <p className="text-sm text-gray-500">No modules available.</p>
            </div>
          ) : (() => {
              const moduleId = selected;
              const modulePerf = performance[moduleId] || {};
              const course = defaultCourseContents[moduleId];
              const quizLevels = modulePerf.quizzes?.levels || {};
              const overallQuizAttempts = modulePerf.quizzes?.overallAttempts || 0;
              const labsPerf = modulePerf.labs || {};
              const labs = course?.labs || [];

              const levelIds = Object.keys(quizLevels).sort();

              return (
                <div className="bg-white p-8 rounded-xl shadow-sm w-full">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {formatModuleTitle(moduleId)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Module id: {moduleId}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      Quiz attempts: {overallQuizAttempts}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <section className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                        Quizzes
                      </h3>

                      {levelIds.length === 0 ? (
                        <p className="mt-3 text-sm text-gray-500">
                          No quiz attempts recorded for this module yet.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {levelIds.map((levelId) => {
                            const attempts =
                              quizLevels[levelId]?.attempts?.map((a) => a.scoreOutOfTen) || [];
                            const stats = calcStats(attempts);

                            return (
                              <div
                                key={levelId}
                                className="rounded-lg border border-gray-200 bg-white p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="font-bold text-gray-900">
                                    Level: {levelId}
                                  </p>
                                  <span className="text-xs font-bold text-gray-500">
                                    Attempts: {stats.attempts}
                                  </span>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                                  <div>
                                    <span className="text-gray-500">Latest:</span>{" "}
                                    {formatScore(stats.latest)}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Average:</span>{" "}
                                    {formatScore(stats.average)}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Highest:</span>{" "}
                                    {formatScore(stats.highest)}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Lowest:</span>{" "}
                                    {formatScore(stats.lowest)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>

                    <section className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                        Labs
                      </h3>

                      {labs.length === 0 ? (
                        <p className="mt-3 text-sm text-gray-500">
                          No labs configured for this module.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {labs.map((lab) => {
                            const perf = labsPerf[lab.id];
                            const attempts = perf?.attempts?.length || 0;
                            const completed = Boolean(perf?.completedAt);
                            const attempted = attempts > 0;
                            const status = completed
                              ? "Completed"
                              : attempted
                                ? "Attempted (not completed)"
                                : "Not attempted";

                            return (
                              <div
                                key={lab.id}
                                className="rounded-lg border border-gray-200 bg-white p-4"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-900">
                                      {lab.title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      Lab id:{" "}
                                      <span className="font-mono">{lab.id}</span>
                                    </p>
                                  </div>
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                                      completed
                                        ? "bg-green-100 text-green-800"
                                        : attempted
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                </div>

                                <div className="mt-3 text-sm text-gray-700">
                                  <span className="text-gray-500">Attempts:</span>{" "}
                                  {attempts}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              );
            })()}
        </main>
      </div>
    </div>
  );
}
