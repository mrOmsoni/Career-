"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      IndustryInsights: true,
    },
  });

  if (!user) throw new Error("User not found");
  return user;
}