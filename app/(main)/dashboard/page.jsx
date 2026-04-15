import { getUserDashboardData } from "@/actions/dashboard";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import DashboardView from "./_components/DashboardView";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const user = await getUserDashboardData();
  return <DashboardView user={user} />;
}