/*
  Warnings:

  - A unique constraint covering the columns `[student_play_game_id,game_id]` on the table `students_play_games` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "students_play_games_student_play_game_id_game_id_key" ON "students_play_games"("student_play_game_id", "game_id");
