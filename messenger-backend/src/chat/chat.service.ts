import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';

export interface ChatMessageDto {
    from: string;
    to: string;
    text: string;
    timestamp: Date;
}

@Injectable()
export class ChatService {
    constructor(private readonly messagesService: MessagesService) {}

    async saveMessage(data: ChatMessageDto) {
        return this.messagesService.createMessage({
            from: data.from,
            to: data.to,
            text: data.text,
            timestamp: data.timestamp,
        });
    }

    async getConversationHistory(userA: string, userB: string) {
        return this.messagesService.findMessagesBetween(userA, userB);
    }

    async getChatPartners(userId: string): Promise<string[]> {
        return this.messagesService.getChatPartners(userId);
    }

        async getLastMessageBetween(userA: string, userB: string): Promise<{
        from: string;
        to: string;
        text: string;
        timestamp: Date;
    } | null> {
        return this.messagesService.getLastMessageBetween(userA, userB);
    }
}
