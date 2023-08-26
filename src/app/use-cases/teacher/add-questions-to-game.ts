import { GameRepository } from '@app/repositories/GameRepository';
import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanAddQuestionToGame } from './check-user-can-add-question-to-game';

interface AddQuestionsToGameRequest {
  game_id: string;
  questions_id: string[];
  user_id: string;
}

@Injectable()
export class AddQuestionsToGame {
  constructor(
    private gameRepository: GameRepository,
    private questionRepository: QuestionsRepository,
    private checkUserCanAddQuestionToGame: CheckUserCanAddQuestionToGame,
  ) {}

  async execute({ game_id, questions_id, user_id }: AddQuestionsToGameRequest) {
    const game = await this.gameRepository.findById(game_id);
    const { error } = await this.checkUserCanAddQuestionToGame.execute({
      game_id,
      user_id,
    });

    if (error) throw new HttpException(error, HttpStatus.FORBIDDEN);

    const questions = await Promise.all(
      questions_id.map((question_id) =>
        this.questionRepository.findById(question_id),
      ),
    );

    const questionsCanAdd = questions.filter(
      (question) => question.level === game.game_level,
    );

    if (!questionsCanAdd.length)
      throw new HttpException(
        'Envie somente questões do mesmo nível do jogo',
        HttpStatus.BAD_REQUEST,
      );

    await this.gameRepository.addQuestionsToGame(
      game_id,
      questionsCanAdd.map((question) => question.id),
    );

    game.questions = [...game.questions, ...questionsCanAdd];

    return {
      game,
    };
  }
}
