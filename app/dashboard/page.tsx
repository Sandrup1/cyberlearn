"use client";

import Link from "next/link";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import {
  useOverallProgress,
  useModuleProgressDetails,
  useModuleQuizLevels,
  useRecentActivity,
} from "../learn/progress-state";
import { getDefaultCourseContent } from "../lib/course-content";
import { useMemo, useState } from "react";

const dashboardModuleIds = ["sqli", "xss", "csrf", "xxe"];

function formatModuleTitle(moduleId: string) {
  const course = getDefaultCourseContent(moduleId);
  return course?.title || moduleId.toUpperCase();
}

export default function Dashboard() {
  const overallProgress = useOverallProgress(dashboardModuleIds);
  const moduleDetails = useModuleProgressDetails(dashboardModuleIds);
  const recentActivity = useRecentActivity(6);

  const defaultSelectedModuleId = useMemo(() => {
    const sorted = [...moduleDetails].sort((a, b) =>
      (b.lastVisitedAt || "").localeCompare(a.lastVisitedAt || "")
    );
    return sorted[0]?.moduleId || moduleDetails[0]?.moduleId || "sqli";
  }, [moduleDetails]);

  const [userSelectedModuleId, setUserSelectedModuleId] = useState<string | null>(null);
  const selectedModuleId = userSelectedModuleId || defaultSelectedModuleId;

  const selectedDetail =
    moduleDetails.find((detail) => detail.moduleId === selectedModuleId) ||
    moduleDetails[0];

  const selectedCourse = selectedDetail
    ? getDefaultCourseContent(selectedDetail.moduleId)
    : null;

  const selectedQuizLevels = useModuleQuizLevels(selectedModuleId);
  const quizLevelOrder = useMemo(() => ["easy", "intermediate", "hard"] as const, []);

  const selectedModuleTitle = selectedDetail
    ? formatModuleTitle(selectedDetail.moduleId)
    : "Module";

  const activeModule = selectedDetail || moduleDetails[0];
  const activeCourse = activeModule ? getDefaultCourseContent(activeModule.moduleId) : null;

  const insightMessage = useMemo(() => {
    if (!selectedDetail) {
      return "";
    }

    const progress = selectedDetail.progress;
    const attempts = progress.quizAttempts ?? 0;
    const scoreOutOfTen = progress.quizScore ?? null;
    const labStarted = progress.labStarted;
    const labCompleted = progress.labCompleted;
    const quizCompleted = progress.quizCompleted;
    const passScore = progress.quizPassScore ?? 6;
    const moduleStarted = Boolean(selectedDetail.startedAt || selectedDetail.lastVisitedAt);

    const passedLevels = quizLevelOrder.filter(
      (levelId) => Boolean(selectedQuizLevels[levelId]?.passed)
    );
    const nextLevelId = quizLevelOrder.find(
      (levelId) => !selectedQuizLevels[levelId]?.passed
    );

    const lastPassedLevelId = passedLevels[passedLevels.length - 1];
    const lastPassedLabel = lastPassedLevelId
      ? lastPassedLevelId === "easy"
        ? "easy"
        : lastPassedLevelId === "intermediate"
        ? "intermediate"
        : "hard"
      : null;
    const nextLevelLabel = nextLevelId
      ? nextLevelId === "easy"
        ? "easy"
        : nextLevelId === "intermediate"
        ? "intermediate"
        : "hard"
      : null;

    // 1. No Activity
    if (attempts === 0 && !labStarted) {
      if (!moduleStarted) {
        return "You haven't started this module yet. Start the module, then take the quiz to test your theory knowledge.";
      }

      return "You've started this module. Next, take the quiz to check your understanding or start the labs to practice.";
    }

    // 2. Quiz Attempted but Failed
    if (scoreOutOfTen !== null && scoreOutOfTen < passScore) {
      if (attempts < 3) {
        return "Your performance in the quiz shows that your understanding is still developing. Try again to improve your results.";
      }
      return "You're facing difficulty in the quiz. Revisiting the concepts will help you improve.";
    }

    // 3. Quiz Passed
    if (scoreOutOfTen !== null && scoreOutOfTen >= passScore) {
      if (!quizCompleted) {
        if (lastPassedLabel && nextLevelLabel) {
          return `You have completed the ${lastPassedLabel} quiz. Try the next difficulty level (${nextLevelLabel}).`;
        }
        if (nextLevelLabel) {
          return `Good progress so far. Try the next difficulty level (${nextLevelLabel}).`;
        }
        return "Good progress so far. Try the next difficulty level.";
      }

      // Only after hard (all levels) is completed should we recommend labs.
      if (!labStarted) {
        return "Great job! You've completed all quiz levels. Now start the lab to apply what you've learned.";
      }
      if (labStarted && !labCompleted) {
        return "You've started the lab but haven't completed it yet. Finishing it will strengthen your practical understanding.";
      }
      if (labCompleted) {
        return "Great job! You've successfully completed both the quiz and the lab for this module.";
      }
    }

    return "You're making progress — complete the quiz and labs to unlock full completion.";
  }, [quizLevelOrder, selectedDetail, selectedQuizLevels]);

  const improvementItems = useMemo(() => {
    if (!selectedDetail) return [];

    const progress = selectedDetail.progress;
    const items: { label: string; href: string }[] = [];
    const passScore = progress.quizPassScore ?? 6;
    const passPercent = passScore * 10;

    const quizHref = selectedCourse?.quizPath || `/quiz/${selectedDetail.moduleId}-module`;
    const labsHref = selectedCourse?.labPath || `/learn/${selectedDetail.moduleId}/lablist`;

    if (progress.quizScore === null) {
      items.push({
        label: `Take the quiz (${passPercent}% to pass)`,
        href: quizHref,
      });
    } else if ((progress.quizScore ?? 0) < passScore) {
      items.push({
        label: `Retry the quiz (best: ${progress.quizScore}/10)`,
        href: quizHref,
      });
    }

    // Only recommend labs after all quiz levels are complete.
    if (progress.quizCompleted) {
      if (!progress.labStarted) {
        items.push({
          label: "Start the labs",
          href: labsHref,
        });
      } else if (!progress.labCompleted) {
        items.push({
          label: `Finish labs (${progress.solvedLabs}/${progress.totalLabs})`,
          href: labsHref,
        });
      }
    }

    if (items.length === 0) {
      items.push({
        label: "Review the theory content",
        href: `/learn/${selectedDetail.moduleId}`,
      });
    }

    return items.slice(0, 2);
  }, [
    selectedCourse?.labPath,
    selectedCourse?.quizPath,
    selectedDetail,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 space-y-6 w-full">
          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-xl">Overall Progress</h3>
                <p className="text-gray-500 text-sm">
                  You have completed {overallProgress.percent}% of the curriculum
                </p>
              </div>
              <span className="text-indigo-600 font-bold text-lg">
                {overallProgress.completedItems} / {overallProgress.totalItems} Tasks
              </span>
            </div>
            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress.percent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {overallProgress.completedModules} / {overallProgress.totalModules} modules fully completed
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="font-bold text-indigo-600 mb-1 text-lg">
                  AI Recommendation + Areas to Improve
                </h3>
                <p className="text-sm text-gray-500">
                  Module:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedModuleTitle}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">
                  View module
                </span>
                <select
                  value={selectedModuleId}
                  onChange={(event) => {
                    setUserSelectedModuleId(event.target.value);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                >
                  {moduleDetails.map((detail) => (
                    <option key={detail.moduleId} value={detail.moduleId}>
                      {formatModuleTitle(detail.moduleId)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  Recommendation
                </h4>
                <p className="mt-3 text-gray-700 text-base leading-relaxed">
                  {insightMessage}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  Next actions
                </h4>
                <div className="mt-3 space-y-2">
                  {improvementItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg bg-white px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>



          <div className="bg-white p-8 rounded-xl shadow-sm w-full flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-1 text-lg">Continue Learning</h3>
              <p className="text-gray-500 text-base">
                Current Module:{" "}
                <span className="text-gray-900 font-semibold">
                  {activeCourse?.shortTitle || activeCourse?.title || "Start Learning"}
                </span>
              </p>
            </div>
            <Link
              href={activeModule ? `/learn/${activeModule.moduleId}` : "/learn"}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
            >
              {activeModule?.startedAt ? "Resume Module" : "Start Module"}
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm w-full">
            <h3 className="font-bold text-gray-800 mb-1 text-lg">Recent Activity</h3>
            <p className="text-gray-500 text-sm">
              Your latest actions across quizzes, labs, and videos.
            </p>

            <div className="mt-5 space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity yet.</p>
              ) : (
                recentActivity.map((item) => {
                  const moduleTitle = formatModuleTitle(item.moduleId);
                  const when = new Date(item.createdAt).toLocaleString();

                  const message =
                    item.type === "quiz"
                      ? `${moduleTitle}: Quiz ${item.status === "passed" ? "passed" : "failed"}`
                      : item.type === "lab"
                      ? `${moduleTitle}: Lab ${item.status === "completed" ? "completed" : "attempted"}${
                          item.labId ? ` (${item.labId})` : ""
                        }`
                      : `${moduleTitle}: Watched video "${item.videoTitle}"`;

                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{message}</p>
                        <p className="mt-1 text-xs text-gray-500">{when}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
