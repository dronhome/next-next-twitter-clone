import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MessagesModule } from './messages/messages.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { FollowingModule } from './following/following.module';

@Module({
  imports: [
    UserModule,
    MessagesModule,
    ChatModule,
    PrismaModule,
    CommentsModule,
    FollowingModule,
  ],
})
export class AppModule {}
