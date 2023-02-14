/*
  Warnings:

  - You are about to alter the column `createdAt` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "createdAt" SET DATA TYPE INTEGER;
