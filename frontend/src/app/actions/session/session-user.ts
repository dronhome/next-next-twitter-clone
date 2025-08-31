'use server'

import { auth } from '../auth/auth-OAuth';
import User from '../../models/user';
import { connectMongoDB } from '../mongo/mongodb';
import { cookies } from 'next/headers';
import { decrypt } from './session';
import { SessionPayload } from './session';

export interface RawSession {
    userId: string;
    isOAuth: boolean;
}

export interface SessionUser {
    id:               string;
    name?:            string;
    tag?:             string;
    email:            string;
    bio?:             string;
    image?:           string;
    image_key?:       string;
    isOAuth:          boolean;
    isProfileComplete: boolean;
}

export async function getRawSession(): Promise<RawSession | null> {
    const nextAuthSession = await auth();
    if (nextAuthSession?.user?.id) {
        console.log('Using NextAuth user ID:', nextAuthSession.user.id);
        return {
            userId:  nextAuthSession.user.id,
            isOAuth: true,
        };
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return null;

    const payload = await decrypt(sessionCookie) as SessionPayload | null;
    if (!payload?.userId) return null;


    console.log('Using JWT user ID:', payload.userId);
    return {
        userId:  payload.userId,
        isOAuth: false,
    };
}

export async function getSessionUser(): Promise<SessionUser | null> {
    const raw = await getRawSession();
    if (!raw) return null;

    await connectMongoDB();
    const userDoc = await User.findById(raw.userId).select('-password');
    if (!userDoc) return null;

    const sessionUser: SessionUser = {
        id:                userDoc._id.toString(),
        name:              userDoc.name   ?? undefined,
        tag:               userDoc.tag    ?? undefined,
        email:             userDoc.email,
        bio:               userDoc.bio    ?? undefined,
        image:             userDoc.image  ?? undefined,
        isOAuth:           raw.isOAuth,
        isProfileComplete: userDoc.isProfileComplete,
    };
    console.log('Full SessionUser ready:', sessionUser);
    return sessionUser;
}

export async function getUserById(userId: string): Promise<SessionUser | null> {
    await connectMongoDB();
    const userDoc = await User.findById(userId).select('-password');
    if (!userDoc) return null;

    const userById: SessionUser = {
        id:                userDoc._id.toString(),
        name:              userDoc.name   ?? undefined,
        tag:               userDoc.tag    ?? undefined,
        email:             userDoc.email,
        bio:               userDoc.bio    ?? undefined,
        image:             userDoc.image  ?? undefined,
        isOAuth:           userDoc.isOAuth,
        isProfileComplete: userDoc.isProfileComplete,
    };
    console.log('Full User by id ready:', userById);
    return userById;
}



