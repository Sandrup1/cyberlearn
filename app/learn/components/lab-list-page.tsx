"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CourseContent,
  CourseModuleId,
  getDefaultCourseContent,
} from "../../lib/course-content";
import { markModuleLabStarted, useModuleLabSolved } from "../progress-state";

export default function LabListPage({ moduleId }: { moduleId: CourseModuleId }) {
  const fallbackContent = getDefaultCourseContent(moduleId) as CourseContent;
  const [content, setContent] = useState<CourseContent>(fallbackContent);

  useEffect(() => {
    markModuleLabStarted(moduleId);
  }, [moduleId]);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const res = await fetch(`/api/content/${moduleId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (active && res.ok) {
          setContent(data);
        }
      } catch {
        if (active) {
          setContent(fallbackContent);
        }
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, [fallbackContent, moduleId]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-black md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/learn/${moduleId}`}
          className="mb-6 inline-block text-sm font-semibold text-gray-500 hover:text-black"
        >
          Back to {content.shortTitle}
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            {content.shortTitle} Labs
          </h1>
          <p className="mt-2 text-gray-500">{content.description}</p>
        </div>

        <div className="space-y-4">
          {content.labs.map((lab) => (
            <LabListItem key={lab.id} moduleId={moduleId} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LabListItem({
  moduleId,
  lab,
}: {
  moduleId: CourseModuleId;
  lab: CourseContent["labs"][number];
}) {
  const solved = useModuleLabSolved(moduleId, lab.id);

  return (
    <Link href={`/learn/${moduleId}/${lab.id}`} className="block">
      <div className="flex min-h-[92px] items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
        <div className="min-w-0 px-5 py-4">
          <span className="mb-2 inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">
            {lab.level}
          </span>
          <h2 className="text-base font-semibold text-gray-800">
            {lab.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{lab.summary}</p>
        </div>

        <div className="pr-4">
          <span
            className={`inline-flex rounded px-5 py-2 text-sm font-semibold ${
              solved ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {solved ? "Solved" : "Not solved"}
          </span>
        </div>
      </div>
    </Link>
  );
}
