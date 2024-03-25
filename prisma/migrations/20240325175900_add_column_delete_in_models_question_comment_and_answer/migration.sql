-- AlterTable
ALTER TABLE "answers" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;
