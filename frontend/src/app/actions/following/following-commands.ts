"use server"

import {getSessionUser} from "@/app/actions/session/session-user";
import {FollowingDto} from "@/app/models/dto/following-dto";

const API = 'http://localhost:3001';

export async function followUser(followeeId: string): Promise<boolean> {
    const user = await getSessionUser();
    if (!user) return false;

    try {
        const res = await fetch(`${API}/following`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: followeeId,
                followerId: user.id,
            })
        })
        return res.ok;
    } catch {
        return false;
    }
}

export async function unfollowUser(followeeId: string): Promise<boolean> {
    const user = await getSessionUser();
    if (!user) return false;

    try {
        const res = await fetch(`${API}/following/${followeeId}/${user.id}`, {
            method: 'DELETE',
        })
        return res.ok;
    } catch {
        return false;
    }
}

export async function isUserFollowed(followeeId: string): Promise<boolean> {
    const user = await getSessionUser();
    if (!user) return false;

    try {
        const res = await fetch(`${API}/following/check?userId=${followeeId}&followerId=${user.id}`, {
            headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) return false;
        return await res.json() as boolean;
    } catch {
        return false;
    }
}

export async function getAllFollowers(): Promise<FollowingDto[] | null> {
    const user = await getSessionUser();
    if (!user) return null;

    try {
        const res = await fetch(`${API}/following/${user.id}`, {
            headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) return null;
        return await res.json() as FollowingDto[] | null;
    } catch {
        return null;
    }
}

export async function getFollowersCountForUser(userId: string): Promise<number> {
    try {
        const res = await fetch(`${API}/following/followers/${userId}`, {
            headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) return -1;
        const data = (await res.json()) as FollowingDto[] | null;
        return data ? data.length : 0;
    } catch {
        return -1;
    }
}

export async function getFollowingCountForUser(userId: string): Promise<number> {
    try {
        const res = await fetch(`${API}/following/${userId}`, {
            headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) return -1;
        const data = (await res.json()) as FollowingDto[] | null;
        return data ? data.length : 0;
    } catch {
        return -1;
    }
}