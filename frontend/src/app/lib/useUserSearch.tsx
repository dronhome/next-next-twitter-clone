"use client"

import {useEffect, useState} from "react";
import axios from "axios";

export interface UserSummary {
    id: string
    name?: string
    tag?: string
    image?: string
}

export function useUserSearch(term: string) {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading , setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = term.trim();
        setError(null);
        if (!q || q.length === 0) {
            setUsers([]);
            setLoading(false);
            return;
        }
        setLoading(true);

        const handle = setTimeout(async () => {
            try {
                const { data } = await axios.get<UserSummary[]>('/api/users', {
                    params: { q },
                })
                setUsers(data);
            } catch (e: unknown) {
                if (axios.isAxiosError(e)) {
                    setError(e.response?.data?.message ?? e.message)
                } else {
                    setError('Search failed')
                }
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }, 200)

        return () => clearTimeout(handle);
    }, [term]);

    return { users, loading, error };
}