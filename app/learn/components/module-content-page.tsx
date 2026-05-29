"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CourseContent,
  CourseModuleId,
  ContentCard,
  getDefaultCourseContent,
} from "../../lib/course-content";
import { initializeModuleProgress, markModuleVideoWatched } from "../progress-state";

function cardClasses(tone: ContentCard["tone"]) {
  const styles = {
    green:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-emerald-950",
    blue:
      "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-100 text-slate-950",
    amber:
      "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-100 text-amber-950",
    red:
      "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-fuchsia-100 text-rose-950",
  };

  return styles[tone] || styles.blue;
}

function normalizeVideoEmbedUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : trimmed;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return trimmed;
      }
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}

export default function ModuleContentPage({
  moduleId,
}: {
  moduleId: CourseModuleId;
}) {
  const fallbackContent = getDefaultCourseContent(moduleId);
  const [content, setContent] = useState<CourseContent | null>(fallbackContent);
  const [loading, setLoading] = useState(!fallbackContent);

  useEffect(() => {
    initializeModuleProgress(moduleId);
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
        if (active && fallbackContent) {
          setContent(fallbackContent);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, [fallbackContent, moduleId]);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-10">Loading course content...</div>;
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <h1 className="text-2xl font-bold">Course Not Found</h1>
        <Link href="/dashboard" className="text-blue-500 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      <div className="flex-1">
        <div className="flex">
          <aside className="w-72 p-6">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-6 border border-gray-100">
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:underline block mb-4"
              >
                &larr; Back to Dashboard
              </Link>

              <h2 className="font-semibold mb-4 text-black text-xl tracking-tight">
                {content.shortTitle} Sections
              </h2>

              <div className="space-y-2 text-sm">
                {content.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-black transition-colors"
                  >
                    {section.label}
                  </a>
                ))}

                <div className="border-t my-3"></div>

                <Link
                  href={content.labPath}
                  className="block px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all cursor-pointer text-center font-bold"
                >
                  View {content.shortTitle} Labs
                </Link>

                <Link
                  href={content.quizPath}
                  className="block px-3 py-2 rounded-lg border border-black text-black hover:bg-gray-50 transition-all cursor-pointer text-center font-bold"
                >
                  Attempt Quiz
                </Link>
              </div>
            </div>
          </aside>

          <main className="flex-1 p-10 space-y-16">
            {content.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                {index === 0 ? (
                  <h1 className="text-2xl font-bold mb-3 text-black">
                    {section.heading}
                  </h1>
                ) : (
                  <h2 className="text-xl font-semibold mb-3 text-black">
                    {section.heading}
                  </h2>
                )}

                {section.body && (
                  <p className="text-gray-700 leading-relaxed">{section.body}</p>
                )}

                {section.items && (
                  <ul className="list-disc pl-6 space-y-3 text-gray-700 font-medium mt-4">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <span className="text-black font-bold">
                          {item.title}:
                        </span>{" "}
                        {item.body}
                      </li>
                    ))}
                  </ul>
                )}

                {section.code && (
                  <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm shadow-inner overflow-x-auto leading-relaxed whitespace-pre-wrap mt-5">
                    {section.codeLabel && (
                      <>
                        <span className="text-pink-400 italic">
                          {section.codeLabel}
                        </span>
                        <br />
                      </>
                    )}
                    {section.code}
                  </div>
                )}

                {section.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    {section.cards.map((card) => (
                      <div
                        key={card.title}
                        className={[
                          "relative overflow-hidden rounded-xl border p-5 shadow-sm",
                          cardClasses(card.tone),
                        ].join(" ")}
                      >
                        <h4 className="font-bold mb-1">{card.title}</h4>
                        <p className="text-sm opacity-90">{card.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.videoUrl && (
                  <div className="space-y-3 mt-5">
                    <div className="mx-auto w-full max-w-3xl">
                      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        <iframe
                          className="w-full h-full"
                          src={normalizeVideoEmbedUrl(section.videoUrl)}
                          title={`${content.title} video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                    <a
                      className="inline-flex text-sm font-semibold text-gray-600 hover:text-black underline-offset-4 hover:underline"
                      href={section.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open video in new tab
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        markModuleVideoWatched(moduleId, section.heading || "Video")
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
                    >
                      Mark video as watched
                    </button>
                  </div>
                )}

                {!section.videoUrl && section.id === "video" && section.body && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 mt-5">
                    <p className="text-gray-700 leading-relaxed">{section.body}</p>
                  </div>
                )}

                {section.quizQuestion && (
                  <div className="mt-5">
                    <p className="mb-6 text-gray-700 font-medium">
                      {section.quizQuestion}
                    </p>
                    <div className="space-y-3">
                      {(section.quizOptions || []).map((option) => (
                        <button
                          key={option}
                          className="w-full text-left border border-gray-200 p-4 rounded-xl hover:bg-gray-50 hover:border-black transition-all font-medium"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
