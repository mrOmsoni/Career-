"use client";
import { useState } from "react";
import { generateStudyRoadmap } from "@/actions/studyRoadmap";
import {
  BookOpen, Loader2, Target, CheckCircle,
  Clock, Code, ArrowRight, Sparkles, Trophy
} from "lucide-react";

export default function RoadmapView() {
  const [targetRole, setTargetRole] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedPhases, setCompletedPhases] = useState([]);

  const handleGenerate = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    setRoadmap(null);
    try {
      const result = await generateStudyRoadmap(targetRole);
      setRoadmap(result);
    } catch (error) {
      console.error(error);
      alert("Error generating roadmap. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (phase) => {
    setCompletedPhases((prev) =>
      prev.includes(phase)
        ? prev.filter((p) => p !== phase)
        : [...prev, phase]
    );
  };

  const phaseColors = [
    "border-blue-500 bg-blue-50 dark:bg-blue-950",
    "border-purple-500 bg-purple-50 dark:bg-purple-950",
    "border-green-500 bg-green-50 dark:bg-green-950",
  ];

  const phaseIconColors = [
    "text-blue-500",
    "text-purple-500",
    "text-green-500",
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Study Roadmap
        </h1>
        <p className="text-muted-foreground">
          Get a personalized 6-month learning path for your dream role
        </p>
      </div>

      {/* Input */}
      <div className="border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">What role do you want to achieve?</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
            className="flex-1 border rounded-xl px-4 py-2.5 bg-background text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !targetRole.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2">
          {["Full Stack Developer", "Data Scientist", "DevOps Engineer", "UI/UX Designer", "ML Engineer"].map((role) => (
            <button
              key={role}
              onClick={() => setTargetRole(role)}
              className="text-xs px-3 py-1 border rounded-full hover:bg-secondary transition text-muted-foreground"
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="border rounded-2xl p-12 text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-lg font-semibold">Creating your personalized roadmap...</h2>
          <p className="text-muted-foreground text-sm">AI is analyzing your profile and building a custom learning path</p>
        </div>
      )}

      {/* Roadmap */}
      {roadmap && !loading && (
        <div className="space-y-6">

          {/* Roadmap Header */}
          <div className="border rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{roadmap.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Target: {roadmap.targetRole} • Duration: {roadmap.totalDuration}
                </p>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {completedPhases.length}/{roadmap.phases?.length} Phases Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${(completedPhases.length / (roadmap.phases?.length || 1)) * 100}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedPhases.length / (roadmap.phases?.length || 1)) * 100)}% Complete
              </p>
            </div>

            {/* Daily Schedule */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-xl p-3 text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Weekdays</p>
                <p className="font-semibold text-sm">{roadmap.dailySchedule?.weekday}</p>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Weekends</p>
                <p className="font-semibold text-sm">{roadmap.dailySchedule?.weekend}</p>
              </div>
            </div>
          </div>

          {/* Phases */}
          {roadmap.phases?.map((phase, index) => (
            <div
              key={phase.phase}
              className={`border-l-4 rounded-2xl p-6 space-y-4 ${phaseColors[index % phaseColors.length]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${phaseIconColors[index % phaseIconColors.length]} border-current`}>
                    {phase.phase}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{phase.title}</h3>
                    <p className="text-xs text-muted-foreground">{phase.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePhase(phase.phase)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition ${
                    completedPhases.includes(phase.phase)
                      ? "bg-green-500 text-white border-green-500"
                      : "hover:bg-secondary"
                  }`}
                >
                  <CheckCircle className="h-3 w-3" />
                  {completedPhases.includes(phase.phase) ? "Completed!" : "Mark Done"}
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">

                {/* Topics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Topics
                  </h4>
                  <ul className="space-y-1">
                    {phase.topics?.map((topic, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3" /> Resources
                  </h4>
                  <ul className="space-y-1">
                    {phase.resources?.map((res, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Projects */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Code className="h-3 w-3" /> Projects
                  </h4>
                  <ul className="space-y-1">
                    {phase.projects?.map((proj, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        {proj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Milestone */}
              <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 flex items-start gap-2">
                <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{phase.milestone}</p>
              </div>
            </div>
          ))}

          {/* Job Ready Skills */}
          <div className="border rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Job Ready Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {roadmap.jobReadySkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}