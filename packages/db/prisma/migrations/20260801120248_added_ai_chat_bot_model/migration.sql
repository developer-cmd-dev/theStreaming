/*
  Warnings:

  - Added the required column `username` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AI_Agent_Bot" (
    "id" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AI_Agent_Bot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AI_Agent_Bot_telegramUsername_key" ON "AI_Agent_Bot"("telegramUsername");

-- AddForeignKey
ALTER TABLE "AI_Agent_Bot" ADD CONSTRAINT "AI_Agent_Bot_telegramUsername_fkey" FOREIGN KEY ("telegramUsername") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
