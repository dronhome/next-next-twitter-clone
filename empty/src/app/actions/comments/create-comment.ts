'use server'

import {CreateCommentDto, PopulatedComment} from "@/app/models/dto/comment-dto";

export type CreateCommentResult = {
    success: boolean;
    comment?: PopulatedComment;
}

export async function createCommentAction(state: CreateCommentResult, form: FormData): Promise<CreateCommentResult> {
    const rawComment: string = String(form.get('content'));
    const processedComment = rawComment.trim();
    if (!processedComment) {
        return { success: false };
    }
    const dto: CreateCommentDto = {
        postId:   String(form.get('postId')),
        userId:   String(form.get('userId')),
        content:  processedComment,
        parentId: form.get('parentId') ? Number(form.get('parentId')) : undefined,
    };
    const res = await fetch('http://localhost:3001/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(dto),
    });
    if (!res.ok) {
        return { success: false };
    }
    const createdComment: PopulatedComment = await res.json();
    return {
        success: true,
        comment: createdComment,
    }
}