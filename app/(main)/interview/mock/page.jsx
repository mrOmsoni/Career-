"use client";
import { useState } from "react";
import { generateInterviewQuestions, saveAssessment } from "@/actions/interview";
import { Brain, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MockInterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState("setup"); // setup → loading → quiz → result
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  // Step 1 — Generate Questions
  const handleStart = async () => {
    if (!jobTitle.trim()) return;
    setStep("loading");
    try {
      const qs = await generateInterviewQuestions({ jobTitle });
      setQuestions(qs);
      setStep("quiz");
    } catch (error) {
      console.error(error);
      setStep("setup");
      alert("Error generating questions. Try again!");
    }
  };

  // Step 2 — Submit Answer
  const handleAnswer = () => {
    if (!currentAnswer.trim()) return;
    const updated = [...userAnswers, {
      question: questions[currentQ].question,
      answer: questions[currentQ].answer,
      userAnswer: currentAnswer,
      isCorrect: currentAnswer.toLowerCase().includes(
        questions[currentQ].answer.toLowerCase().slice(0, 20)
      ),
    }];
    setUserAnswers(updated);
    setCurrentAnswer("");

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate score
      const score = Math.round(
        (updated.filter((a) => a.isCorrect).length / updated.length) * 100
      );
      setResult({ score, answers: updated });
      setStep("result");
    }
  };

  // Step 3 — Save Assessment
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAssessment({
        jobTitle,
        score: result.score,
        questions: result.answers,
        improvementTip: result.score >= 70
          ? "Great job! Keep practicing advanced topics."
          : "Focus on fundamentals and practice more.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // ===== SETUP SCREEN =====
  if (step === "setup") {
    return (
      <div className="container mx-auto py-12 px-4 max-w-lg">
        <div className="border rounded-2xl p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Setup Interview</h1>
            <p className="text-muted-foreground text-sm">
              Enter the job title you want to practice for
            </p>
          </div>
          <div className="space-y-3 text-left">
            <label className="text-sm font-medium">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer, Data Scientist"
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
          </div>
          <button
            onClick={handleStart}
            disabled={!jobTitle.trim()}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Generate Questions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ===== LOADING SCREEN =====
  if (step === "loading") {
    return (
      <div className="container mx-auto py-12 px-4 max-w-lg">
        <div className="border rounded-2xl p-12 text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold">Generating Questions...</h2>
          <p className="text-muted-foreground text-sm">
            AI is preparing your personalized interview questions
          </p>
        </div>
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  if (step === "quiz") {
    const progress = ((currentQ) / questions.length) * 100;
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="border rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
              {currentQ + 1}
            </span>
            <h2 className="text-lg font-medium leading-relaxed">
              {questions[currentQ]?.question}
            </h2>
          </div>

          <textarea
            rows={5}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full border rounded-xl px-4 py-3 bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            onClick={handleAnswer}
            disabled={!currentAnswer.trim()}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {currentQ + 1 === questions.length ? "Submit Interview" : "Next Question"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ===== RESULT SCREEN =====
  if (step === "result") {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
        {/* Score Card */}
        <div className="border rounded-2xl p-8 text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${
            result.score >= 70
              ? "bg-green-100 text-green-700"
              : result.score >= 40
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}>
            {result.score}%
          </div>
          <h2 className="text-2xl font-bold">
            {result.score >= 70 ? "Great Job! 🎉" : result.score >= 40 ? "Good Effort! 💪" : "Keep Practicing! 📚"}
          </h2>
          <p className="text-muted-foreground">
            You answered {result.answers.filter(a => a.isCorrect).length} out of {result.answers.length} correctly
          </p>
        </div>

        {/* Answers Review */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Review Answers</h3>
          {result.answers.map((a, i) => (
            <div key={i} className="border rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-2">
                {a.isCorrect
                  ? <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  : <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                }
                <p className="font-medium text-sm">{a.question}</p>
              </div>
              <div className="space-y-2 pl-7">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Your Answer:</p>
                  <p className="text-sm">{a.userAnswer}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">Ideal Answer:</p>
                  <p className="text-sm">{a.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setStep("setup");
              setQuestions([]);
              setUserAnswers([]);
              setCurrentQ(0);
              setResult(null);
              setJobTitle("");
            }}
            className="flex-1 border py-3 rounded-xl font-medium hover:bg-secondary transition"
          >
            Try Again
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save & Go to Dashboard"}
          </button>
        </div>
      </div>
    );
  }
}