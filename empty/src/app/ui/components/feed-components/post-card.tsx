'use client';

import {format, formatDistanceToNow } from 'date-fns';
import Link from "next/link";
import {BookmarkIcon, ExternalLinkIcon, HeartIcon, MessageCircleIcon, Repeat2Icon, TrashIcon} from "lucide-react";
import {toggleLike} from "@/app/actions/likes/toggle-like";
import {useState, useTransition} from "react";
import {PopulatedPost} from "@/app/actions/posts/getPosts";
import {deletePost} from "@/app/actions/posts/deletePost";

interface postCardProps {
    post: PopulatedPost;
    modifiable: boolean | undefined;
    loggedUserId: string;
    isPostPage: boolean;
    classes? : string;
}

export default function PostCard({
                                     post,
                                     modifiable,
                                     loggedUserId,
                                     isPostPage,
                                     classes = '',
} : postCardProps ) {
    const [isLiked, setIsLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likeCount);
    const [isPending, startTransition] = useTransition();
    const canModify = (modifiable != undefined) ? modifiable : post.author._id === loggedUserId;
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const handleLikeClick = () => {
        startTransition(async () => {
            const res = await toggleLike(loggedUserId, post._id);
            setIsLiked(res.liked);
            setLikes((prev) => prev + (res.liked ? 1 : -1));
        });
    };

    const handlePostDeleteClick = () => {
        startTransition(async () => {
            const res = await deletePost(post._id);
            setIsVisible(!res);
        })
    }

    return(
        <div className={`w-full flex flex-col pl-2 pr-8 py-4 ${classes}`}>
            <div className={"w-full flex"}>
                <div className="flex justify-center items-center w-1/6 aspect-square rounded-full overflow-hidden">
                    <img src={post.author.image} className="" alt="" />
                </div>
                <div className="w-7/8 ml-2 flex flex-col">
                    <Link href={`/profile/${post.author._id}`} className={`flex ${isPostPage ? "flex-col" : "" } items-baseline`}>
                        <p className="pr-1 text-md">
                            {post.author.name}
                        </p>
                        <p className="text-sm opacity-50 hover:opacity-30">
                            @{post.author.tag}
                        </p>
                    </Link>
                    {!isPostPage &&
                        <div>
                            <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    }

                </div>
            </div>

            <div className={`w-full ${isPostPage ? "" : "pl-[16.6667%]"}`}>
                <div className="w-full pl-2 pt-2">
                    <div className="w-full flex flex-col text-gray-200">
                        {post.title &&
                            <h1 className="text-md pb-0">{post.title}</h1>
                        }
                        <p className="text-sm pt-1 opacity-80">{post.body}</p>
                        <img src={post.image} alt="" className="rounded-md pt-2 max-w-full" />
                        {isPostPage &&
                            <div>
                                <p className="text-sm text-gray-500 pt-1">
                                    {format(post.createdAt, 'dd MMMM yyyy HH:mm:ss')}
                                </p>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex px-4 pt-3 justify-between opacity-100">
                    <div className="flex items-center gap-1">
                        <button onClick={handleLikeClick} disabled={isPending}>
                            <HeartIcon
                                size={20}
                                className={`transition ${isLiked ? 'fill-indigo-400 text-indigo-400' : 'fill-none text-gray-400'} hover:opacity-75 cursor-pointer`}
                            />
                        </button>
                        <span className="text-sm opacity-50">{likes}</span>
                    </div>
                    <Link href={`/post/${post._id}`}>
                        <MessageCircleIcon
                            size={20}
                            className="text-gray-400 hover:opacity-75 cursor-pointer"
                        />
                    </Link>
                    <Repeat2Icon size={20} className="opacity-50" />
                    <BookmarkIcon size={20} className="opacity-50" />
                    <ExternalLinkIcon size={20} className="opacity-50" />

                    {canModify ? (
                        <button onClick={handlePostDeleteClick} disabled={isPending}>
                            <TrashIcon size={20} className="opacity-90 text-red-600 hover:opacity-75" />
                        </button>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}