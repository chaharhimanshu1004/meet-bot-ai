/*
  Warnings:

  - The `status` column on the `Meeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transcript` column on the `Meeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[externalId]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PENDING', 'JOINING', 'IN_PROGRESS', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "summary" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "MeetingStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "transcript",
ADD COLUMN     "transcript" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_externalId_key" ON "Meeting"("externalId");
