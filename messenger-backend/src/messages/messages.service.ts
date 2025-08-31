import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService) {}

    async createMessage(data: {
        from: string;
        to: string;
        text: string;
        timestamp: Date;
    }) {
        const newMsg = await this.prisma.message.create({
        data: {
            ...data
        },
        });
        return newMsg;
    }

    async findMessagesBetween(userA: string, userB: string) {
        return this.prisma.message.findMany({
            where: {
                OR: [
                { from: userA, to: userB },
                { from: userB, to: userA },
                ],
            },
            orderBy: { timestamp: 'asc' },
        });
    }

    async getChatPartners(userId: string): Promise<string[]> {
        const sent = await this.prisma.message.findMany({
            where: { from: userId },
            distinct: ['to'],
            select: { to: true },
        });
        const received = await this.prisma.message.findMany({
            where: { to: userId },
            distinct: ['from'],
            select: { from: true },
        });

        const partnerSet = new Set<string>();
        sent.forEach(r => partnerSet.add(r.to));
        received.forEach(r => partnerSet.add(r.from));
        partnerSet.delete(userId);

        return Array.from(partnerSet);
    }

    async getLastMessageBetween(userA: string, userB: string): Promise<{
        from: string;
        to: string;
        text: string;
        timestamp: Date;
    } | null> {
        return this.prisma.message.findFirst({
            where: {
                OR: [
                { from: userA, to: userB },
                { from: userB, to: userA },
                ],
            },
            orderBy: { timestamp: 'desc' },
            take: 1,
        });
    }
}
