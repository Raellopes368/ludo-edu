import { Piece } from '@app/entities/piece';
import { PieceRepository } from '@app/repositories/PieceRepository';
import { Injectable } from '@nestjs/common';

interface CreateAPieceRequest {
  house_position: number;
  finish_line_position: number;
  student_play_game_id: string;
}

@Injectable()
export class CreateAPiece {
  constructor(private pieceRepository: PieceRepository) {}

  async execute({
    finish_line_position,
    house_position,
    student_play_game_id,
  }: CreateAPieceRequest) {
    const piece = new Piece({
      finish_line_position,
      house_position,
      student_play_game_id,
      is_finish_line: false,
      is_started: false,
    });

    await this.pieceRepository.create(piece);

    return {
      piece,
    };
  }
}
