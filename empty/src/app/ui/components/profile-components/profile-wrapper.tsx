'use client';

import { useState, useEffect, useRef } from 'react';
import Profile from '@/app/ui/components/profile-components/profile-page';
import MyPostsSlider from '@/app/ui/components/profile-components/my-posts-slider';
import { SessionUser } from '@/app/actions/session/session-user';
import {PopulatedPost} from "@/app/actions/posts/getPosts";
import PostCard from "@/app/ui/components/feed-components/post-card";

interface ProfileClientWrapperProps {
    user: SessionUser;
    posts: PopulatedPost[];
    isLoggedUser: boolean;
    followers_count: number;
    following_count: number;
}

export default function ProfileWrapper({ user, posts, isLoggedUser, followers_count, following_count}: ProfileClientWrapperProps) {
    const [hidden, setHidden] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderHeight, setSliderHeight] = useState(0);
    const [availableHeight, setAvailableHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setHidden(y > lastY);
            lastY = y;
        };
        const onWheel = (e: WheelEvent) => setHidden(e.deltaY > 0);
        let touchStartY = 0;
        const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
        const onTouchMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY;
            setHidden(y < touchStartY);
            touchStartY = y;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [headerRef.current?.offsetHeight]);

    useEffect(() => {
        if (sliderRef.current) {
            setSliderHeight(sliderRef.current.offsetHeight);
        }
    }, [sliderRef.current?.offsetHeight]);

    useEffect(() => {
        function update() {
            const effectiveHeader = hidden ? 0 : headerHeight;
            console.log(effectiveHeader)
            setAvailableHeight(
                window.innerHeight - effectiveHeader - sliderHeight
            );
        }
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [headerHeight, sliderHeight, hidden]);


    return (
        <div className="w-full flex flex-col grow">
            <div
                ref={headerRef}
                className={`
                    fixed left-0 right-0 top-0 z-10 bg-gray-800 transition-transform duration-300 ease-in-out
                    ${hidden ? '-translate-y-full' : 'translate-y-0'}
                `}
            >
                <Profile
                    user={user}
                    isLoggedUser={isLoggedUser}
                    followers_count={followers_count}
                    following_count={following_count}
                    posts_count={posts.length}
                />
            </div>

            <div
                className="transition-all duration-300 ease-in-out flex flex-col overflow-hidden grow"
                style={{
                    marginTop: hidden
                        ? `calc(var(--spacing) * 4)`
                        : `${headerHeight}px`
                }}
            >
                <div className={`flex flex-col items-center grow pb-6`} ref={sliderRef}>
                    <MyPostsSlider tag={user.tag} />


                    {!hidden &&
                        <div className={"text-sm mt-6 text-center opacity-100"}>
                            {isLoggedUser ? (
                                <div>
                                    Scroll down to see and modify <span className={"text-indigo-400"}>your</span> posts
                                </div>
                            ) : (
                                <div>
                                    Scroll down to see <span className={"text-indigo-400"}>{user.name}&#39;s</span> posts
                                </div>
                            )
                            }
                            
                        </div>
                    }

                    {!hidden &&
                        <div className="relative">
                            <div className="w-7 h-[3px] bg-gray-500 transform -rotate-17 absolute -left-0.5 top-5 rounded-full">
                            </div>
                            <div className="w-7 h-[3px] bg-gray-500 transform rotate-17 absolute -right-0.5 top-5 rounded-full">
                            </div>
                        </div>
                    }
                    {hidden &&
                        <div className="relative">
                            <div className="w-7 h-[3px] bg-gray-500 transform rotate-17 absolute -left-0.5 top-4 rounded-full">
                            </div>
                            <div className="w-7 h-[3px] bg-gray-500 transform -rotate-17 absolute -right-0.5 top-4 rounded-full">
                            </div>
                        </div>
                    }
                </div>
                <div
                    className={`overflow-y-auto px-0 mt-2 pb-16 ${hidden ? "border-t-[0.5px] border-gray-500" : ""} `}
                    style={{height: `${(!hidden ? 0 : (availableHeight + 56))}px`}}
                    onWheel={e => e.stopPropagation()}
                    onTouchMove={e => e.stopPropagation()}
                >
                    {hidden &&
                        <div className="w-full flex flex-col divide-y divide-gray-500 pt-0">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post._id.toString()} className="w-screen">
                                        <PostCard
                                            post={post}
                                            modifiable={isLoggedUser}
                                            loggedUserId={user.id}
                                            isPostPage={false}
                                        />
                                    </div>
                                ))) : null
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
