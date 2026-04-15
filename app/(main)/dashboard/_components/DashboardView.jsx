"use client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from "recharts";
import { 
  BriefcaseIcon, TrendingUp, Brain, 
  FileText, Target, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardView({ user }) {
  const insight = user.IndustryInsights;
  const assessments = user.assessments;

  const avgScore = assessments.length
    ? (assessments.reduce((s, a) => s + a.quizScore, 0) / assessments.length).toFixed(1)
    : 0;

  const chartData = assessments.map((a) => ({
    date: format(new Date(a.createdAt), "MMM d"),
    score: a.quizScore,
  })).reverse();

  const salaryData = insight?.salaryRanges?.map((s) => ({
    role: s.role,
    min: s.min,
    median: s.median,
  })) || [];

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">

      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.industry} • {user.subIndustry}
          </p>
        </div>
        <Link
          href="/interview"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Start Mock Interview <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Brain className="h-5 w-5 text-purple-500" />}
          label="Avg Quiz Score"
          value={`${avgScore}%`}
          bg="bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-blue-500" />}
          label="Quizzes Taken"
          value={assessments.length}
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="Market Outlook"
          value={insight?.marketOutlook || "N/A"}
          bg="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          icon={<BriefcaseIcon className="h-5 w-5 text-orange-500" />}
          label="Demand Level"
          value={insight?.demandLevel || "N/A"}
          bg="bg-orange-50 dark:bg-orange-950"
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">Quiz Performance</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              text="No quizzes taken yet"
              link="/interview"
              linkText="Take a quiz"
            />
          )}
        </div>

        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">Salary Ranges</h2>
          {salaryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="min" fill="#93c5fd" name="Min" />
                <Bar dataKey="median" fill="#3b82f6" name="Median" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No salary data available" />
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">Top Industry Skills</h2>
          <div className="flex flex-wrap gap-2">
            {insight?.topSkills?.length > 0 ? (
              insight.topSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No skills data yet</p>
            )}
          </div>
        </div>

        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <QuickAction
              icon={<Brain className="h-4 w-4" />}
              title="Practice Interview"
              desc="AI mock interview questions"
              link="/interview"
            />
            <QuickAction
              icon={<FileText className="h-4 w-4" />}
              title="Build Resume"
              desc="AI-powered resume builder"
              link="/resume"
            />
            <QuickAction
              icon={<FileText className="h-4 w-4" />}
              title="Cover Letter"
              desc="Generate cover letter with AI"
              link="/ai-cover-later"
            />
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      {assessments.length > 0 && (
        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">Recent Assessments</h2>
          <div className="space-y-2">
            {assessments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{a.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(a.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  a.quizScore >= 70
                    ? "bg-green-100 text-green-700"
                    : a.quizScore >= 40
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {a.quizScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`${bg} rounded-xl p-4 space-y-2`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickAction({ icon, title, desc, link }) {
  return (
    <Link
      href={link}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition group"
    >
      <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
    </Link>
  );
}

function EmptyState({ text, link, linkText }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
      <p className="text-muted-foreground text-sm">{text}</p>
      {link && (
        <Link href={link} className="text-primary text-sm hover:underline">
          {linkText} →
        </Link>
      )}
    </div>
  );
}