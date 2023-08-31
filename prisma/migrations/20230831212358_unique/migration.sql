/*
  Warnings:

  - A unique constraint covering the columns `[question_id,group_id]` on the table `groups_has_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_has_questions_question_id_group_id_key" ON "groups_has_questions"("question_id", "group_id");
