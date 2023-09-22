import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

interface SendWebsocketEventRequest {
  room: string;
  event: string;
  data: any;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SendWebsocketEvent {
  @WebSocketServer() server: Server;

  execute({ room, event, data }: SendWebsocketEventRequest) {
    this.server.to(room).emit(event, data);
  }
}
