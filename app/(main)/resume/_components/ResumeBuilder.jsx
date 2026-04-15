"use client";
import { useState } from "react";
import { generateResume, saveResume } from "@/actions/resume";
import { FileText, Loader2, Download, Save, Sparkles, User } from "lucide-react";

export default function ResumeBuilder({ existingResume }) {
  const [targetJob, setTargetJob] = useState("");
  const [education, setEducation] = useState("");
  const [projects, setProjects] = useState("");
  const [achievements, setAchievements] = useState("");
  const [content, setContent] = useState(existingResume?.content || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const result = await generateResume({
        targetJob,
        education,
        projects,
        achievements,
      });
      // Remove markdown backticks if any
      const clean = result.replace(/```html|```/g, "").trim();
      setContent(clean);
    } catch (error) {
      console.error(error);
      alert("Error generating resume. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await saveResume(content);
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    // Print as PDF
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <User className="h-8 w-8 text-primary" />
          AI Resume Builder
        </h1>
        <p className="text-muted-foreground">
          Generate a professional single-page resume instantly
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">

        {/* Left — Input (2 cols) */}
        <div className="md:col-span-2 border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Your Details</h2>

          <div className="bg-primary/10 rounded-xl p-3 text-sm text-primary">
            ✅ Name, email, skills & experience auto-included from profile!
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Target Job Title</label>
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Education</label>
            <textarea
              rows={3}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. B.Tech CS, ABC University, 2020-2024, 8.5 CGPA"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Projects</label>
            <textarea
              rows={3}
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="e.g. E-commerce app using React, Node.js"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Achievements</label>
            <textarea
              rows={2}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="e.g. Won hackathon, 5 star on HackerRank"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Building Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Build My Resume
              </>
            )}
          </button>
        </div>

        {/* Right — Preview (3 cols) */}
        <div className="md:col-span-3 border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Resume Preview</h2>
            {content && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 text-xs border px-3 py-1.5 rounded-lg hover:bg-secondary transition"
                >
                  {saving
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Save className="h-3 w-3" />
                  }
                  {saved ? "Saved! ✅" : "Save"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition"
                >
                  <Download className="h-3 w-3" />
                  Download PDF
                </button>
              </div>
            )}
          </div>

          {content ? (
            /* Live HTML Preview */
            <div
              className="border rounded-xl p-4 bg-white text-black min-h-96 overflow-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center space-y-3 text-muted-foreground border rounded-xl">
              <FileText className="h-16 w-16 opacity-20" />
              <p className="text-sm font-medium">Your resume will appear here</p>
              <p className="text-xs">Fill in details and click "Build My Resume"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}