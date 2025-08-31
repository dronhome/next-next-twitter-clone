import Link from "next/link";
import {formatDistanceToNow} from "date-fns";

interface CommentProps {
    commentatorId: string;
    commentatorName: string | undefined;
    commentatorTag: string | undefined;
    commentatorImage: string | undefined;
    comment: string;
    commentedAt: string;
}


export default function PostComment({
    commentatorId,
    commentatorName,
    commentatorTag,
    commentatorImage,
    comment,
    commentedAt,
}: CommentProps) {
    return(
        <div className={"w-full text-white flex px-2 py-1.5"}>
            <div className={"flex-none h-12 aspect-square rounded-full overflow-hidden mr-1"}>
                <img
                    className={"w-full h-full object-cover object-center"}
                    src={commentatorImage}
                />
            </div>

            <div className={"grow flex flex-col"}>
                <div className={"w-full flex items-baseline"}>
                    <Link href={`/profile/${commentatorId}`} className={"flex flex-col items-baseline w-fit mr-1"}>
                        <div className={"mr-1 text-sm"}>
                            {commentatorName}
                        </div>
                        <div className={"text-xs opacity-50 hover:opacity-30"}>
                            @{commentatorTag}
                        </div>
                    </Link>
                    <div>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(commentedAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                <div className={"text-md opacity-70"}>
                    {comment}
                </div>
            </div>
        </div>
    )
}