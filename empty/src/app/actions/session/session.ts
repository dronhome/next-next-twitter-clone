import 'server-only';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';


const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
    throw new Error("SESSION_SECRET is not defined in environment variables.");
}
const encodedKey = new TextEncoder().encode(secretKey);

export interface Session {
    userId: string
}

export interface SessionPayload extends JWTPayload {
    userId: string;
    expiresAt: Date;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function decrypt(session: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('Failed to verify session:', error);
        return null;
    }
}

export async function createSession(userId: string): Promise<void> {
    console.log("🔍 createSession() called with userId:", userId);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });

    console.log("✅ Session token created:", session);

    const cookieStore = await cookies();

    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });

    console.log("🍪 Session cookie set successfully!");
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

