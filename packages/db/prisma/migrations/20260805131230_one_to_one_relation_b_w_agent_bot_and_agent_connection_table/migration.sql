-- AlterTable
ALTER TABLE "AI_Agent_Bot" ADD COLUMN     "chats" TEXT[];

-- AddForeignKey
ALTER TABLE "AgentConnection" ADD CONSTRAINT "AgentConnection_id_fkey" FOREIGN KEY ("id") REFERENCES "AI_Agent_Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
