'use client';

import {useCallback, useState} from 'react';
import {SessionUser} from "@/app/actions/session/session-user";
import PostCommentForm from "@/app/ui/components/individual-post-components/post-comment-form";
import {CommentAndUser, PopulatedComment} from "@/app/models/dto/comment-dto";
import PostComment from "@/app/ui/components/individual-post-components/comment";

interface CommentsSectionProps {
    postId: string;
    currentUser: SessionUser;
    commentsAndUsers: CommentAndUser[];
    classes?: string;
}

export default function CommentsSection({
    postId,
    currentUser,
    commentsAndUsers,
    classes = '',
}: CommentsSectionProps) {
    const [items, setItems] = useState<CommentAndUser[]>(commentsAndUsers);

    const handleNewComment = useCallback(
        (c: PopulatedComment) => {
            setItems(prev => [{ comment: c, user: currentUser }, ...prev]);
        },
        [currentUser]
    );

    return (
        <div className={`${classes} flex flex-col`}>
            <div className={"flex-1 min-h-0 overflow-y-auto"}>
                {items.map(({comment, user}) => (
                    <PostComment
                        key={comment.id}
                        commentatorId={user.id}
                        commentatorName={user.name}
                        commentatorTag={user.tag}
                        commentatorImage={user.image}
                        comment={comment.content}
                        commentedAt={comment.createdAt}
                    />
                ))}
            </div>

            <PostCommentForm
                postId={postId}
                userId={currentUser.id}
                handleNewComment={handleNewComment}
            />
        </div>
    );
}
