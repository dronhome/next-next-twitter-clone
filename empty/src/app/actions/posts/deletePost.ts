"use server"

import {connectMongoDB} from "@/app/actions/mongo/mongodb";
import Post from "@/app/models/post";

export async function deletePost(postId: string): Promise<boolean> {
    try {
        await connectMongoDB();
        const result = await Post.deleteOne({ _id: postId });
        return result.deletedCount === 1;
    } catch (error) {
        console.error("Failed to delete a post: ", error);
        return false;
    }
}
