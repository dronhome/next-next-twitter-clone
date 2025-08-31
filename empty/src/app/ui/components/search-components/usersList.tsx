import {UserSummary} from "@/app/lib/useUserSearch";
import Link from "next/link";

interface UsersListProps {
    users: UserSummary[]
}

export default function UsersList({ users }: UsersListProps) {
    if (!users || !users.length) {
        return null;
    }

    return(
        <div>
            {users.map((u) => (
                <Link href={`/profile/${u.id}`} key={u.id} className="w-screen h-16 p-4 flex items-center">
                    <img
                        src={u.image}
                        alt=""
                        className="w-14 h-14 rounded-full"
                    />
                    <div className="flex-col items-center pl-2 text-white">
                        <div className="text-lg">
                            {u.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            @{u.tag}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}