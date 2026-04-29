import clientPromise from "../../../lib/mongodb";

const fallbackQuizzes = {
  sqli: {
    title: "SQL Injection Quiz",
    questions: [
      {
        question: "What does SQL injection primarily target?",
        options: [
          "Frontend UI components",
          "Database queries and structure",
          "Client-side CSS styling",
        ],
      },
      {
        question: "Which practice helps prevent SQL injection?",
        options: [
          "Parameterized queries",
          "Longer CSS class names",
          "Disabling browser cookies",
        ],
      },
      {
        question: "What can an attacker try to change during a SQL injection attack?",
        options: [
          "The structure or logic of a database query",
          "The user's screen brightness",
          "The website font family",
        ],
      },
    ],
  },
};

export async function GET(req, { params }) {
  try {
    const { moduleId } = await params;

    if (!moduleId) {
      return Response.json({ error: "Module ID is required" }, { status: 400 });
    }

    let quiz = null;
    let dbError = null;

    try {
      const client = await clientPromise;
      const db = client.db("cyberlearn");
      quiz = await db.collection("quizzes").findOne({ moduleId });
    } catch (error) {
      dbError = error;
      console.error("Quiz DB lookup failed:", error);
    }

    const resolvedQuiz = quiz || fallbackQuizzes[moduleId];

    if (!resolvedQuiz) {
      if (dbError) {
        return Response.json(
          { error: "Quiz database unavailable" },
          { status: 503 }
        );
      }

      return Response.json({ error: "Quiz not found" }, { status: 404 });
    }

    const safeQuestions = resolvedQuiz.questions.map((q) => ({
      question: q.question,
      options: q.options,
    }));

    return Response.json({
      title: resolvedQuiz.title,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Quiz API Error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
