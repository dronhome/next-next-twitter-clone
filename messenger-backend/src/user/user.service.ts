import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    private userToSocket = new Map<string, string>();
    private socketToUser = new Map<string, string>();

    setUserSocket(userId: string, socketId: string) {
        this.userToSocket.set(userId, socketId);
        this.socketToUser.set(socketId, userId);
    }

    removeSocket(socketId: string) {
        const userId = this.socketToUser.get(socketId);
        if (userId) {
            this.socketToUser.delete(socketId);
            this.userToSocket.delete(userId);
        }
    }

  // Get socketId by userId
    getSocketId(userId: string): string | undefined {
        return this.userToSocket.get(userId);
    }

  // (Optional) Get userId by socketId
    getUserId(socketId: string): string | undefined {
        return this.socketToUser.get(socketId);
    }
}
