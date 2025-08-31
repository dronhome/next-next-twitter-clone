"use server"

import {CreatePostSchema} from "@/app/lib/definitions";
import {getRawSession} from "@/app/actions/session/session-user";
import {connectMongoDB} from "@/app/actions/mongo/mongodb";
import Post from "@/app/models/post";

export interface CreatePostState {
    success?: boolean;
    errors?: Record<string, string[]> | undefined;
    message?: string;
}

export async function createPost(state: CreatePostState, formData: FormData): Promise<CreatePostState> {
    const validatedFields = CreatePostSchema.safeParse({
        image: formData.get("image") as string,
        title: formData.get("title") as string,
        body: formData.get("body") as string,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
            message: "Validation error",
        };
    }

    const { image, title, body } = validatedFields.data;
    const rawSession = await getRawSession();
    const author = rawSession?.userId;
    if (!author) {
        return {
            success: false,
            message: "Not authenticated",
            errors: { _error: ["You must be logged in to post."] },
        };
    }

    try {
        await connectMongoDB();
        await Post.create({
            author,
            title,
            body,
            image,
        })
        return {
            success: true,
            message: "Post created successfully",
            errors: undefined,
        }
    } catch (error) {
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return {
            success: false,
            message: "Database error",
            errors: { _error: [msg] },
        }
    }


}