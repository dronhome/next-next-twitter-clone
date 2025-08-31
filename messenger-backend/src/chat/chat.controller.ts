import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('history')
    async getHistory(
        @Query('userA') userA: string,
        @Query('userB') userB: string,
    ): Promise<ChatMessageDto[]> {
        return this.chatService.getConversationHistory(userA, userB);
    }

    @Get('partners')
    async getChatPartners(
        @Query('userId') userId: string
    ) {
        return this.chatService.getChatPartners(userId);
    }

    @Get('last')
    async getLastMessage(
        @Query('userA') userA: string,
        @Query('userB') userB: string,
    ): Promise<ChatMessageDto | null> {
        return this.chatService.getLastMessageBetween(userA, userB);
    }
}
