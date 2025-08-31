"use client"

import {ReactNode, useEffect} from "react";

interface ChatBackgroundProps {
    children: ReactNode;
    classes?: string;
    bgUrl?: string;
}

export default function ChatBackground({
        children,
        classes = "",
        bgUrl = "",
    }: ChatBackgroundProps) {

    useEffect(() => {
        if (!sessionStorage.getItem('didChatReload')) {
            sessionStorage.setItem('didChatReload', '1');
            window.location.reload();
        }
    }, []);

    return (
        <div
            className={`
                w-full
                bg-cover
                bg-center
                flex
                flex-col
                h-screen
                justify-between
                ${classes}
            `}
            style={{
                    backgroundImage: `url(${bgUrl})`
            }}
        >
            {children}
        </div>
    );
}