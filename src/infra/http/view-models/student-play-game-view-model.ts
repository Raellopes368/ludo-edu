import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import { PieceViewModel } from './piece-view-model';

export class StudentPlayGameViewModel {
  static toHTTP(player: StudentsPlayGames) {
    const playerData: any = {
      id: player.id,
      start_house: player.start_house,
      finish_house: player.finish_house,
      game_id: player.game_id,
      game_position: player.game_position,
      player_user_id: player.player_user_id,
      points: player.points,
    };

    if (player.piece) playerData.piece = PieceViewModel.toHTTP(player.piece);

    return playerData;
  }
}
