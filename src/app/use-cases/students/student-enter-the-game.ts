import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanJoinTheGame } from './check-user-can-join-the-game';
import { GetPlayerPositions } from './get-player-positions';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import { CreateAPiece } from '../system/create-a-piece';

interface StudentEnterTheGameRequest {
  player_user_id: string;
  game_id: string;
}

interface StudentEnterTheGameResponse {
  player: StudentsPlayGames;
}

@Injectable()
export class StudentEnterTheGame {
  constructor(
    private studentPlayGameRepository: StudentPlayGameRepository,
    private checkUserCanJoinTheGame: CheckUserCanJoinTheGame,
    private getPlayerPositions: GetPlayerPositions,
    private createAPiece: CreateAPiece,
  ) {}
  async execute({
    player_user_id,
    game_id,
  }: StudentEnterTheGameRequest): Promise<StudentEnterTheGameResponse> {
    const { error, game } = await this.checkUserCanJoinTheGame.execute({
      user_id: player_user_id,
      game_id,
    });

    if (error) throw new HttpException(error, HttpStatus.BAD_REQUEST);

    const { housePosition, positionNumber } = this.getPlayerPositions.execute({
      game,
    });

    const player = new StudentsPlayGames({
      game_id,
      game_position: positionNumber,
      player_user_id,
      start_house: housePosition.start,
      finish_house: housePosition.end,
    });

    await this.studentPlayGameRepository.create(player);

    const { piece } = await this.createAPiece.execute({
      student_play_game_id: player.id,
    });

    player.piece = piece;

    return {
      player,
    };
  }
}
