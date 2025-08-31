"use client";

import { useEffect, useState } from "react";
import { TelescopeIcon } from "lucide-react";

interface StickyTopProps {
    username?: string;
    activeTab: "for you" | "following";
    setActiveTab: (activeTab: "for you" | "following") => void;
}

export default function StickyTop({ username, activeTab, setActiveTab }: StickyTopProps) {
    const [visible, setVisible] = useState(true);
    const [lastY, setLastY] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setVisible(y < lastY || y < 70);
            setLastY(y);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [lastY]);

    return (
        <div
            className={`
                        fixed top-0 left-0 right-0 z-40
                        bg-gray-800/60 border-b border-white/50
                        transition-transform duration-300
                        ${visible ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <div className="pt-4 items-center flex justify-center gap-1">

                <div className="text-white text-lg font-bold">
                    @{username} /
                </div>
                <TelescopeIcon
                    className={"text-indigo-400"}
                    size={32}
                />
            </div>

            <div className="relative flex pt-1">
                <button
                    onClick={() => setActiveTab("for you")}
                    className={`flex-1 py-2 text-sm font-bold ${
                        activeTab === "for you" ? "text-white/80" : "text-white/50"
                    }`}
                >
                    For You
                </button>
                <button
                    onClick={() => setActiveTab("following")}
                    className={`flex-1 py-2 text-sm font-bold ${
                        activeTab === "following" ? "text-white/80" : "text-white/50"
                    }`}
                >
                    Following
                </button>

                <span
                    className="
                        absolute bottom-0 h-0.5 bg-indigo-400
                        transition-all duration-300
                    "
                    style={{
                        left: activeTab === "for you" ? "0%" : "50%",
                        width: "50%"
                    }}
                />
            </div>
        </div>
    );
}
