import { Piece } from '@app/entities/piece';
import { PieceRepository } from '@app/repositories/PieceRepository';
import { Injectable } from '@nestjs/common';

interface CreateAPieceRequest {
  student_play_game_id: string;
}

@Injectable()
export class CreateAPiece {
  constructor(private pieceRepository: PieceRepository) {}

  async execute({ student_play_game_id }: CreateAPieceRequest) {
    const piece = new Piece({
      finish_line_position: 0,
      house_position: 0,
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
