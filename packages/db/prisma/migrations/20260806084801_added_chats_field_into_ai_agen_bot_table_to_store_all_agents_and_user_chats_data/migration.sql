/*
  Warnings:

  - You are about to drop the column `chats` on the `AI_Agent_Bot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AI_Agent_Bot" DROP COLUMN "chats";

-- CreateTable
CREATE TABLE "UserContextData" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "username" TEXT,
    "tool_name" TEXT,
    "aiAgentBotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserContextData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserContextData_aiAgentBotId_key" ON "UserContextData"("aiAgentBotId");

-- AddForeignKey
ALTER TABLE "UserContextData" ADD CONSTRAINT "UserContextData_aiAgentBotId_fkey" FOREIGN KEY ("aiAgentBotId") REFERENCES "AI_Agent_Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
