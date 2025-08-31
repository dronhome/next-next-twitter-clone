"use server"

import {ChatBackground, ChattingField} from "@/app/ui/components/chat-componnets";
import BackButton from "@/app/ui/components/navigation-components/back-btn";
import {getSessionUser, getUserById} from "@/app/actions/session/session-user";

interface ChatSlugPageProps {
    params: {
        recipientId: string
    };
}

export default async function ChatPage( { params }: ChatSlugPageProps ) {
    const { recipientId } = params;
    const recipientUser = await getUserById(recipientId);
    const senderUser = await getSessionUser();

    if (!senderUser || !recipientUser) {
        return(
            <p>
                No recipient or no sender found
            </p>
        );
    }

    return (
        <ChatBackground
            classes={'relative'}
            // bgUrl={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.uhdpaper.com%2Fwallpaper%2Ffrieren-sousou-no-frieren-anime-602%401%40n-phone-4k.jpg&f=1&nofb=1&ipt=f8f045b396ce3705aa389c9ed7c6ec2331bda7654314c94b0cd2914aab8bcd75"}
        >
            <BackButton/>

            <ChattingField
                senderId={senderUser.id}
                recipientId={recipientUser.id}
                recipientTag={recipientUser.tag}
            />

        </ChatBackground>

    );

}
