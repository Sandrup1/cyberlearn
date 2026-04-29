"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { saveModuleQuizResult } from "../../learn/progress-state";

type Quiz = {
  title: string;
  questions: {
    question: string;
    options: string[];
  }[];
};

export default function QuizPage() {
  const params = useParams<{ moduleId: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz/${params.moduleId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setQuiz(data);
      } catch {
        setError("Failed to load quiz");
      }
    }

    loadQuiz();
  }, [params.moduleId]);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId: params.moduleId,
          answers,
        }),
      });

      const data = await res.json();
      setResult(data);
      setSubmitted(true);

      if (res.ok && typeof data.score === "number" && typeof data.total === "number") {
        saveModuleQuizResult(params.moduleId, data.score, data.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!quiz) return <p className="text-center mt-10">Loading...</p>;

  const quizComplete = result ? result.score > 6 : false;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {quiz.title}
        </h1>

        {quiz.questions.map((q, index) => (
          <div key={index} className="mb-6 p-4 border rounded-xl">
            <p className="font-semibold mb-3">
              {index + 1}. {q.question}
            </p>

            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`block p-2 rounded-lg cursor-pointer mb-2 border ${
                  answers[index] === i
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`q${index}`}
                  className="mr-2"
                  checked={answers[index] === i}
                  onChange={() => handleSelect(index, i)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        {!submitted && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Submit Quiz
          </button>
        )}

        {submitted && result && (
          <div className="text-center mt-6">
            <h2 className="text-xl font-bold text-green-600">
              Your Score: {result.score} / {result.total}
            </h2>

            {!quizComplete && (
              <p className="text-red-500 mt-2">
                Score above 6 to complete this quiz.
              </p>
            )}

            {quizComplete && (
              <p className="text-blue-500 mt-2">
                Quiz complete. Good job!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
