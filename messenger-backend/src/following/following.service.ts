import { Injectable } from '@nestjs/common';
import { CreateFollowingDto } from './dto/create-following.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFollowingDto) {
    return this.prisma.following.create( { data: dto} );
  }

  findAllFollowersForUser(userId: string) {
    return this.prisma.following.findMany({
      where: { userId },
    })
  }

  findAllWhoUserFollows(userId: string) {
    return this.prisma.following.findMany({
      where: { followerId: userId },
    })
  }

  async isFollowing(userId: string, followerId: string): Promise<boolean> {
    const cnt = await this.prisma.following.count({
      where: { userId, followerId },
    });
    return cnt > 0;
  }

  remove(dto: CreateFollowingDto) {
    return this.prisma.following.delete({
      where: {
        userId_followerId: {
          userId: dto.userId,
          followerId: dto.followerId,
        },
      },
    });
  }
}
