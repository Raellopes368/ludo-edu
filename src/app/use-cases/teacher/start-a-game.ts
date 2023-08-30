import { GameRepository } from '@app/repositories/GameRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanStartAGame } from './check-user-can-start-a-game';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';

interface StartAGameRequest {
  user_id: string;
  game_id: string;
}

@Injectable()
export class StartAGame {
  constructor(
    private gameRepository: GameRepository,
    private checkUserCanStartAGame: CheckUserCanStartAGame,
    private studentPlayGameRepository: StudentPlayGameRepository,
  ) {}

  async execute({ game_id, user_id }: StartAGameRequest) {
    const [game, player] = await Promise.all([
      this.gameRepository.findById(game_id),
      this.studentPlayGameRepository.findFirstByGame(game_id),
    ]);

    const { error } = await this.checkUserCanStartAGame.execute({
      game,
      user_id,
      player,
    });

    if (error) throw new HttpException(error, HttpStatus.FORBIDDEN);

    game.start(player.id);

    await this.gameRepository.update(game);

    return {
      game,
    };
  }
}
