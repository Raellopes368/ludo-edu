import { Piece } from '@app/entities/piece';

export abstract class PieceRepository {
  abstract create(piece: Piece): Promise<void>;
  abstract update(piece: Piece): Promise<void>;
  abstract findByGameAndPlayer(
    game_id: string,
    player_id: string,
  ): Promise<Piece | null>;
  abstract listByGame(game_id: string): Promise<Piece[]>;
  abstract findById(piece_id: string): Promise<Piece | null>;
  abstract findByGameAndPosition(
    game_id: string,
    position: number,
  ): Promise<Piece | null>;
}
