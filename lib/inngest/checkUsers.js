// lib/ingest/checkUsers.js
import { auth } from "@clerk/nextjs/server";

export async function checkClerkUserId() {
  const { userId } = auth();
  console.log(" Clerk userId:", userId);

  if (!userId) {
    throw new Error(" Clerk userId not found");
  }

  return userId;
}