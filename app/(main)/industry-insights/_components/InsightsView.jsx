"use client";
import { useState } from "react";
import { generateIndustryInsights } from "@/actions/industryInsights";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Brain, Target, Loader2,
  RefreshCw, Briefcase, Star, ArrowUp
} from "lucide-react";

export default function InsightsView({ insights: initialInsights }) {
  const [insights, setInsights] = useState(initialInsights);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateIndustryInsights();
      setInsights(result);
    } catch (error) {
      console.error(error);
      alert("Error generating insights. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const salaryData = insights?.salaryRanges?.map((s) => ({
    role: s.role,
    min: Math.round(s.min / 100000),
    median: Math.round(s.median / 100000),
  })) || [];

  const getOutlookColor = (outlook) => {
    if (outlook === "POSITIVE") return "text-green-500 bg-green-50 dark:bg-green-950";
    if (outlook === "NEGATIVE") return "text-red-500 bg-red-50 dark:bg-red-950";
    return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950";
  };

  const getDemandColor = (demand) => {
    if (demand === "HIGH") return "text-green-500 bg-green-50 dark:bg-green-950";
    if (demand === "LOW") return "text-red-500 bg-red-50 dark:bg-red-950";
    return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950";
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Industry Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered market analysis for your industry
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Analyzing..." : insights ? "Refresh Insights" : "Generate Insights"}
        </button>
      </div>

      {!insights ? (
        /* Empty State */
        <div className="border rounded-2xl p-16 text-center space-y-4">
          <TrendingUp className="h-16 w-16 text-muted-foreground opacity-30 mx-auto" />
          <h2 className="text-xl font-semibold">No Insights Yet</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Click "Generate Insights" to get AI-powered market analysis for your industry
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate Now"}
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Market Outlook</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getOutlookColor(insights.marketOutlook)}`}>
                {insights.marketOutlook}
              </span>
            </div>
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Demand Level</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDemandColor(insights.demandLevel)}`}>
                {insights.demandLevel}
              </span>
            </div>
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Growth Rate</p>
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-500">{insights.growthRate}%</span>
              </div>
            </div>
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="text-lg font-bold capitalize">{insights.industry}</p>
            </div>
          </div>

          {/* Salary Chart */}
          <div className="border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Salary Ranges (in Lakhs INR)
            </h2>
            {salaryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salaryData} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="role"
                    tick={{ fontSize: 11 }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} unit="L" />
                  <Tooltip formatter={(val) => `${val}L`} />
                  <Bar dataKey="min" fill="#93c5fd" name="Min Salary" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="median" fill="#2563eb" name="Median Salary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No salary data available</p>
            )}
          </div>

          {/* 3 Column Grid */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Top Skills */}
            <div className="border rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Top Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {insights.topSkills?.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Trends */}
            <div className="border rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Key Trends
              </h2>
              <ul className="space-y-2">
                {insights.keyTrends?.map((trend, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{trend}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Skills */}
            <div className="border rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                Learn Next
              </h2>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills?.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Skills recommended to learn for career growth
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(insights.lastUpdated).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </p>
        </>
      )}
    </div>
  );
}