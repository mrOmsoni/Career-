"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/onboardingSchema";
import { updateUser } from "@/actions/user";
import { useState } from "react";

export default function OnboardingForm({ industries }) {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUser(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-card border rounded-2xl p-8 space-y-6 shadow-lg">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to SENS.AI! 🎯</h1>
        <p className="text-muted-foreground">
          Let's set up your profile to personalize your experience
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Industry */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Industry</label>
          <select
            className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            onChange={(e) => {
              const ind = industries.find((i) => i.id === e.target.value);
              setSelectedIndustry(ind);
              setValue("industry", e.target.value);
              setValue("subIndustry", "");
            }}
          >
            <option value="">Select Industry</option>
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-red-500 text-xs">{errors.industry.message}</p>
          )}
        </div>

        {/* Sub Industry */}
        {selectedIndustry && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Specialization</label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
              {...register("subIndustry")}
            >
              <option value="">Select Specialization</option>
              {selectedIndustry.subIndustries.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subIndustry && (
              <p className="text-red-500 text-xs">{errors.subIndustry.message}</p>
            )}
          </div>
        )}

        {/* Experience */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Years of Experience</label>
          <input
            type="number"
            min="0"
            max="50"
            placeholder="e.g. 2"
            className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            {...register("experience")}
          />
          {errors.experience && (
            <p className="text-red-500 text-xs">{errors.experience.message}</p>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Skills</label>
          <input
            type="text"
            placeholder="e.g. React, Node.js, Python"
            className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            {...register("skills")}
          />
          <p className="text-xs text-muted-foreground">Comma separated skills</p>
          {errors.skills && (
            <p className="text-red-500 text-xs">{errors.skills.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Bio (Optional)</label>
          <textarea
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full border rounded-lg px-3 py-2 bg-background text-sm resize-none"
            {...register("bio")}
          />
          {errors.bio && (
            <p className="text-red-500 text-xs">{errors.bio.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Complete Setup →"}
        </button>
      </form>
    </div>
  );
}