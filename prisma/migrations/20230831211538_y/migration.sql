/*
  Warnings:

  - You are about to drop the column `group_id` on the `questions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_group_id_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "group_id";

-- CreateTable
CREATE TABLE "groups_has_questions" (
    "groups_has_questions" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "groups_has_questions_pkey" PRIMARY KEY ("groups_has_questions")
);

-- AddForeignKey
ALTER TABLE "groups_has_questions" ADD CONSTRAINT "groups_has_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_has_questions" ADD CONSTRAINT "groups_has_questions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
