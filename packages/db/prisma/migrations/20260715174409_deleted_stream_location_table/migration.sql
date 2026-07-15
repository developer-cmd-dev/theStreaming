/*
  Warnings:

  - You are about to drop the `stream_location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stream_location" DROP CONSTRAINT "stream_location_streamId_fkey";

-- DropTable
DROP TABLE "stream_location";
