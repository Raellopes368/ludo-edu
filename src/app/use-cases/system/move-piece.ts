import { Game } from '@app/entities/game';
import { QuestionOptions } from '@app/entities/question/QuestionOption';
import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import { GameRepository } from '@app/repositories/GameRepository';
import { PieceRepository } from '@app/repositories/PieceRepository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SendWebsocketEvent } from './send-websocket-event';
import { GameLimit } from 'src/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PieceViewModel } from '@infra/http/view-models/piece-view-model';
import { GameViewModel } from '@infra/http/view-models/game-view-model';
import { StudentPlayGameViewModel } from '@infra/http/view-models/student-play-game-view-model';
import { UserCheckOptionsRepository } from '@app/repositories/UserCheckOptionsRepository';

interface MovePieceRequest {
  game: Game;
  player: StudentsPlayGames;
  questionOption: QuestionOptions;
}

export const HOUSES_WITH_STARS = [4, 9, 14, 19, 1, 6, 11, 16];
export const MAX_POINT = 6;

@Injectable()
export class MovePiece {
  constructor(
    private pieceRepository: PieceRepository,
    private gameRepository: GameRepository,
    private userCheckOptionsRepository: UserCheckOptionsRepository,
    private sendWebsocketEvent: SendWebsocketEvent,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async execute({ game, player, questionOption }: MovePieceRequest) {
    const piece = await this.pieceRepository.findByGameAndPlayer(
      game.id,
      player.id,
    );

    if (!piece)
      throw new HttpException('Erro ao mover peça', HttpStatus.BAD_REQUEST);

    const currentPosition = piece.house_position || 0;
    const possibleNextPosition = currentPosition + questionOption.points;

    const nextPosition =
      possibleNextPosition > GameLimit.MAX_HOUSES
        ? possibleNextPosition - GameLimit.MAX_HOUSES
        : possibleNextPosition;

    // Se estiver na reta final
    if (piece.is_finish_line) {
      // verifica se acertou o valor 6
      if (questionOption.points === MAX_POINT) {
        piece.finish_line_position = player.game_position;
        piece.house_position = 0;
        game.endGame(player.id);

        await Promise.all([
          this.pieceRepository.update(piece),
          this.gameRepository.update(game),
        ]);
        this.sendWebsocketEvent.execute({
          room: game.id,
          event: 'end-game',
          data: {
            piece: PieceViewModel.toHTTP(piece),
            game: GameViewModel.toHTTP(game),
            winner: StudentPlayGameViewModel.toHTTP(player),
          },
        });
      }

      return;
    }

    // Verifica se a peça já está em jogo
    if (!piece.is_started) {
      // verifica se acertou o valor 6
      if (questionOption.points === MAX_POINT) {
        piece.is_started = true;
        piece.house_position = player.start_house;
        await this.pieceRepository.update(piece);
        this.sendWebsocketEvent.execute({
          room: game.id,
          event: 'move-to-first-position',
          data: {
            piece: PieceViewModel.toHTTP(piece),
            player: StudentPlayGameViewModel.toHTTP(player),
          },
        });
      }
      return;
    }

    // verifica se os pontos passaram do casa final do jogador
    const passedMaxHouses = await this.cacheManager.get(piece.id);

    if (
      (Boolean(passedMaxHouses) ||
        possibleNextPosition > GameLimit.MAX_HOUSES) &&
      nextPosition >= player.start_house
    ) {
      piece.finish_line_position = player.game_position;
      piece.is_finish_line = true;
      piece.house_position = 0;
      await this.pieceRepository.update(piece);
      this.sendWebsocketEvent.execute({
        room: game.id,
        event: 'move-to-finish-line',
        data: {
          piece: PieceViewModel.toHTTP(piece),
          player: StudentPlayGameViewModel.toHTTP(player),
        },
      });
      return;
    }

    if (possibleNextPosition > GameLimit.MAX_HOUSES)
      await this.cacheManager.set(piece.id, 'true');

    piece.house_position = nextPosition;

    await this.pieceRepository.update(piece);

    this.sendWebsocketEvent.execute({
      room: game.id,
      event: 'move-piece',
      data: {
        piece: PieceViewModel.toHTTP(piece),
      },
    });

    // verifica  se a próxima posição de usuário não tem estrela
    if (!HOUSES_WITH_STARS.includes(nextPosition)) {
      const pieceInSameHouse = await this.pieceRepository.findByGameAndPosition(
        game.id,
        nextPosition,
      );

      // verifica se existe outra peça na posição da peça atual
      if (pieceInSameHouse && pieceInSameHouse.id !== piece.id) {
        pieceInSameHouse.house_position = 0;
        pieceInSameHouse.is_started = false;
        await Promise.all([
          this.cacheManager.del(pieceInSameHouse.id),
          this.pieceRepository.update(pieceInSameHouse),
          this.userCheckOptionsRepository.invalidateByUser(
            pieceInSameHouse.student_play_game_id,
          ),
        ]);

        this.sendWebsocketEvent.execute({
          room: game.id,
          event: 'refresh-piece',
          data: {
            piece: PieceViewModel.toHTTP(pieceInSameHouse),
          },
        });
      }
    }
  }
}
