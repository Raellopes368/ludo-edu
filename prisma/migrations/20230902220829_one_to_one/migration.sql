/*
  Warnings:

  - A unique constraint covering the columns `[student_play_game_id]` on the table `pieces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pieces_student_play_game_id_key" ON "pieces"("student_play_game_id");
