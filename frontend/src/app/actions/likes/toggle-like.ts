'use server';

import Like from "@/app/models/like";
import { connectMongoDB } from "@/app/actions/mongo/mongodb";

export async function toggleLike(userId: string, postId: string) {
    await connectMongoDB();

    const existing = await Like.findOne({ user: userId, post: postId });

    if (existing) {
        await existing.deleteOne();
        return { liked: false };
    } else {
        await Like.create({ user: userId, post: postId });
        return { liked: true };
    }
}
