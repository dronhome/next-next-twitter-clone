import {PopulatedComment} from "@/app/models/dto/comment-dto";

export type getPostCommentResult = {
    postComments: PopulatedComment[] | null;
    success: boolean;
    statusText: string | null;
}

export async function getPostComments(postId: string): Promise<getPostCommentResult> {
    const res = await fetch(`http://localhost:3001/comments/post/${postId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return {
        postComments: null,
        success: false,
        statusText: res.statusText,
    }
    const comments = (await res.json()) as PopulatedComment[];
    return {
        postComments: comments,
        success: true,
        statusText: res.statusText,
    }
}