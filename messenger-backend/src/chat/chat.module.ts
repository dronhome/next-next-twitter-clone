import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { MessagesModule } from '../messages/messages.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    UserModule,
    MessagesModule,
  ],
  providers: [
    ChatGateway,
    ChatService
  ],
  exports: [
    ChatService,
  ],
  controllers: [
    ChatController
  ],
})
export class ChatModule {}
