-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "correctPredictionAnswer" TEXT,
ADD COLUMN     "incorrectPredictionAnswer" TEXT,
ADD COLUMN     "predictionImprovementAnswer" TEXT;
