import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/OnboardingForm";
import { industries } from "@/data/industries";

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) redirect("/dashboard");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <OnboardingForm industries={industries} />
    </div>
  );
}