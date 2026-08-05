/*
  Warnings:

  - A unique constraint covering the columns `[agentConnectionId]` on the table `AI_Agent_Bot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agentConnectionId` to the `AI_Agent_Bot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AgentConnection" DROP CONSTRAINT "AgentConnection_id_fkey";

-- AlterTable
ALTER TABLE "AI_Agent_Bot" ADD COLUMN     "agentConnectionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AI_Agent_Bot_agentConnectionId_key" ON "AI_Agent_Bot"("agentConnectionId");

-- AddForeignKey
ALTER TABLE "AI_Agent_Bot" ADD CONSTRAINT "AI_Agent_Bot_agentConnectionId_fkey" FOREIGN KEY ("agentConnectionId") REFERENCES "AgentConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
