import ChatsPageClient from "@/app/ui/components/chat-componnets/ChatsPageClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getSessionUser, getUserById, SessionUser} from "@/app/actions/session/session-user";
import ChatPreview from "@/app/ui/components/chat-componnets/chat-preview";

type PartnerChat = {
    user: SessionUser;
    lastMessage: string;
    lastMessageDate: string;
};

export default async function ChatsPage() {
    const user = await getSessionUser();
    if (!user) return null;

    const userId = user.id;

    const res = await fetch(`http://localhost:3001/chat/partners?userId=${userId}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Could not load chat partners');

    const partnerIds: string[] = await res.json();

    const chats: (PartnerChat | null)[] = await Promise.all(
        partnerIds.map(async (otherId) => {
            const user = await getUserById(otherId);
            if (!user) return null;

            const resLast = await fetch(
                `http://localhost:3001/chat/last?userA=${userId}&userB=${otherId}`,
                { cache: "no-store" }
            );
            if (!resLast.ok) throw new Error("Could not load last message");

            const last = await resLast.json() as {
                text: string;
                timestamp: Date;
            };

            const timeString = new Date(last.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            return {
                user,
                lastMessage: last.text,
                lastMessageDate: timeString,
            };
        })
    );

    return(
        <>
            <ChatsPageClient/>
            <div className="flex flex-col items-center py-4 text-white text-md w-full h-full">
                <div className="flex flex-col items-center text-center w-full">
                    <div className="font-bold text-lg">
                        @{user?.tag} / <span className="text-indigo-400">Chats</span>
                    </div>
                </div>
                <ul className={"w-full mt-4 divide-y divide-gray-500 border-gray-500 border-t border-b"}>
                    {chats.filter((c): c is PartnerChat => !!c).map(({ user, lastMessage, lastMessageDate }) => (
                        <li key={user.id} className="w-full">
                            <ChatPreview
                                user={user}
                                lastMessage={lastMessage}
                                lastMessageDate={lastMessageDate}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}