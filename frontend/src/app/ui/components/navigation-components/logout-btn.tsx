"use client";

import { useTransition } from "react";
import {logout} from "@/app/actions/session/logout";

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => logout())}
            disabled={isPending}
            className="btn !bg-red-600 w-3/5"
        >
            {isPending ? "Logging out..." : "Logout"}
        </button>
    );
}
