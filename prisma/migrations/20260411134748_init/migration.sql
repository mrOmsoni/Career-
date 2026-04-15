/*
  Warnings:

  - You are about to drop the column `demandlevel` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `recommenddedSkills` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `createedAt` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the `CoverLatter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `demandLevel` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CoverLatter" DROP CONSTRAINT "CoverLatter_userId_fkey";

-- AlterTable
ALTER TABLE "public"."IndustryInsight" DROP COLUMN "demandlevel",
DROP COLUMN "recommenddedSkills",
ADD COLUMN     "demandLevel" "public"."DemandLevel" NOT NULL,
ADD COLUMN     "recommendedSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "topSkills" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "keyTrends" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."Resume" DROP COLUMN "createedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "public"."CoverLatter";

-- CreateTable
CREATE TABLE "public"."CoverLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "jobDescription" TEXT,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoverLetter_userId_key" ON "public"."CoverLetter"("userId");

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "public"."CoverLetter"("userId");

-- AddForeignKey
ALTER TABLE "public"."CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
