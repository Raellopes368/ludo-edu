-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "class" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "students_play_games" (
    "student_play_game_id" TEXT NOT NULL,
    "game_position" INTEGER NOT NULL,
    "start_house" INTEGER NOT NULL,
    "finish_house" INTEGER NOT NULL,
    "player_user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "students_play_games_pkey" PRIMARY KEY ("student_play_game_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" TEXT NOT NULL,
    "is_started" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "game_level" INTEGER NOT NULL,
    "teacher_user_id" TEXT NOT NULL,
    "winner_user_id" TEXT,
    "current_player_id" TEXT,

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "pieces" (
    "piece_id" TEXT NOT NULL,
    "house_position" INTEGER NOT NULL,
    "is_started" BOOLEAN NOT NULL DEFAULT false,
    "is_finish_line" BOOLEAN NOT NULL DEFAULT false,
    "finish_line_position" INTEGER NOT NULL DEFAULT 0,
    "student_play_game_id" TEXT NOT NULL,

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("piece_id")
);

-- CreateTable
CREATE TABLE "games_has_questions" (
    "game_has_question_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "games_has_questions_pkey" PRIMARY KEY ("game_has_question_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "question_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "question_options" (
    "question_option_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("question_option_id")
);

-- CreateTable
CREATE TABLE "user_check_options" (
    "user_check_options_id" TEXT NOT NULL,
    "student_user_id" TEXT NOT NULL,
    "question_option_id" TEXT NOT NULL,

    CONSTRAINT "user_check_options_pkey" PRIMARY KEY ("user_check_options_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "students_play_games" ADD CONSTRAINT "students_play_games_player_user_id_fkey" FOREIGN KEY ("player_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students_play_games" ADD CONSTRAINT "students_play_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_teacher_user_id_fkey" FOREIGN KEY ("teacher_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winner_user_id_fkey" FOREIGN KEY ("winner_user_id") REFERENCES "students_play_games"("student_play_game_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "students_play_games"("student_play_game_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_student_play_game_id_fkey" FOREIGN KEY ("student_play_game_id") REFERENCES "students_play_games"("student_play_game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_has_questions" ADD CONSTRAINT "games_has_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_has_questions" ADD CONSTRAINT "games_has_questions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_check_options" ADD CONSTRAINT "user_check_options_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "students_play_games"("student_play_game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_check_options" ADD CONSTRAINT "user_check_options_question_option_id_fkey" FOREIGN KEY ("question_option_id") REFERENCES "question_options"("question_option_id") ON DELETE RESTRICT ON UPDATE CASCADE;
