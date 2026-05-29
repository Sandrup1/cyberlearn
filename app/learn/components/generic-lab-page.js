"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDefaultCourseContent,
} from "../../lib/course-content";
import {
  markModuleLabSolved,
  markModuleLabStarted,
  markLabAttempted,
  useModuleLabSolved,
} from "../progress-state";

export default function GenericLabPage({
  moduleId,
  labId,
}) {
  const fallbackContent = getDefaultCourseContent(moduleId);
  const fallbackLab =
    fallbackContent.labs.find((lab) => lab.id === labId) || fallbackContent.labs[0];
  const [content, setContent] = useState(fallbackContent);
  const [lab, setLab] = useState(fallbackLab);
  const solved = useModuleLabSolved(moduleId, labId);

  useEffect(() => {
    markModuleLabStarted(moduleId);
  }, [moduleId]);

  useEffect(() => {
    markLabAttempted(moduleId, labId);
  }, [labId, moduleId]);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const res = await fetch(`/api/content/${moduleId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        const loadedLab = data.labs.find((item) => item.id === labId);

        if (active && res.ok && loadedLab) {
          setContent(data);
          setLab(loadedLab);
        }
      } catch {
        if (active) {
          setContent(fallbackContent);
          setLab(fallbackLab);
        }
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, [fallbackContent, fallbackLab, labId, moduleId]);

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-black">
      <main className="mx-auto max-w-4xl rounded-lg border border-gray-200 p-8 shadow-sm">
        <Link
          href={content.labPath}
          className="mb-6 inline-block text-sm font-semibold text-gray-500 hover:text-black"
        >
          Back to {content.shortTitle} labs
        </Link>

        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Editable Lab
        </p>
        <div
          className={`mb-5 inline-flex rounded border px-4 py-1 text-xs font-black uppercase tracking-wide ${
            solved
              ? "border-green-600 bg-green-50 text-green-700"
              : "border-black text-black"
          }`}
        >
          Lab: {solved ? "solved" : "not solved"}
        </div>
        <h1 className="mb-4 text-3xl font-bold">{lab.title}</h1>
        <p className="mb-6 text-gray-600">{lab.summary}</p>

        <section className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="mb-2 text-lg font-bold">Objective</h2>
          <p className="text-gray-700">{lab.objective}</p>
        </section>

        {lab.starterCode && (
          <pre className="mb-6 overflow-x-auto rounded-lg bg-black p-5 text-sm leading-7 text-green-300">
            <code>{lab.starterCode}</code>
          </pre>
        )}

        <section className="mb-6 rounded-lg border border-gray-200 p-5">
          <h2 className="mb-4 text-lg font-bold">Solution Guide</h2>
          <ol className="ml-6 list-decimal space-y-3 text-gray-700">
            {lab.solutionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        {lab.defenseNote && (
          <section className="mb-6 rounded-lg bg-gray-950 p-5 text-white">
            <h2 className="mb-2 text-lg font-bold">Defense Note</h2>
            <p className="text-sm leading-6 text-gray-200">{lab.defenseNote}</p>
          </section>
        )}

        <button
          onClick={() => markModuleLabSolved(moduleId, labId)}
          className="rounded-lg bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
        >
          {solved ? "Submitted" : "Submit Lab"}
        </button>
      </main>
    </div>
  );
}
