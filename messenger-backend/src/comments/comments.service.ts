import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreateCommentDto): Promise<Comment> {
        return this.prisma.comment.create({
          data: {
            content: dto.content,
            postId: dto.postId,
            userId: dto.userId,
            parentId: dto.parentId,
          },
        });
    }

    findByPost(postId: string): Promise<Comment[]> {
        return this.prisma.comment.findMany({
            where: { postId },
            include: { replies: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    reply(parentId: number, dto: CreateCommentDto): Promise<Comment> {
            return this.prisma.comment.create({
            data: {
              content: dto.content,
              postId: dto.postId,
              userId: dto.userId,
              parentId,
            },
        });
    }

    findOne(id: number): Promise<Comment | null> {
        return this.prisma.comment.findUnique({ where: { id } });
    }
}
