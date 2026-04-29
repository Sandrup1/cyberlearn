import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export async function POST(req) {
  const { moduleId, answers } = await req.json();

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("cyberlearn");

  const quiz = await db.collection("quizzes").findOne({
    moduleId,
  });

  if (!quiz) {
    await client.close();
    return Response.json({ error: "Quiz not found" }, { status: 404 });
  }

  let score = 0;

  quiz.questions.forEach((q, index) => {
    if (q.correctAnswer === answers[index]) {
      score++;
    }
  });

  await client.close();

  return Response.json({
    score,
    total: quiz.questions.length,
  });
}