/*
  Warnings:

  - You are about to drop the column `duration_min` on the `focus_sessions` table. All the data in the column will be lost.
  - Added the required column `duration_sec` to the `focus_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "focus_sessions" RENAME COLUMN "duration_min" TO "duration_sec";

