/*
  Warnings:

  - A unique constraint covering the columns `[connection_id]` on the table `AgentConnection` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `agentConnectionId` on the `AI_Agent_Bot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AI_Agent_Bot" DROP CONSTRAINT "AI_Agent_Bot_agentConnectionId_fkey";

-- AlterTable
ALTER TABLE "AI_Agent_Bot" DROP COLUMN "agentConnectionId",
ADD COLUMN     "agentConnectionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AI_Agent_Bot_agentConnectionId_key" ON "AI_Agent_Bot"("agentConnectionId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentConnection_connection_id_key" ON "AgentConnection"("connection_id");

-- AddForeignKey
ALTER TABLE "AI_Agent_Bot" ADD CONSTRAINT "AI_Agent_Bot_agentConnectionId_fkey" FOREIGN KEY ("agentConnectionId") REFERENCES "AgentConnection"("connection_id") ON DELETE RESTRICT ON UPDATE CASCADE;
