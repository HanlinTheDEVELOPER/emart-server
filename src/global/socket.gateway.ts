import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  private readonly socketServer: Server;
  private readonly clients: Map<string, string> = new Map();
  constructor(private readonly authService: AuthService) {}
  handleConnection(socket: Socket) {
    const socketId = socket.id;
    const token = socket.handshake.auth.token;
    const payload = this.authService.verifyJwt(token);
    if (!payload) {
      socket.disconnect();
      return;
    }
    this.clients.has(payload.id) ? '' : this.clients.set(payload.id, socketId);
  }

  emitToClient(eventType: any, userId: string) {
    const socketId = this.clients.get(userId);
    this.socketServer.to(socketId).emit(eventType);
  }
}
