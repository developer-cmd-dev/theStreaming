/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AI_Agent_Bot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AI_Agent_Bot" DROP CONSTRAINT "AI_Agent_Bot_telegramUsername_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "AI_Agent_Bot_userId_key" ON "AI_Agent_Bot"("userId");

-- AddForeignKey
ALTER TABLE "AI_Agent_Bot" ADD CONSTRAINT "AI_Agent_Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
