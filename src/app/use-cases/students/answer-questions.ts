import { GameRepository } from '@app/repositories/GameRepository';
import { UserCheckOptionsRepository } from '@app/repositories/UserCheckOptionsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanAnswerQuestions } from './check-user-can-answer-question';
import { SetNextCurrentPlayer } from './set-next-current-player';
import { QuestionOptionRepository } from '@app/repositories/QuestionOptionRepository';
import { UserCheckOptions } from '@app/entities/userCheckOptions';

interface AnswerQuestionsRequest {
  player_id: string;
  game_id: string;
  question_id: string;
  question_option_id: string;
}

@Injectable()
export class AnswerQuestions {
  constructor(
    private gameRepository: GameRepository,
    private userCheckOptionsRepository: UserCheckOptionsRepository,
    private questionOptionsRepository: QuestionOptionRepository,
    private checkUserCanAnswerQuestions: CheckUserCanAnswerQuestions,
    private setNextCurrentPlayer: SetNextCurrentPlayer,
  ) {}

  async execute({
    game_id,
    player_id,
    question_id,
    question_option_id,
  }: AnswerQuestionsRequest) {
    const game = await this.gameRepository.findById(game_id);
    const error = await this.checkUserCanAnswerQuestions.execute({
      game,
      player_id,
    });

    if (error) throw new HttpException(error, HttpStatus.BAD_REQUEST);

    const alreadyExistsAnswer =
      await this.userCheckOptionsRepository.findByQuestionAndGame(
        question_id,
        game_id,
      );

    if (alreadyExistsAnswer) {
      alreadyExistsAnswer.question_option_id = question_option_id;
      alreadyExistsAnswer.updatedAt = new Date();

      await this.userCheckOptionsRepository.update(alreadyExistsAnswer);
    } else {
      const userCheckOptions = new UserCheckOptions({
        question_option_id,
        student_user_id: player_id,
      });

      await this.userCheckOptionsRepository.create(userCheckOptions);
    }

    const questionOption = await this.questionOptionsRepository.findById(
      question_option_id,
    );

    await this.setNextCurrentPlayer.execute({
      game,
      questionOption,
    });

    return {
      points: questionOption.points,
    };
  }
}
