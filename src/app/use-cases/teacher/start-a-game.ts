import { GameRepository } from '@app/repositories/GameRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanStartAGame } from './check-user-can-start-a-game';

interface StartAGameRequest {
  user_id: string;
  game_id: string;
}

@Injectable()
export class StartAGame {
  constructor(
    private gameRepository: GameRepository,
    private checkUserCanStartAGame: CheckUserCanStartAGame,
  ) {}

  async execute({ game_id, user_id }: StartAGameRequest) {
    const game = await this.gameRepository.findById(game_id);

    const { error } = await this.checkUserCanStartAGame.execute({
      game,
      user_id,
    });

    if (error) throw new HttpException(error, HttpStatus.FORBIDDEN);

    game.start();

    await this.gameRepository.update(game);

    return {
      game,
    };
  }
}
