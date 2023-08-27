import { Game } from '@app/entities/game';
import { GameRepository } from '@app/repositories/GameRepository';
import { UserRepository } from '@app/repositories/UserRepository';
import { Injectable } from '@nestjs/common';
import { UserType } from 'src/interfaces';

interface CheckUserCanJoinTheGameRequest {
  user_id: string;
  game_id: string;
}

interface CheckUserCanJoinTheGameResponse {
  error: string | null;
  game: Game;
}

@Injectable()
export class CheckUserCanJoinTheGame {
  constructor(
    private gameRepository: GameRepository,
    private userRepository: UserRepository,
  ) {}
  async execute({
    user_id,
    game_id,
  }: CheckUserCanJoinTheGameRequest): Promise<CheckUserCanJoinTheGameResponse> {
    const game = await this.gameRepository.findById(game_id);
    const result: CheckUserCanJoinTheGameResponse = {
      error: null,
      game,
    };

    if (!game) {
      return {
        ...result,
        error: 'Erro ao entrar no jogo',
      };
    }
    if (game.is_started) {
      return {
        ...result,
        error: 'Você não pode entrar no jogo. Ele já foi iniciado',
      };
    }

    if (game.players?.length === 4) {
      return {
        ...result,
        error: 'Esse jogo já tem 4 jogadores',
      };
    }

    if (game.players?.find((player) => player.player_user_id === user_id))
      return {
        ...result,
        error: 'Você já está nesse jogo',
      };

    const user = await this.userRepository.findByUserId(user_id);

    if (user.type !== UserType.STUDENT) {
      return {
        ...result,
        error: 'Você é professor',
      };
    }

    if (user.group_id !== game.group_id)
      result.error = 'Você não pode entrar em jogos fora do seu grupo';

    return result;
  }
}
