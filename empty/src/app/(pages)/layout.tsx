
import "../globals.css";
import BottomNav from "@/app/ui/components/navigation-components/bottom-nav";
import { ReactNode } from "react";
import { getSessionUser } from "@/app/actions/session/session-user";
import { EdgeStoreProvider } from "@/app/lib/edgestore";
import { UserContextProvider } from '@/app/lib/user-context'; 

interface RootLayoutProps {
    children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const user = await getSessionUser();

    return (
        <html lang="en">
        <body className="relative h-screen flex flex-col bg-gray-800">
            <div className="flex-grow">
                <EdgeStoreProvider>
                    <UserContextProvider user={user}>
                        {children}
                    </UserContextProvider>
                </EdgeStoreProvider>
            </div>
            <div className="bg-gray-800 fixed bottom-0 w-full">
                {user && <BottomNav />}
            </div>
        </body>
        </html>
    );
}
