"use client"

import {ChatInput, MessagesField} from "@/app/ui/components/chat-componnets/";
import {useRef, useState} from "react";
import {useChat} from "@/app/lib/hooks/useChat";
import ChatHeader from "@/app/ui/components/chat-componnets/chat-header";

interface ChattingFieldProps {
    senderId: string;
    recipientId: string;
    recipientTag: string | undefined;
}

export default function ChattingField({
                                            senderId,
                                            recipientId,
                                            recipientTag,
                                      }: ChattingFieldProps) {
    const [newText, setNewText] = useState('');
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const {
        messages,
        isConnected,
        isLoadingHistory,
        sendMessage,
    } = useChat({
        myId: senderId ?? "",
        recipientId: recipientId ?? "",
        onError: (err: Error) => console.error(err),
        onConnect: () => console.log("Socket connected"),
        scrollContainerRef: scrollRef,
    });

    const handleSend = (text: string) => {
        sendMessage(text);
        setNewText("");
    };

    return(
        <div className="w-full flex flex-col h-full">
            <ChatHeader
                recipientTag={recipientTag}
                className={"border-b-[0.5px] border-gray-500 "}
            />
            <div
                className="flex-1 overflow-y-auto"
                ref={scrollRef}
            >
                <MessagesField
                    senderId={senderId}
                    messages={messages}
                    isConnected={isConnected}
                    isLoadingHistory={isLoadingHistory}
                />
            </div>
            <ChatInput
                value={newText}
                onChangeAction={(e) => setNewText(e.target.value)}
                onSendAction={handleSend}
                disabled={!isConnected || isLoadingHistory}
                className="pt-4 pb-6 px-2"
            />
        </div>
    );
}