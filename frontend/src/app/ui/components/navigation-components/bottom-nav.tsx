"use client";

import { usePathname } from "next/navigation";
import {
    HouseIcon,
    MessageSquareText, PlusCircleIcon,
    SearchIcon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
    const pathname = usePathname();

    const isHome = pathname === "/";
    const isSearch = pathname === "/search";
    const isPost = pathname === "/new-post";
    const isChats = pathname === "/chats";
    const isProfile = pathname === "/profile";

    if (
        pathname === "/profile/edit" ||
        pathname == "/new-post" ||
        pathname.startsWith("/chat/") ||
        pathname.startsWith("/post/")
    ) return null;

    return (
        <div className="text-lg w-full bg-indigo-400/10 gap-2 h-full border-white/50 border-t-[1px]">
            <div className="w-full relative flex items-center py-2 justify-evenly h-full">
                <Link href={'/'} className={!isHome ? "text-white/50" : "text-white"}>
                    <HouseIcon />
                </Link>

                <Link href={'/search'} className={!isSearch ? "text-white/50" : "text-white"}>
                    <SearchIcon />
                </Link>

                <Link href={'/new-post'} className={!isPost ? "text-white/50" : "text-white"}>
                    <PlusCircleIcon className="h-10 w-10" />
                </Link>

                <Link href={"/chats"} className={!isChats ? "text-white/50" : "text-white"}>
                    <MessageSquareText />
                </Link>

                <Link href={'/profile'} className={!isProfile ? "text-white/50" : "text-white"}>
                    <UserIcon />
                </Link>
            </div>
        </div>
    );
}
