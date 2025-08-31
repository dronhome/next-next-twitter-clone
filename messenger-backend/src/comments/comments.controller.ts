import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(dto);
  }

  @Get('post/:postId')
  findByPost(
    @Param('postId') postId: string
  ): Promise<Comment[]> {
    return this.commentsService.findByPost(postId);
  }

  @Post('reply/:parentId')
  reply(
    @Param('parentId', ParseIntPipe) parentId: number,
    @Body() dto: CreateCommentDto
  ): Promise<Comment> {
    return this.commentsService.reply(parentId, dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment | null> {
    return this.commentsService.findOne(id);
  }
}
