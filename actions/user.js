"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateUser(data) {
  const { userId } = await auth();
  console.log("Clerk userId:", userId);
  
  if (!userId) {
    throw new Error("Unauthorized: Clerk userId not found");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, industry: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            salaryRanges: [],
            growthRate: 0,
            demandLevel: "MEDIUM",      // ✅ Fixed
            topSkills: [],
            marketOutlook: "NEUTRAL",   // ✅ Fixed
            keyTrends: [],
            recommendedSkills: [],
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updateUser: industryInsight };
    }, { timeout: 10000 });

    return result.updateUser;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    // ✅ User nahi hai toh create karo
    if (!user) {
      const { sessionClaims } = await auth();
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: sessionClaims?.email || "",
          name: sessionClaims?.fullName || "",
          imageUrl: sessionClaims?.image || "",
        },
      });
    }

    return { isOnboarded: !!user?.industry };
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to check onboarding status");
  }
}