import { Piece } from '@app/entities/piece';

export class PieceViewModel {
  static toHTTP(piece: Piece) {
    return {
      finish_line_position: piece.finish_line_position,
      house_position: piece.house_position,
      is_finish_line: piece.is_finish_line,
      is_started: piece.is_started,
      student_play_game_id: piece.student_play_game_id,
      id: piece.id,
    };
  }
}
