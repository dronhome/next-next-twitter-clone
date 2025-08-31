import { IsString } from 'class-validator';

export class CreateFollowingDto {
  @IsString()
  userId: string;

  @IsString()
  followerId: string;
}
