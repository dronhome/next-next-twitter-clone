"use client";

import React, { ChangeEvent, KeyboardEvent } from "react";
import {CornerRightUpIcon, Paperclip} from "lucide-react";

interface ChatInputProps {
    value: string;
    onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
    onSendAction: (text: string) => void;
    disabled: boolean;
    className?: string;
}

export default function ChatInput({
                                      value,
                                      onChangeAction,
                                      onSendAction,
                                      disabled,
                                      className = "",
                                  }: ChatInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !disabled && value.trim()) {
            e.preventDefault();
            onSendAction(value);
        }
    };

    const handleClick = () => {
        if (!disabled && value.trim()) {
            onSendAction(value);
        }
    };

    return (
        <div className={`w-full flex gap-2 items-center justify-between border-t-[0.5px] border-gray-500 text-white ${className}`}>
            <div className={"opacity-50 hover:opacity-80"}>
                <Paperclip
                    size={20}
                />
            </div>
            <div className={'flex flex-grow items-center gap-2 border border-white/50 rounded-2xl bg-indigo-400/10'}>
                <input
                    type="text"
                    aria-label="Type your message"
                    placeholder="Message…"
                    value={value}
                    onChange={onChangeAction}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className="flex-1 px-3 py-2 focus:outline-none focus:ring-0"
                />
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled || !value.trim()}
                    className="px-4 py-2 opacity-100 rounded disabled:opacity-50 hover:opacity-80 cursor-pointer disabled:cursor-not-allowed"
                >
                    <CornerRightUpIcon
                        size={20}
                    />
                </button>
            </div>
        </div>
    );
}
