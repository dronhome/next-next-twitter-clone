import {PopulatedComment} from "@/app/models/dto/comment-dto";
import React, {useActionState, useEffect} from "react";
import {createCommentAction, CreateCommentResult} from "@/app/actions/comments/create-comment";
import {ArrowUp, Loader2} from "lucide-react";

interface PostCommentFormProps {
    postId: string;
    userId: string;
    parentId?: string;
    handleNewComment: (comment: PopulatedComment) => void;
}
export default function PostCommentForm({
    postId,
    userId,
    parentId,
    handleNewComment,
} : PostCommentFormProps) {
    const [result, formAction, isPending] = useActionState<
        CreateCommentResult, FormData
    >(
        createCommentAction,
        { success: false }
    );
    useEffect(() => {
        if (result.success && result.comment) {
            handleNewComment(result.comment);
            const input = document.getElementById("comment-input") as HTMLInputElement;
            if (input) input.value = "";
        }
    }, [result.success, result.comment, handleNewComment]);
    return(
        <form action={formAction} className="px-6 pb-2 pt-1">
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="parentId" value={parentId} />

            <div className={"flex justify-between border border-gray-200 px-2 py-2 rounded-2xl text-md"}>
                <input
                    id={"comment-input"}
                    type={"text"}
                    name={"content"}
                    placeholder={"Make a comment"}
                    className={"outline-none pl-4"}
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="hover:cursor-pointer opacity-50"
                >
                    {!isPending ?
                        <ArrowUp
                            size={20}
                            className={"hover:opacity-75"}
                        /> :
                        <Loader2
                            className={"animate-spin"}
                            size={20}
                        />
                    }
                </button>
            </div>
        </form>
    )
}

