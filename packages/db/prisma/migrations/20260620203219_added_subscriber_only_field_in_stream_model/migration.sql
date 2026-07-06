/*
  Warnings:

  - Added the required column `subscriberOnly` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "subscriberOnly" BOOLEAN NOT NULL;
