import {SessionUser} from "@/app/actions/session/session-user";
import Link from "next/link";

export default function ChatPreview({
    user,
    lastMessage,
    lastMessageDate,
}: {
    user: SessionUser | null;
    lastMessage: string,
    lastMessageDate: string,
}) {
    if (!user) return null;

    return(
        <Link href={`/chat/${user.id}`} className="w-full flex items-center px-4 py-2">
            <div className="flex justify-center items-center w-1/5 aspect-square rounded-full overflow-hidden mr-2">
                <img
                    src={user.image}
                    className=""
                />
            </div>
            <div className={"flex justify-between w-full"}>
                <div className="flex flex-col justify-start grow ">
                    <div>
                        {user.name}
                    </div>
                    <div className="opacity-50 text-sm">
                        {lastMessage}
                    </div>
                </div>
                <div className={"text-xs opacity-50"}>
                    {lastMessageDate}
                </div>
            </div>

        </Link>
    );
}