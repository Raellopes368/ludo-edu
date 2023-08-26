import { Game } from '@app/entities/game';
import { Games } from '@prisma/client';

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
  static toDomain(game: Games) {
    return new Game({
      game_level: game.game_level,
      group_id: game.group_id,
      teacher_user_id: game.teacher_user_id,
      created_at: game.created_at,
      current_player_id: game.current_player_id,
      is_started: game.is_started,
      winner_user_id: game.winner_user_id,
    });
  }
}
