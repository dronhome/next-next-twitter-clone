"use server";

import { signIn } from "./auth-OAuth";

export async function signInWithGoogle() {
    await signIn("google");
}