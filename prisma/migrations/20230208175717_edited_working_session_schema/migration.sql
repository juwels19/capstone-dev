/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `Session` table. All the data in the column will be lost.
  - You are about to alter the column `duration` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `duration` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productivityRating` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "endDateTime",
ALTER COLUMN "startDateTime" SET DATA TYPE TEXT,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE INTEGER,
ALTER COLUMN "productivityRating" SET NOT NULL;
