import { Game } from '@app/entities/game';
import { UserViewModel } from './user-view-model';
import { GroupViewModel } from './group-view-model';
import { QuestionViewModel } from './question-view-model';
import { StudentPlayGameViewModel } from './student-play-game-view-model';

export class GameViewModel {
  static toHTTP(game: Game) {
    return {
      createdAt: game.created_at,
      current_player_id: game.current_player_id,
      level: game.game_level,
      group: game.group ? GroupViewModel.toHTTP(game.group) : null,
      teacher: game.teacher ? UserViewModel.toHTTP(game.teacher) : null,
      group_id: game.group_id,
      isStarted: game.is_started,
      teacherId: game.teacher_user_id,
      winnerId: game.winner_user_id,
      id: game.id,
      questions: game.questions?.map((question) =>
        QuestionViewModel.toHTTP(question),
      ),
      players: game.players?.map((player) =>
        StudentPlayGameViewModel.toHTTP(player),
      ),
      amount_questions: game.amount_questions,
      winner: game.winner ? StudentPlayGameViewModel.toHTTP(game.winner) : null,
    };
  }
}
