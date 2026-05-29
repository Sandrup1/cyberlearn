"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  saveModuleQuizLevelResult,
  useModuleQuizLevels,
} from "../../learn/progress-state";

export default function QuizPage() {
  const params = useParams();
  const levelProgress = useModuleQuizLevels(params.moduleId);
  const [quiz, setQuiz] = useState(null);
  const [activeLevelId, setActiveLevelId] = useState("easy");
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz/${params.moduleId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setQuiz(data);
        setActiveLevelId(data.levels?.[0]?.id || "easy");
      } catch {
        setError("Failed to load quiz");
      }
    }

    loadQuiz();
  }, [params.moduleId]);

  const activeLevel = useMemo(() => {
    return quiz?.levels.find((level) => level.id === activeLevelId) || null;
  }, [activeLevelId, quiz]);

  const activeLevelIndex = quiz?.levels.findIndex(
    (level) => level.id === activeLevelId
  ) ?? 0;

  function isLevelUnlocked(levelIndex) {
    if (levelIndex === 0 || !quiz) {
      return true;
    }

    const previousLevel = quiz.levels[levelIndex - 1];
    return Boolean(levelProgress[previousLevel.id]?.passed);
  }

  function selectLevel(level, levelIndex) {
    if (!isLevelUnlocked(levelIndex)) {
      return;
    }

    setActiveLevelId(level.id);
    setAnswers([]);
    setSubmitted(false);
    setResult(null);
  }

  function handleToggle(qIndex, optionIndex) {
    const updated = [...answers];
    const existing = Array.isArray(updated[qIndex]) ? updated[qIndex] : [];
    const next = existing.includes(optionIndex)
      ? existing.filter((value) => value !== optionIndex)
      : [...existing, optionIndex];
    updated[qIndex] = next;
    setAnswers(updated);
  }

  async function handleSubmit() {
    if (!activeLevel) {
      return;
    }

    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId: params.moduleId,
          levelId: activeLevel.id,
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Quiz submission failed");
        return;
      }

      setResult(data);
      setSubmitted(true);
      saveModuleQuizLevelResult(
        params.moduleId,
        data.levelId,
        data.score,
        data.total,
        data.scoreOutOfTen,
        data.passScore,
        data.passed,
        data.allLevelsPassed
      );
    } catch {
      setError("Failed to submit quiz");
    }
  }

  function goToNextLevel() {
    if (!quiz || !result?.nextLevelId) {
      return;
    }

    const nextLevel = quiz.levels.find((level) => level.id === result.nextLevelId);

    if (nextLevel) {
      setActiveLevelId(nextLevel.id);
      setAnswers([]);
      setSubmitted(false);
      setResult(null);
    }
  }

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!quiz || !activeLevel) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Module Quiz
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">{quiz.title}</h1>
          <p className="mt-2 text-gray-500">
            Each level has {activeLevel.questions.length} questions. Score at
            least {quiz.passScore}/10 ({Math.ceil((quiz.passScore / 10) * activeLevel.questions.length)} correct)
            to unlock the next level.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {quiz.levels.map((level, levelIndex) => {
            const unlocked = isLevelUnlocked(levelIndex);
            const passed = Boolean(levelProgress[level.id]?.passed);

            return (
              <button
                key={level.id}
                type="button"
                onClick={() => selectLevel(level, levelIndex)}
                className={`rounded-xl border p-4 text-left transition ${
                  activeLevelId === level.id
                    ? "border-blue-600 bg-blue-50"
                    : unlocked
                    ? "border-gray-200 bg-white hover:border-gray-400"
                    : "border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{level.title}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      passed
                        ? "bg-green-600 text-white"
                        : unlocked
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {passed ? "Passed" : unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {level.questions.length} questions
                </p>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Level {activeLevelIndex + 1}
              </p>
              <h2 className="text-2xl font-bold text-gray-950">
                {activeLevel.title}
              </h2>
            </div>
            <p className="text-sm font-semibold text-gray-500">
              Passing score: {quiz.passScore}/10
            </p>
          </div>

          {activeLevel.questions.map((q, index) => (
            <div key={index} className="mb-6 rounded-xl border p-4">
              <p className="mb-3 font-semibold">
                {index + 1}. {q.question}
              </p>

              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`mb-2 block cursor-pointer rounded-lg border p-3 ${
                    (answers[index] ?? []).includes(i)
                      ? "border-blue-500 bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={`q${index}`}
                    className="mr-2"
                    checked={(answers[index] ?? []).includes(i)}
                    onChange={() => handleToggle(index, i)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Submit {activeLevel.title} Quiz
            </button>
          )}

          {submitted && result && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <h2
                className={`text-xl font-bold ${
                  result.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                Score: {result.score} / {result.total} ({result.scoreOutOfTen}/10)
              </h2>

              {!result.passed && (
                <p className="mt-2 text-red-500">
                  You need {result.passScore}/10 to unlock the next level. Try
                  this level again.
                </p>
              )}

              {result.passed && result.nextLevelId && (
                <button
                  type="button"
                  onClick={goToNextLevel}
                  className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800"
                >
                  Go to Next Level
                </button>
              )}

              {result.allLevelsPassed && (
                <p className="mt-2 font-semibold text-blue-600">
                  All quiz levels complete. Good job!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
