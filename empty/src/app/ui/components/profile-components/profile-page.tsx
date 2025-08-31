'use client'

import Link from "next/link";
import {ExternalLink, MessageCircleMoreIcon } from "lucide-react";
import {SessionUser} from "@/app/actions/session/session-user";
import {followUser, isUserFollowed, unfollowUser} from "@/app/actions/following/following-commands";
import {useEffect, useState} from "react";

interface ProfileProps {
    user: SessionUser;
    isLoggedUser: boolean;
    followers_count: number;
    following_count: number;
    posts_count: number;
}

export default function Profile({ user, isLoggedUser, followers_count, following_count, posts_count }: ProfileProps) {
    const [isFollowing, setIsFollowing] = useState<boolean | undefined>(undefined);
    const [followers, setFollowers] = useState<number>(followers_count);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const initial = await isUserFollowed(user.id);
            if (!cancelled) setIsFollowing(initial);
        })();
        return () => { cancelled = true };
    }, [user.id]);

    const handleFollow = async () => {
        setIsFollowing(true);
        const ok = await followUser(user.id);
        if (!ok) setIsFollowing(false);
        else setFollowers(followers + 1);
    }

    const handleUnfollow = async () => {
        setIsFollowing(false);
        const ok = await unfollowUser(user.id);
        if (!ok) setIsFollowing(true);
        else setFollowers(followers - 1);
    }

    return (
        <div className="flex flex-col items-center py-4 px-10 gap-3 text-white w-full h-full">
            <div className="flex flex-col items-center text-center text-lg">
                <div className="font-bold">
                    @{user?.tag} / <span className="text-indigo-400">Profile</span>
                </div>
            </div>
            <div className="w-2/5 aspect-square rounded-full overflow-hidden bg-transparent">
                <img
                    src={user?.image == "" ? "/logos/generic-logo.jpg" : user?.image}
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <div className="text-xl">
                {user?.name}
            </div>
            <div className="flex w-full text-md justify-between">
                <div className="flex flex-col items-center w-1/3">
                    <div className="text-indigo-400">{followers >= 0 ? followers : "-"}</div>
                    <div>followers</div>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="text-indigo-400">{following_count >= 0 ? following_count : "-"}</div>
                    <div>following</div>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="text-indigo-400">{posts_count >= 0 ? posts_count : "-"}</div>
                    <div>posts</div>
                </div>
            </div>

            <div className="w-full flex justify-around gap-2">
                {isLoggedUser &&
                    <Link
                        href="/profile/edit"
                        className="flex flex-grow justify-center items-center gap-2 border border-white/50 bg-indigo-400/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-400/10 opacity-90"
                    >
                        Edit Profile
                    </Link>
                }
                {!isLoggedUser &&
                    <button onClick={!isFollowing ? handleFollow : handleUnfollow} className={`flex flex-grow justify-center items-center gap-2 border border-white/50 ${isFollowing ? "bg-red-500/60 hover:bg-red-500/50" : "bg-indigo-400/20 hover:bg-indigo-400/10"} px-4 py-2 rounded-lg cursor-pointer opacity-90`}>
                        {isFollowing ? 'Unfollow' : isFollowing !== undefined ? 'Follow' : ''}
                    </button>
                }
                {!isLoggedUser &&
                    <Link href={`/chat/${user?.id}`} className="flex justify-center items-center gap-2 border border-white/50 bg-indigo-400/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-400/10 opacity-90">
                        <MessageCircleMoreIcon width={20} />
                    </Link>
                }
                <Link
                    href="/profile/share"
                    className="flex items-center justify-center gap-2 border border-white/50 bg-indigo-400/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-400/10 opacity-90"
                >
                    <ExternalLink width={20} />
                </Link>
            </div>

            <div className="text-sm text-center">
                {user?.bio}
            </div>

            <div className="flex items-center w-full pt-3">
                <div className="h-px flex-grow bg-white/50 z-10"></div>
            </div>
        </div>
    );
}
