import { Piece } from '@app/entities/piece';
import { Pieces } from '@prisma/client';

export class PrismaPieceMapper {
  static toPrisma(piece: Piece): Pieces {
    return {
      finish_line_position: piece.finish_line_position,
      house_position: piece.house_position,
      is_finish_line: piece.is_finish_line,
      is_started: piece.is_started,
      piece_id: piece.id,
      student_play_game_id: piece.student_play_game_id,
    };
  }
  static toDomain(piece: Pieces) {
    return new Piece(
      {
        finish_line_position: piece.finish_line_position,
        house_position: piece.house_position,
        is_finish_line: piece.is_finish_line,
        is_started: piece.is_started,
        student_play_game_id: piece.student_play_game_id,
      },
      piece.piece_id,
    );
  }
}
