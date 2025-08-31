import "server-only"
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { handleSignIn } from "./auth-callbacks";

export const authOptions: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            return await handleSignIn(user);
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/`;
        },
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
