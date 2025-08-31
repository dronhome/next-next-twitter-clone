"use client";

import React, {useEffect} from "react";
import { ChatMessage } from "@/app/lib/hooks/useChat";

interface MessagesFieldProps {
    senderId: string;
    messages: ChatMessage[];
    isConnected: boolean;
    isLoadingHistory: boolean;
}

export default function MessagesField({
                                          senderId,
                                          messages,
                                          // isConnected,
                                          // isLoadingHistory,
                                      }: MessagesFieldProps) {
    return (
        <div className="flex flex-col space-y-2 p-2 overflow-y-auto">
            {messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet. Say hi!</p>
            ) : (
                messages.map((msg) => {
                    const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    const isMine = msg.from === senderId;

                    const bgClass = isMine ? "bg-indigo-400/30" : "bg-indigo-400/10";

                    const alignment = isMine ? "justify-end" : "justify-start";

                    return (
                        <div key={msg.id} className={`flex ${alignment}`}>
                            <div className={`max-w-[70%] p-2 rounded ${bgClass}`}>
                                <p className="text-white">{msg.text}</p>
                                <div className="text-right text-xs text-gray-200 mt-1">
                                    {timeString}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
