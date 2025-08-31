import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { FollowingService } from './following.service';
import { CreateFollowingDto } from './dto/create-following.dto';

@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Post()
  create(@Body() createFollowingDto: CreateFollowingDto) {
    return this.followingService.create(createFollowingDto);
  }

  @Get('check')
  isFollowing(
    @Query('userId') userId: string,
    @Query('followerId') followerId: string
  ) {
    return this.followingService.isFollowing(userId, followerId);
  }

  @Get('followers/:userId')
  findAllFollowersForUser(
    @Param('userId') userId: string
  ) {
    return this.followingService.findAllFollowersForUser(userId);
  }

  @Get(':userId')
  findAllWhoUserFollows(
    @Param('userId') userId: string
  ) {
    return this.followingService.findAllWhoUserFollows(userId);
  }

  @Delete(':userId/:followerId')
  remove(
    @Param('userId')   userId: string,
    @Param('followerId') followerId: string,
  ) {
    return this.followingService.remove({ userId, followerId });
  }
}
