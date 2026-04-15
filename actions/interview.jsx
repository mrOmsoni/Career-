"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateInterviewQuestions(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `Generate 5 technical interview questions for a ${data.jobTitle} position 
  in ${user.industry} industry with ${user.experience} years of experience.
  Skills: ${user.skills?.join(", ")}.
  
  Return ONLY a JSON array like this:
  [
    {
      "question": "question here",
      "answer": "ideal answer here"
    }
  ]`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });  
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
export async function saveAssessment(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const assessment = await db.assessment.create({
    data: {
      userId: user.id,
      quizScore: data.score,
      questions: data.questions,
      category: data.jobTitle,
      improvementTip: data.improvementTip,
    },
  });

  return assessment;
}