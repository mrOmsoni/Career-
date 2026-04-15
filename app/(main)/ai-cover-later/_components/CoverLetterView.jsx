"use client";
import { useState } from "react";
import { generateCoverLetter, saveCoverLetter } from "@/actions/coverLetter";
import { FileText, Loader2, Download, Save, Sparkles } from "lucide-react";

export default function CoverLetterView({ existingLetter }) {
  const [jobTitle, setJobTitle] = useState(existingLetter?.jobTitle || "");
  const [companyName, setCompanyName] = useState(existingLetter?.companyName || "");
  const [jobDescription, setJobDescription] = useState(existingLetter?.jobDescription || "");
  const [content, setContent] = useState(existingLetter?.content || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !companyName.trim()) return;
    setLoading(true);
    setSaved(false);
    try {
      const result = await generateCoverLetter({
        jobTitle,
        companyName,
        jobDescription,
      });
      setContent(result);
    } catch (error) {
      console.error(error);
      alert("Error generating cover letter. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await saveCoverLetter({
        content,
        jobTitle,
        companyName,
        jobDescription,
      });
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          AI Cover Letter Generator
        </h1>
        <p className="text-muted-foreground">
          Generate a professional cover letter tailored to your dream job
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left — Input Form */}
        <div className="border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Job Details</h2>

          <div className="space-y-1">
            <label className="text-sm font-medium">Job Title *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Microsoft"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Job Description (Optional)</label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for better results..."
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !jobTitle.trim() || !companyName.trim()}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Right — Output */}
        <div className="border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Generated Letter</h2>
            {content && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 text-xs border px-3 py-1.5 rounded-lg hover:bg-secondary transition"
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  {saved ? "Saved!" : "Save"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-xs border px-3 py-1.5 rounded-lg hover:bg-secondary transition"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            )}
          </div>

          {content ? (
            <textarea
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3 text-muted-foreground">
              <FileText className="h-12 w-12 opacity-30" />
              <p className="text-sm">
                Fill in the job details and click generate to create your cover letter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="border rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Pro Tips
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { tip: "Add job description for better results", icon: "📋" },
            { tip: "Edit the generated letter to add personal touch", icon: "✏️" },
            { tip: "Download and save for future use", icon: "💾" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span>{item.icon}</span>
              <p>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}