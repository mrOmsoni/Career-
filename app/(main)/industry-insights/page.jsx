import { getIndustryInsights } from "@/actions/industryInsights";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import InsightsView from "./_components/InsightsView";

export default async function IndustryInsightsPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const insights = await getIndustryInsights();
  return <InsightsView insights={insights} />;
}