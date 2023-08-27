import { StudentsPlayGames } from '@app/entities/studentsPlayGames';

export class StudentPlayGameViewModel {
  static toHTTP(player: StudentsPlayGames) {
    return {
      id: player.id,
      start_house: player.start_house,
      finish_house: player.finish_house,
      game_id: player.game_id,
      game_position: player.game_position,
      player_user_id: player.player_user_id,
    };
  }
}
