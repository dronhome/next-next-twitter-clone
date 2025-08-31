interface HeaderProps {
    recipientTag: string | undefined;
    className?: string;
}

export default function ChatHeader({
                                       recipientTag,
                                       className = "",
                                   }: HeaderProps) {
    return (
        <div className={`flex items-center w-full justify-center p-4 text-white ${className}`}>
            <div className="font-bold text-lg">
                @{recipientTag} / <span className="text-indigo-400">Chat With</span>
            </div>
        </div>
    );
}
