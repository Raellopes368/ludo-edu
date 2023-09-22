// socket.gateway.ts
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const userId = (client.handshake.query?.userId as string) || '';
    await this.cacheManager.set(userId, client.id);
    const gameRoom = await this.cacheManager.get<string>(`game-${userId}`);
    if (gameRoom) {
      client.join(gameRoom);
    }

    this.clients.set(client.id, client);
  }

  handleDisconect(client: Socket) {
    this.clients.delete(client.id);
  }

  getClientById(socketId: string) {
    return this.clients.get(socketId);
  }
}
