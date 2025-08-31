"use client"

import {PopulatedPost} from "@/app/actions/posts/getPosts";
import {SessionUser} from "@/app/actions/session/session-user";
import StickyTop from "@/app/ui/components/feed-components/sticky-top";
import PostCard from "@/app/ui/components/feed-components/post-card";
import {useMemo, useState} from "react";
import {FollowingDto} from "@/app/models/dto/following-dto";

interface FeedWrapperProps {
    user: SessionUser;
    posts: PopulatedPost[];
    followersList: FollowingDto[] | null;
}

export default function FeedWrapper( { user, posts, followersList }: FeedWrapperProps ) {
    const [activeTab, setActiveTab] = useState<"for you" | "following">("for you");

    const followeeIds = useMemo(() => {
        if (!followersList) return new Set<string>();
        return new Set(
            followersList
                .filter((f) => f.followerId === user.id)
                .map((f) => f.userId)
        );
    }, [followersList, user.id]);

    const followingPosts = useMemo(
        () => posts.filter((post) => followeeIds.has(post.author._id)),
        [posts, followeeIds]
    );

    const displayedPosts = activeTab === "for you" ? posts : followingPosts;

    return (
        <div className="w-full flex flex-col pb-16 pt-22 text-white">
            <StickyTop
                username={user.tag}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className="w-full flex flex-col divide-y divide-gray-500 pt-0">
                {displayedPosts.length > 0 ? (
                    displayedPosts.map((post) => (
                        <div key={post._id.toString()} className="w-screen">
                                <PostCard
                                    post={post}
                                    modifiable={undefined}
                                    loggedUserId={user.id}
                                    isPostPage={false}
                                />
                        </div>
                    ))) : (
                        <p className="p-4 text-center text-gray-400">
                            {activeTab === "following"
                                ? "You’re not following anyone who’s posted yet."
                                : "No posts to show."}
                        </p>
                    )
                }
            </div>
        </div>
    );
}
