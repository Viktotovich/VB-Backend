/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_token_key";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "token",
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionId_key" ON "Session"("sessionId");
