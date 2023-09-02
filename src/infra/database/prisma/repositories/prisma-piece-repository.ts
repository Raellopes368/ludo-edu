import { Piece } from '@app/entities/piece';
import { PieceRepository } from '@app/repositories/PieceRepository';
import { Injectable } from '@nestjs/common';
import { PrismaPieceMapper } from '../mappers/prisma-piece-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPieceRepository implements PieceRepository {
  constructor(private prisma: PrismaService) {}
  async create(piece: Piece): Promise<void> {
    const raw = PrismaPieceMapper.toPrisma(piece);
    await this.prisma.pieces.create({
      data: raw,
    });
  }
  async update(piece: Piece): Promise<void> {
    const raw = PrismaPieceMapper.toPrisma(piece);
    await this.prisma.pieces.update({
      data: raw,
      where: {
        piece_id: piece.id,
      },
    });
  }
  async listByGame(game_id: string): Promise<Piece[]> {
    const pieces = await this.prisma.pieces.findMany({
      where: {
        player_owner: {
          game_id,
        },
      },
    });

    return pieces.map((piece) => PrismaPieceMapper.toDomain(piece));
  }
  async findById(piece_id: string): Promise<Piece> {
    const piece = await this.prisma.pieces.findFirst({
      where: {
        piece_id,
      },
    });

    if (!piece) return null;

    return PrismaPieceMapper.toDomain(piece);
  }
}
