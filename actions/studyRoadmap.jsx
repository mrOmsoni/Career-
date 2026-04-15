"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function generateStudyRoadmap(targetRole) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `Create a detailed 6-month study roadmap for someone wanting to become a ${targetRole}.

Current Profile:
- Industry: ${user.industry}
- Experience: ${user.experience} years
- Current Skills: ${user.skills?.join(", ")}

Return ONLY a JSON object (no markdown, no backticks):
{
  "title": "Roadmap title",
  "targetRole": "${targetRole}",
  "totalDuration": "6 months",
  "phases": [
    {
      "phase": 1,
      "title": "Foundation",
      "duration": "Month 1-2",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "resources": ["Resource 1", "Resource 2"],
      "projects": ["Mini project 1"],
      "milestone": "What you can do after this phase"
    },
    {
      "phase": 2,
      "title": "Intermediate",
      "duration": "Month 3-4",
      "topics": ["Topic 1", "Topic 2"],
      "resources": ["Resource 1", "Resource 2"],
      "projects": ["Project 1"],
      "milestone": "What you can do after this phase"
    },
    {
      "phase": 3,
      "title": "Advanced",
      "duration": "Month 5-6",
      "topics": ["Topic 1", "Topic 2"],
      "resources": ["Resource 1", "Resource 2"],
      "projects": ["Major project"],
      "milestone": "Job ready milestone"
    }
  ],
  "dailySchedule": {
    "weekday": "2-3 hours",
    "weekend": "4-5 hours"
  },
  "jobReadySkills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}