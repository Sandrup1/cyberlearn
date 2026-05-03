"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultCourseContents } from "../../lib/course-content";
import type { PerformanceData } from "../../learn/progress-state";

type User = {
  _id: string;
  name: string;
  email: string;
};

type ProgressResponse = {
  progress: unknown;
  performance?: PerformanceData;
  updatedAt?: string;
};

function formatModuleTitle(moduleId: string) {
  const course = defaultCourseContents[moduleId];
  return course?.title || moduleId.toUpperCase();
}

function formatScore(value: number | null) {
  if (value === null) return "—";
  return `${value.toFixed(1)}/10`;
}

function calcStats(scores: number[]) {
  if (scores.length === 0) {
    return {
      latest: null as number | null,
      average: null as number | null,
      highest: null as number | null,
      lowest: null as number | null,
      attempts: 0,
    };
  }

  const latest = scores[scores.length - 1] ?? null;
  const sum = scores.reduce((a, b) => a + b, 0);
  const average = sum / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  return { latest, average, highest, lowest, attempts: scores.length };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [performanceError, setPerformanceError] = useState("");

  async function fetchUsers() {
    const res = await fetch("/api/users");
    const data = (await res.json()) as User[];
    setUsers(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers(); // refresh list after delete
  };

  async function openPerformance(user: User) {
    setSelectedUser(user);
    setLoadingPerformance(true);
    setPerformance(null);
    setPerformanceError("");

    try {
      const res = await fetch(`/api/progress?email=${encodeURIComponent(user.email)}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as ProgressResponse;

      if (!res.ok) {
        setPerformanceError("Failed to load performance.");
        return;
      }

      setPerformance((data.performance || {}) as PerformanceData);
    } catch {
      setPerformanceError("Failed to load performance.");
    } finally {
      setLoadingPerformance(false);
    }
  }

  const selectedModuleIds = useMemo(() => {
    if (!performance) return [];
    const modules = Object.keys(performance);
    const defaults = Object.keys(defaultCourseContents);
    return Array.from(new Set([...defaults, ...modules])).sort();
  }, [performance]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Users</h1>

      <ul className="mt-4">
        {users.map((user) => (
          <li
            key={user._id?.toString() || user.email}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              Username: {user.name} - Email: {user.email}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openPerformance(user)}
                className="bg-gray-900 text-white px-3 py-1 rounded"
              >
                Performance
              </button>

              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Performance: {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setPerformance(null);
                  setPerformanceError("");
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5">
              {loadingPerformance && (
                <p className="text-sm text-gray-500">Loading…</p>
              )}
              {performanceError && (
                <p className="text-sm font-semibold text-red-600">{performanceError}</p>
              )}

              {!loadingPerformance && !performanceError && performance && (
                <div className="space-y-6">
                  {selectedModuleIds.map((moduleId) => {
                    const modulePerf = performance[moduleId] || {};
                    const quizLevels = modulePerf.quizzes?.levels || {};
                    const overallQuizAttempts = modulePerf.quizzes?.overallAttempts || 0;
                    const labsPerf = modulePerf.labs || {};
                    const labs = defaultCourseContents[moduleId]?.labs || [];
                    const levelIds = Object.keys(quizLevels).sort();

                    return (
                      <div key={moduleId} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">
                              {formatModuleTitle(moduleId)}
                            </h3>
                            <p className="text-xs text-gray-500">Module id: {moduleId}</p>
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            Quiz attempts: {overallQuizAttempts}
                          </div>
                        </div>

                        <div className="mt-4 space-y-4">
                          <section className="rounded-lg border border-gray-200 bg-white p-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                              Quizzes
                            </h4>

                            {levelIds.length === 0 ? (
                              <p className="mt-2 text-sm text-gray-500">No quiz attempts yet.</p>
                            ) : (
                              <div className="mt-3 space-y-3">
                                {levelIds.map((levelId) => {
                                  const scores =
                                    quizLevels[levelId]?.attempts?.map((a) => a.scoreOutOfTen) || [];
                                  const stats = calcStats(scores);

                                  return (
                                    <div
                                      key={levelId}
                                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                    >
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-gray-900">
                                          Level: {levelId}
                                        </p>
                                        <span className="text-xs font-bold text-gray-500">
                                          Attempts: {stats.attempts}
                                        </span>
                                      </div>

                                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
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

                          <section className="rounded-lg border border-gray-200 bg-white p-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                              Labs
                            </h4>

                            {labs.length === 0 ? (
                              <p className="mt-2 text-sm text-gray-500">No labs configured.</p>
                            ) : (
                              <div className="mt-3 space-y-3">
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
                                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-sm font-bold text-gray-900">{lab.title}</p>
                                          <p className="mt-1 text-xs text-gray-500">
                                            Lab id: <span className="font-mono">{lab.id}</span>
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
                                      <div className="mt-2 text-sm text-gray-700">
                                        <span className="text-gray-500">Attempts:</span> {attempts}
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
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
