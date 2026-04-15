"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { IndustryInsights: true },
  });

  if (!user) throw new Error("User not found");
  return user.IndustryInsights;
}

export async function generateIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { IndustryInsights: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `Generate detailed industry insights for ${user.industry} industry.
Return ONLY a JSON object like this (no markdown, no backticks):
{
  "salaryRanges": [
    {"role": "Junior Developer", "min": 400000, "median": 600000},
    {"role": "Mid Developer", "min": 600000, "median": 1000000},
    {"role": "Senior Developer", "min": 1000000, "median": 1800000},
    {"role": "Tech Lead", "min": 1500000, "median": 2500000},
    {"role": "Manager", "min": 2000000, "median": 3500000}
  ],
  "growthRate": 15.5,
  "demandLevel": "HIGH",
  "topSkills": ["React", "Node.js", "Python", "AWS", "Docker"],
  "marketOutlook": "POSITIVE",
  "keyTrends": [
    "AI integration in all products",
    "Remote work becoming standard",
    "Cloud-first architecture"
  ],
  "recommendedSkills": ["TypeScript", "Kubernetes", "GraphQL"]
}
Use Indian salary ranges in INR. demandLevel must be HIGH/MEDIUM/LOW. marketOutlook must be POSITIVE/NEUTRAL/NEGATIVE.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  const data = JSON.parse(clean);

  const insight = await db.industryInsight.upsert({
    where: { industry: user.industry },
    update: {
      salaryRanges: data.salaryRanges,
      growthRate: data.growthRate,
      demandLevel: data.demandLevel,
      topSkills: data.topSkills,
      marketOutlook: data.marketOutlook,
      keyTrends: data.keyTrends,
      recommendedSkills: data.recommendedSkills,
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    create: {
      industry: user.industry,
      salaryRanges: data.salaryRanges,
      growthRate: data.growthRate,
      demandLevel: data.demandLevel,
      topSkills: data.topSkills,
      marketOutlook: data.marketOutlook,
      keyTrends: data.keyTrends,
      recommendedSkills: data.recommendedSkills,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return insight;
}