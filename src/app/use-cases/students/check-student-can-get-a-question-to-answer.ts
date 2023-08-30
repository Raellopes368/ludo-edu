import { GameRepository } from '@app/repositories/GameRepository';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { Injectable } from '@nestjs/common';

interface CheckStudentCanGetAQuestionToAnswerRequest {
  user_id: string;
  game_id: string;
}

@Injectable()
export class CheckStudentCanGetAQuestionToAnswer {
  constructor(
    private gameRepository: GameRepository,
    private studentPlayGameRepository: StudentPlayGameRepository,
  ) {}

  async execute({
    game_id,
    user_id,
  }: CheckStudentCanGetAQuestionToAnswerRequest) {
    const [question, user] = await Promise.all([
      this.gameRepository.findById(game_id),
      this.studentPlayGameRepository.findByUserIdAndGame(user_id, game_id),
    ]);

    if (!question || !user) return 'Erro ao validar jogo!';
    if (!question.is_started) return 'Jogo não iniciado';
    if (!!question.winner_user_id) return 'Jogo finalizado';
    if (question.current_player_id !== user.id) return 'Ainda não é sua vez';

    return null;
  }
}
