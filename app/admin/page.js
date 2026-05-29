"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [modulesCount, setModulesCount] = useState(0);
  const [labsCount, setLabsCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      setError("");
      try {
        const [usersRes, contentRes] = await Promise.all([
          fetch("/api/users", { cache: "no-store" }),
          fetch("/api/admin/content", { cache: "no-store" }),
        ]);

        const usersJson = await usersRes.json();
        const contentJson = await contentRes.json();

        if (!active) return;

        const users = Array.isArray(usersJson) ? usersJson : [];
        const modules = Array.isArray(contentJson) ? contentJson : [];

        setUsersCount(users.length);
        setModulesCount(modules.length);
        setLabsCount(
          modules.reduce((total, module) => {
            const labs = Array.isArray(module.labs) ? module.labs : [];
            return total + labs.length;
          }, 0)
        );

        if (!usersRes.ok || !contentRes.ok) {
          setError("Some admin stats failed to load.");
        }
      } catch {
        if (!active) return;
        setError("Unable to load admin stats.");
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="p-6 lg:p-10 text-gray-900">
      <div className="mx-auto w-full max-w-none space-y-6">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Summary
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-950">
                Platform Overview
              </h2>
              <p className="mt-1 text-sm font-semibold text-black/50">
                Total users, modules, and labs available in CyberLearn.
              </p>
            </div>
            {error && (
              <p className="text-sm font-bold text-amber-700">{error}</p>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/25 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
              </div>
              <div className="relative flex min-h-[190px] flex-col justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-black">
                    Total Users
                  </p>
                  <p className="mt-4 text-5xl font-extrabold tracking-tight lg:text-6xl text-black">
                    {usersCount}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black">
                  Registered accounts
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-7 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/25 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
              </div>
              <div className="relative flex min-h-[190px] flex-col justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-black">
                    Modules
                  </p>
                  <p className="mt-4 text-5xl font-extrabold tracking-tight lg:text-6xl text-black">
                    {modulesCount}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black">
                  Published + draft content modules
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-7 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/25 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
              </div>
              <div className="relative flex min-h-[190px] flex-col justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-black">
                    Labs
                  </p>
                  <p className="mt-4 text-5xl font-extrabold tracking-tight lg:text-6xl text-black">
                    {labsCount}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black">
                  Editable lab entries
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
