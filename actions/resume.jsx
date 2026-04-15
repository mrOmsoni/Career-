"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function generateResume(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `You are an expert ATS-optimized resume writer.
Create a single-page professional HTML resume for this candidate.
Use industry-specific keywords and action verbs.
Make it ATS-friendly with clear sections.
Return ONLY the HTML div — no markdown, no backticks, no explanation.

CANDIDATE INFO:
Name: ${user.name}
Email: ${user.email}
Industry: ${user.industry}
Sub-Industry: ${user.subIndustry || user.industry}
Experience: ${user.experience} years
Skills: ${user.skills?.join(", ")}
Bio: ${user.bio || ""}
Target Job: ${data.targetJob}
Education: ${data.education}
Projects: ${data.projects}
Achievements: ${data.achievements}

Return this exact HTML structure with ALL placeholders filled with REAL data:

<div style="font-family: 'Arial', sans-serif; max-width: 780px; margin: 0 auto; padding: 32px; color: #1a1a1a; line-height: 1.5;">

  <!-- Header -->
  <div style="border-bottom: 3px solid #1d4ed8; padding-bottom: 16px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 4px 0; font-size: 28px; color: #0f172a; letter-spacing: 0.5px;">[FULL NAME]</h1>
    <p style="margin: 0 0 6px 0; font-size: 15px; color: #1d4ed8; font-weight: bold;">[TARGET JOB TITLE]</p>
    <p style="margin: 0; font-size: 13px; color: #475569;">[EMAIL] &nbsp;|&nbsp; [INDUSTRY] &nbsp;|&nbsp; [EXPERIENCE] Years Experience</p>
  </div>

  <!-- Professional Summary -->
  <div style="margin-bottom: 18px;">
    <h2 style="font-size: 13px; font-weight: bold; color: #1d4ed8; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Professional Summary</h2>
    <p style="font-size: 13px; color: #334155; margin: 0;">[3 sentence ATS-optimized summary using industry keywords and experience]</p>
  </div>

  <!-- Skills -->
  <div style="margin-bottom: 18px;">
    <h2 style="font-size: 13px; font-weight: bold; color: #1d4ed8; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Technical Skills</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      [FOR EACH SKILL: <span style="background: #eff6ff; color: #1d4ed8; padding: 3px 10px; border-radius: 4px; font-size: 12px; border: 1px solid #bfdbfe;">[SKILL]</span>]
    </div>
  </div>

  <!-- Experience -->
  <div style="margin-bottom: 18px;">
    <h2 style="font-size: 13px; font-weight: bold; color: #1d4ed8; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Work Experience</h2>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-size: 13px; font-weight: bold; color: #0f172a;">[JOB TITLE based on industry and experience]</span>
        <span style="font-size: 12px; color: #64748b;">[YEAR RANGE based on experience]</span>
      </div>
      <p style="font-size: 12px; color: #1d4ed8; margin: 0 0 6px 0;">[Company Name] &mdash; [Industry]</p>
      <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #334155;">
        <li style="margin-bottom: 3px;">[Achievement with metrics using industry keywords]</li>
        <li style="margin-bottom: 3px;">[Achievement with metrics using industry keywords]</li>
        <li style="margin-bottom: 3px;">[Achievement with metrics using industry keywords]</li>
      </ul>
    </div>
  </div>

  <!-- Projects -->
  <div style="margin-bottom: 18px;">
    <h2 style="font-size: 13px; font-weight: bold; color: #1d4ed8; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Projects</h2>
    [FOR EACH PROJECT:
    <div style="margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between;">
        <span style="font-size: 13px; font-weight: bold; color: #0f172a;">[PROJECT NAME]</span>
        <span style="font-size: 12px; color: #64748b;">[TECH STACK]</span>
      </div>
      <p style="font-size: 13px; color: #334155; margin: 4px 0 0 0;">[Project description with impact and tech used]</p>
    </div>]
  </div>

  <!-- Education -->
  <div style="margin-bottom: 18px;">
    <h2 style="font-size: 13px; font-weight: bold; color: #1d4ed8; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Education</h2>
    <div style="display: flex; justify-content: space-between;">
      <div>
        <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 0;">[DEGREE] in [FIELD]</p>
        <p style="font-size: 13px; color: #334155; margin: 2px 0 0 0;">[UNIVERSITY NAME]</p>
      </div>
      <div style="text-align: right;">
        <p style="font-size: 12px; color: #64748b; margin: 0;">[YEAR]</p>
        <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">[CGPA/Score]</p>
      </div>
    </div>
  </div>

  <!-- Achievements -->
  <div>
    <h2 style="font-size: 13px; font-weight: bold; color: #1d4ed8; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Achievements & Certifications</h2>
    <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #334155;">
      [FOR EACH ACHIEVEMENT: <li style="margin-bottom: 3px;">[ACHIEVEMENT]</li>]
    </ul>
  </div>

</div>

IMPORTANT: Replace ALL placeholders with real data. Make skills appear as individual badge spans. Return ONLY the HTML div.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.replace(/```html|```/g, "").trim();
}

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.upsert({
    where: { userId: user.id },
    update: { content },
    create: { userId: user.id, content },
  });
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  return await db.resume.findUnique({
    where: { userId: user.id },
  });
}