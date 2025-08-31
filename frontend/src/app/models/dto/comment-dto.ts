import {SessionUser} from "@/app/actions/session/session-user";

export type PopulatedComment = {
    id: number;
    postId: string;
    userId: string;
    content: string;
    parentId?: number;
    createdAt: string;
}
export type CreateCommentDto = {
    postId: string;
    userId: string;
    content: string;
    parentId?: number;
}
export type CommentAndUser = {
    comment: PopulatedComment;
    user: SessionUser;
}
