"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `Write a professional cover letter for:
  
  Job Title: ${data.jobTitle}
  Company: ${data.companyName}
  Job Description: ${data.jobDescription}
  
  Candidate Profile:
  - Name: ${user.name}
  - Industry: ${user.industry}
  - Experience: ${user.experience} years
  - Skills: ${user.skills?.join(", ")}
  - Bio: ${user.bio || "Not provided"}
  
  Write a compelling, professional cover letter in 3-4 paragraphs.
  Make it personal and specific to the job description.
  Do NOT include placeholders like [Your Name] etc.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function saveCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.upsert({
    where: { userId: user.id },
    update: {
      content: data.content,
      jobDescription: data.jobDescription,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
    },
    create: {
      userId: user.id,
      content: data.content,
      jobDescription: data.jobDescription,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
    },
  });
}

export async function getCoverLetter() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  return await db.coverLetter.findUnique({
    where: { userId: user.id },
  });
}