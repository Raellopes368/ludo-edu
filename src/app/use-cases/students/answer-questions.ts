import { GameRepository } from '@app/repositories/GameRepository';
import { UserCheckOptionsRepository } from '@app/repositories/UserCheckOptionsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanAnswerQuestions } from './check-user-can-answer-question';
import { SetNextCurrentPlayer } from './set-next-current-player';
import { QuestionOptionRepository } from '@app/repositories/QuestionOptionRepository';
import { UserCheckOptions } from '@app/entities/userCheckOptions';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { MovePiece } from '../system/move-piece';
import { SendWebsocketEvent } from '../system/send-websocket-event';
import { GameViewModel } from '@infra/http/view-models/game-view-model';

interface AnswerQuestionsRequest {
  user_id: string;
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
    private studentPlayGameRepository: StudentPlayGameRepository,
    private checkUserCanAnswerQuestions: CheckUserCanAnswerQuestions,
    private setNextCurrentPlayer: SetNextCurrentPlayer,
    private movePiece: MovePiece,
    private sendWebsocketEvent: SendWebsocketEvent,
  ) {}

  async execute({
    game_id,
    user_id,
    question_option_id,
  }: AnswerQuestionsRequest) {
    const [game, player] = await Promise.all([
      this.gameRepository.findById(game_id),
      this.studentPlayGameRepository.findByUserIdAndGame(user_id, game_id),
    ]);

    const error = await this.checkUserCanAnswerQuestions.execute({
      game,
      player_id: player.id,
    });

    if (error) throw new HttpException(error, HttpStatus.BAD_REQUEST);

    const userCheckOptions = new UserCheckOptions({
      question_option_id,
      student_user_id: player.id,
    });

    await this.userCheckOptionsRepository.create(userCheckOptions);

    const questionOption = await this.questionOptionsRepository.findById(
      question_option_id,
    );

    await this.movePiece.execute({
      game,
      player,
      questionOption,
    });

    await this.setNextCurrentPlayer.execute({
      game,
      questionOption,
    });

    const updatedGame = await this.gameRepository.getById(game_id);

    await this.sendWebsocketEvent.execute({
      data: {
        game: GameViewModel.toHTTP(updatedGame),
      },
      event: 'game-status',
      room: game.id,
    });

    return {
      points: questionOption.points,
    };
  }
}
