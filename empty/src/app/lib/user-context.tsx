'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { SessionUser } from '../actions/session/session-user';

const UserContext = createContext<SessionUser | null>(null);

export function UserContextProvider({
    user,
    children,
}: {
    user: SessionUser | null;
    children: ReactNode;
}) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
