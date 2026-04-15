import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Brain, Trophy, Target, 
  ArrowRight, Clock, CheckCircle 
} from "lucide-react";

export default async function InterviewPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">AI Mock Interview 🎤</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Practice with AI-generated questions tailored to your industry and skills
        </p>
      </div>

      {/* Start Card */}
      <div className="max-w-2xl mx-auto border rounded-2xl p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Brain className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Ready to Practice?</h2>
          <p className="text-muted-foreground">
            Get 5 AI-generated interview questions based on your profile
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium">Personalized</p>
            <p className="text-xs text-muted-foreground">Based on your skills</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <Clock className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm font-medium">5 Questions</p>
            <p className="text-xs text-muted-foreground">~10 mins to complete</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-sm font-medium">Instant Score</p>
            <p className="text-xs text-muted-foreground">Get feedback immediately</p>
          </div>
        </div>

        <Link
          href="/interview/mock"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:opacity-90 transition text-lg"
        >
          Start Interview <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Tips */}
      <div className="max-w-2xl mx-auto border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Tips for Success
        </h3>
        <div className="space-y-3">
          {[
            "Read each question carefully before answering",
            "Write your answer in your own words",
            "Be specific with examples from your experience",
            "Review the ideal answer after each question",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}