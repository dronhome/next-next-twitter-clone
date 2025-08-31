'use client';

import {useEffect, useState, useCallback, RefObject, useLayoutEffect} from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export type ChatMessage = {
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: string;
    localId?: string;
};

export interface UseChatResult {
    messages: ChatMessage[];
    isConnected: boolean;
    isLoadingHistory: boolean;
    sendMessage: (text: string) => void;
}

interface UseChatOptions {
    myId: string;
    recipientId: string;
    onError?: (err: Error) => void;
    onConnect?: () => void;
    scrollContainerRef?: RefObject<HTMLDivElement | null>;
}

export function useChat({
                            myId,
                            recipientId,
                            onError,
                            onConnect,
                            scrollContainerRef,
                        }: UseChatOptions): UseChatResult {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL!;
    const historyEndpoint = process.env.NEXT_PUBLIC_CHAT_HISTORY_PATH!;

    useEffect(() => {
        if (!myId || !recipientId) return;

        setIsLoadingHistory(true);
        fetch(`${socketUrl}${historyEndpoint}?userA=${myId}&userB=${recipientId}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<ChatMessage[]>;
            })
            .then(history => {
                setMessages(history);
            })
            .catch(err => {
                console.error('Failed to fetch history:', err);
                if (onError) onError(err);
            })
            .finally(() => {
                setIsLoadingHistory(false);
            });
    }, [myId, recipientId, socketUrl, historyEndpoint]);

    useEffect(() => {
        if (!myId) return;

        const sock = io(socketUrl, {
            auth: { userId: myId },
            autoConnect: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(sock);

        sock.on('connect', () => {
            setIsConnected(true);
            sock.emit('register', myId);
            if (onConnect) onConnect();
        });

        sock.on('disconnect', (reason) => {
            setIsConnected(false);
            console.warn('Socket disconnected:', reason);
        });

        sock.on('connect_error', (err: Error) => {
            console.error('Socket connection error:', err);
            if (onError) onError(err);
        });

        sock.on('message', (msg: ChatMessage & { localId?: string }) => {
            setMessages(prev => {
                if (msg.localId) {
                    return prev.map(m =>
                        m.id === msg.localId
                            ? {
                                ...m,
                                id: msg.id,
                                timestamp: msg.timestamp,
                            }
                            : m
                    );
                }
                return [...prev, msg];
            });
        });

        return () => {
            sock.disconnect();
            setSocket(null);
        };
    }, [myId, socketUrl]);

    const sendMessage = useCallback(
        (text: string) => {
            if (!socket || !text.trim() || !recipientId) return;

            const localId = uuidv4();
            const timestamp = new Date().toISOString();
            const optimisticMsg: ChatMessage = {
                id: localId,
                from: myId,
                to: recipientId,
                text,
                timestamp,
                localId,
            };

            setMessages(prev => [...prev, optimisticMsg]);

            socket.emit('message', {
                from: myId,
                to: recipientId,
                text,
                localId,
            });
        },
        [socket, myId, recipientId]
    );

    useLayoutEffect(() => {
        if (scrollContainerRef?.current) {
            const el = scrollContainerRef.current;
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, scrollContainerRef, isLoadingHistory]);

    return {
        messages,
        isConnected,
        isLoadingHistory,
        sendMessage,
    };
}
