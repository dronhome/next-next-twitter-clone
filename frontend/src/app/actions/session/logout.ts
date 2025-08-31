"use server"

import {signOut} from "@/app/actions/auth/auth-OAuth";
import {redirect} from "next/navigation";
import {deleteSession} from "@/app/actions/session/session";


export async function logout() {
    await deleteSession();
    await signOut();
    redirect("/signin");
}

