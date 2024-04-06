/*
  Warnings:

  - A unique constraint covering the columns `[question_id,answer_id]` on the table `BestAnswer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BestAnswer_question_id_answer_id_key" ON "BestAnswer"("question_id", "answer_id");
