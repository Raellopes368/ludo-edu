/*
  Warnings:

  - The primary key for the `groups_has_questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groups_has_questions` on the `groups_has_questions` table. All the data in the column will be lost.
  - Added the required column `name` to the `games` table without a default value. This is not possible if the table is not empty.
  - The required column `groups_has_questions_id` was added to the `groups_has_questions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "groups_has_questions" DROP CONSTRAINT "groups_has_questions_pkey",
DROP COLUMN "groups_has_questions",
ADD COLUMN     "groups_has_questions_id" TEXT NOT NULL,
ADD CONSTRAINT "groups_has_questions_pkey" PRIMARY KEY ("groups_has_questions_id");
