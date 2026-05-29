"use client";

import { useEffect, useState } from "react";

const emptyLevel = (id, title) => ({
  id,
  title,
  questions: [],
});

const defaultQuiz = () => ({
  moduleId: "",
  title: "",
  passScore: 6,
  levels: [
    emptyLevel("easy", "Easy"),
    emptyLevel("intermediate", "Intermediate"),
    emptyLevel("hard", "Hard"),
  ],
});

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState(defaultQuiz());
  const [activeLevel, setActiveLevel] = useState(0);
  const [optionsPerQuestion, setOptionsPerQuestion] = useState(4);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const level = formData.levels[activeLevel];
    const existingCount = level?.questions?.[0]?.options?.length;
    setOptionsPerQuestion(typeof existingCount === "number" && existingCount > 1 ? existingCount : 4);
  }, [activeLevel, formData.levels]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/quizzes");
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.moduleId) {
        throw new Error("Module ID is required");
      }

      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save quiz");
      }

      setSuccess(`Quiz '${formData.moduleId}' saved successfully!`);
      setFormData(defaultQuiz());
      fetchQuizzes();
    } catch (err) {
      setError(`Save failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (moduleId) => {
    if (!confirm(`Are you sure you want to delete the quiz for '${moduleId}'?`)) return;

    try {
      setError(null);
      const res = await fetch(`/api/admin/quizzes?moduleId=${moduleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete quiz");

      setSuccess(`Quiz '${moduleId}' deleted successfully.`);
      fetchQuizzes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz");
    }
  };

  const resizeOptions = (options, count) => {
    if (count < 2) return ["", ""];
    if (options.length === count) return options;
    if (options.length > count) return options.slice(0, count);
    return [...options, ...Array.from({ length: count - options.length }, () => "")];
  };

  const applyOptionsPerQuestionToActiveLevel = (count) => {
    if (!Number.isFinite(count)) return;
    const clamped = Math.max(2, Math.min(10, Math.floor(count)));
    const newFormData = { ...formData };
    const questions = newFormData.levels[activeLevel].questions;

    questions.forEach((q) => {
      q.options = resizeOptions(Array.isArray(q.options) ? q.options : [], clamped);
      q.correctAnswers = (Array.isArray(q.correctAnswers) ? q.correctAnswers : [])
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value >= 0 && value < clamped);
    });

    setFormData(newFormData);
    setOptionsPerQuestion(clamped);
  };

  const setActiveLevelQuestionCount = (count) => {
    if (!Number.isFinite(count)) return;
    const target = Math.max(0, Math.min(100, Math.floor(count)));
    const newFormData = { ...formData };
    const questions = newFormData.levels[activeLevel].questions;

    while (questions.length < target) {
      questions.push({
        question: "",
        options: Array.from({ length: optionsPerQuestion }, () => ""),
        correctAnswers: [],
      });
    }

    if (questions.length > target) {
      questions.splice(target, questions.length - target);
    }

    setFormData(newFormData);
  };

  const addQuestion = () => {
    const newFormData = { ...formData };
    newFormData.levels[activeLevel].questions.push({
      question: "",
      options: Array.from({ length: optionsPerQuestion }, () => ""),
      correctAnswers: [],
    });
    setFormData(newFormData);
  };

  const updateQuestion = (qIndex, field, value, optIndex) => {
    const newFormData = { ...formData };
    const q = newFormData.levels[activeLevel].questions[qIndex];
    if (field === "question") q.question = value;
    if (field === "option" && optIndex !== undefined) {
      q.options[optIndex] = value;
    }
    setFormData(newFormData);
  };

  const toggleCorrectOption = (qIndex, optIndex) => {
    const newFormData = { ...formData };
    const q = newFormData.levels[activeLevel].questions[qIndex];
    const existing = Array.isArray(q.correctAnswers) ? q.correctAnswers : [];
    const next = existing.includes(optIndex)
      ? existing.filter((value) => value !== optIndex)
      : [...existing, optIndex];
    q.correctAnswers = next;
    setFormData(newFormData);
  };

  const removeQuestion = (qIndex) => {
    const newFormData = { ...formData };
    newFormData.levels[activeLevel].questions.splice(qIndex, 1);
    setFormData(newFormData);
  };

  const loadQuizIntoEditor = (quiz) => {
    // Merge loaded quiz with default structure to ensure all 3 levels exist
    const newForm = defaultQuiz();
    newForm.moduleId = quiz.moduleId || "";
    newForm.title = quiz.title || "";
    newForm.passScore = typeof quiz.passScore === "number" ? quiz.passScore : 6;
    
    if (quiz.levels) {
      quiz.levels.forEach((l) => {
        const idx = newForm.levels.findIndex(nl => nl.id === l.id);
        if (idx !== -1) {
          newForm.levels[idx].questions = (l.questions || []).map((q) => {
            const options = Array.isArray(q.options) ? q.options : ["", ""];
            const maybe = q || {};
            const correctAnswersRaw = Array.isArray(maybe.correctAnswers)
              ? maybe.correctAnswers
              : typeof maybe.correctAnswer === "number"
              ? [maybe.correctAnswer]
              : [];
            const correctAnswers = correctAnswersRaw
              .map((value) => Number(value))
              .filter(
                (value) =>
                  Number.isFinite(value) && value >= 0 && value < options.length
              );

            return {
              question: typeof q.question === "string" ? q.question : "",
              options,
              correctAnswers,
            };
          });
        }
      });
    }
    setFormData(newForm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <a href="/admin" className="text-blue-500 hover:underline">
          &larr; Back to Admin Panel
        </a>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-6">Quiz Editor</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Module ID</label>
            <input 
              type="text" 
              value={formData.moduleId} 
              onChange={e => setFormData({...formData, moduleId: e.target.value})}
              className="w-full border p-2 rounded" 
              placeholder="e.g. sqli, xss"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full border p-2 rounded" 
              placeholder="e.g. SQL Injection Quiz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pass Score (out of 10)</label>
            <input 
              type="number" 
              value={formData.passScore} 
              onChange={e => setFormData({...formData, passScore: Number(e.target.value)})}
              className="w-full border p-2 rounded" 
              min="1" max="10"
            />
            <p className="mt-1 text-xs text-gray-500">
              Passing threshold for each level (e.g. 6 = 60%).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Questions in {formData.levels[activeLevel].title}</label>
            <input
              type="number"
              value={formData.levels[activeLevel].questions.length}
              onChange={(e) => setActiveLevelQuestionCount(Number(e.target.value))}
              className="w-full border p-2 rounded"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Options per Question ({formData.levels[activeLevel].title})</label>
            <input
              type="number"
              value={optionsPerQuestion}
              onChange={(e) => applyOptionsPerQuestionToActiveLevel(Number(e.target.value))}
              className="w-full border p-2 rounded"
              min="2"
              max="10"
            />
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex border-b mb-6">
          {formData.levels.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => setActiveLevel(idx)}
              className={`px-4 py-2 font-medium ${activeLevel === idx ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
            >
              {level.title} ({level.questions.length})
            </button>
          ))}
        </div>

        {/* Questions for active level */}
        <div className="space-y-6">
          {formData.levels[activeLevel].questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold">Question {qIndex + 1}</h4>
                <button onClick={() => removeQuestion(qIndex)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
              
              <input
                type="text"
                value={q.question}
                onChange={e => updateQuestion(qIndex, "question", e.target.value)}
                placeholder="Question text"
                className="w-full border p-2 rounded mb-4"
              />

              <div className="space-y-2">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={Array.isArray(q.correctAnswers) && q.correctAnswers.includes(optIndex)}
                      onChange={() => toggleCorrectOption(qIndex, optIndex)}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateQuestion(qIndex, "option", e.target.value, optIndex)}
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1 border p-2 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 font-medium">
            + Add Question to {formData.levels[activeLevel].title}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t flex justify-end gap-4">
          <button onClick={() => setFormData(defaultQuiz())} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Clear Form
          </button>
          <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Quizzes</h2>
        {loading ? (
          <p className="text-gray-500">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes found in the database.</p>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title || quiz.moduleId}</h3>
                  <p className="text-sm text-gray-500">
                    Module ID: <span className="font-mono bg-gray-100 px-1 rounded">{quiz.moduleId}</span> • 
                    Pass Score: 60%
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => loadQuizIntoEditor(quiz)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(quiz.moduleId)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
