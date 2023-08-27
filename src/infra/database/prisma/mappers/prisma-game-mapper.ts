import { Game } from '@app/entities/game';
import {
  Games,
  GamesHasQuestions,
  Questions,
  StudentsPlayGames,
} from '@prisma/client';
import { PrismaQuestionMapper } from './prisma-question-mapper';
import { PrismaStudentPlayGameMapper } from './prisma-student-play-game-mapper';

interface GamesDomainData extends Games {
  gamesHasQuestions: (GamesHasQuestions & {
    question?: Questions;
  })[];
  players?: StudentsPlayGames[];
}

export class PrismaGameMapper {
  static toPrisma(game: Game): Games {
    return {
      created_at: game.created_at,
      current_player_id: game.current_player_id,
      game_id: game.id,
      game_level: game.game_level,
      group_id: game.group_id,
      is_started: game.is_started,
      teacher_user_id: game.teacher_user_id,
      winner_user_id: game.winner_user_id,
    };
  }
  static toDomain(game: GamesDomainData) {
    const gameDomain = new Game({
      game_level: game.game_level,
      group_id: game.group_id,
      teacher_user_id: game.teacher_user_id,
      created_at: game.created_at,
      current_player_id: game.current_player_id,
      is_started: game.is_started,
      winner_user_id: game.winner_user_id,
    });

    if (game.gamesHasQuestions)
      gameDomain.questions = game.gamesHasQuestions.map((item) =>
        PrismaQuestionMapper.toDomain(item.question),
      );

    if (game.players)
      gameDomain.players = game.players.map((player) =>
        PrismaStudentPlayGameMapper.toDomain(player),
      );
    return gameDomain;
  }
}
