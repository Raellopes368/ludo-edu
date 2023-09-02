import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import {
  Pieces,
  StudentsPlayGames as StudentsPlayGamesRaw,
} from '@prisma/client';
import { PrismaPieceMapper } from './prisma-piece-mapper';

export class PrismaStudentPlayGameMapper {
  static toPrisma(player: StudentsPlayGames): StudentsPlayGamesRaw {
    return {
      finish_house: player.finish_house,
      game_id: player.game_id,
      game_position: player.game_position,
      player_user_id: player.player_user_id,
      start_house: player.start_house,
      student_play_game_id: player.id,
    };
  }
  static toDomain(player: StudentsPlayGamesRaw & { piece?: Pieces }) {
    const playerDomain = new StudentsPlayGames(
      {
        finish_house: player.finish_house,
        game_id: player.game_id,
        game_position: player.game_position,
        player_user_id: player.player_user_id,
        start_house: player.start_house,
      },
      player.student_play_game_id,
    );

    if (player.piece)
      playerDomain.piece = PrismaPieceMapper.toDomain(player.piece);

    return playerDomain;
  }
}
