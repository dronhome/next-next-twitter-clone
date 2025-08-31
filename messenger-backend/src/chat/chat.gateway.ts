import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private socketToUser = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  handleConnection(client: Socket) {
  }

  handleDisconnect(client: Socket) {
    this.socketToUser.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    this.socketToUser.set(client.id, userId);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { from: string; to: string; text: string; localId?: string },
  ) {
    const { from, to, text, localId } = payload;

    const saved = await this.chatService.saveMessage({
      from,
      to,
      text,
      timestamp: new Date(),
    });

    const echo = {
      id: saved.id,
      from: saved.from,
      to: saved.to,
      text: saved.text,
      timestamp: saved.timestamp.toISOString(),
      localId,
    };

    const recipientSocketId = [...this.socketToUser.entries()]
      .find(([, userId]) => userId === to)
      ?.[0];

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message', echo);
    }

    client.emit('message', echo);
  }
}
