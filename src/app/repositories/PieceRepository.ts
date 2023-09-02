import { Piece } from '@app/entities/piece';

export abstract class PieceRepository {
  abstract create(): Promise<void>;
  abstract update(): Promise<void>;
  abstract listByGame(game_id: string): Promise<Piece[]>;
  abstract findById(piece_id: string): Promise<Piece | null>;
}
